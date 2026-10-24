import json
from pathlib import Path

import httpx2
import pytest
from pydantic_ai import Agent, DeferredToolRequests, DeferredToolResults
from pydantic_ai.messages import ModelResponse, TextPart, ToolCallPart, ToolReturnPart
from pydantic_ai.models.function import FunctionModel
from pydantic_ai.models.test import TestModel

from pydantic_ai_flashdata import QUERY_SOURCES, FlashData, capability

DATA = Path(__file__).parent / "data"
TOOLS = json.loads((DATA / "tools.json").read_text())
REQUESTS = json.loads((DATA / "requests.json").read_text())
KEY = "offline-key-not-for-production"


class ProtocolFixture:
    def __init__(self, mode=None):
        self.mode = mode
        self.calls = []
        self.requests = []
        self.clients = []

    def handle(self, request):
        self.requests.append(request)
        assert str(request.url) == capability.ENDPOINT
        assert request.headers["X-API-Key"] == KEY
        if request.method != "POST":
            return httpx2.Response(405)
        body = json.loads(request.content)
        if "id" not in body:
            return httpx2.Response(202)
        if body["method"] == "server/discover":
            return httpx2.Response(
                200,
                json={
                    "jsonrpc": "2.0",
                    "id": body["id"],
                    "error": {"code": -32601, "message": "Use the legacy initialize handshake"},
                },
            )
        if body["method"] == "initialize":
            result = {
                "protocolVersion": "2025-03-26",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "synthetic-flashdata", "version": "0"},
            }
        elif body["method"] == "tools/list":
            cursor = body.get("params", {}).get("cursor")
            result = {"tools": TOOLS[8:] if cursor else TOOLS[:8]}
            if not cursor:
                result["nextCursor"] = "page2"
        elif body["method"] == "tools/call":
            self.calls.append(body["params"])
            if self.mode == "timeout":
                raise httpx2.ReadTimeout(KEY, request=request)
            if self.mode == "redirect":
                return httpx2.Response(307, headers={"Location": "https://other.invalid/"})
            result = {
                "isError": self.mode == "error",
                "content": [{"type": "text", "text": json.dumps({"fixture": True})}],
            }
        else:
            raise AssertionError(body["method"])
        return httpx2.Response(200, json={"jsonrpc": "2.0", "id": body["id"], "result": result})

    def install(self, monkeypatch):
        original = httpx2.AsyncClient

        def client(**kwargs):
            assert kwargs["follow_redirects"] is False
            assert kwargs["trust_env"] is False
            value = original(**kwargs, transport=httpx2.MockTransport(self.handle))
            self.clients.append(value)
            return value

        monkeypatch.setenv("FLASHDATA_API_KEY", KEY)
        monkeypatch.setattr(capability.httpx2, "AsyncClient", client)


def model_calling(name, arguments):
    def respond(messages, info):
        if any(isinstance(part, ToolReturnPart) for message in messages for part in message.parts):
            return ModelResponse(parts=[TextPart("Fixture complete")])
        assert name in {t.name for t in info.function_tools}
        return ModelResponse(parts=[ToolCallPart(name, arguments, tool_call_id="call-fixture")])

    return FunctionModel(respond)


@pytest.mark.parametrize("source", QUERY_SOURCES)
async def test_paid_query_is_deferred_then_called_once(monkeypatch, source):
    fixture = ProtocolFixture()
    fixture.install(monkeypatch)
    agent = Agent(
        model_calling(source, REQUESTS[source]),
        capabilities=[FlashData()],
        output_type=[str, DeferredToolRequests],
    )
    result = await agent.run("Prepare the fixture request")
    assert isinstance(result.output, DeferredToolRequests)
    assert len(result.output.approvals) == 1
    assert not fixture.calls
    await agent.run(
        message_history=result.all_messages(),
        deferred_tool_results=DeferredToolResults(approvals={"call-fixture": True}),
    )
    assert len(fixture.calls) == 1
    assert fixture.calls[0]["name"] == source
    assert fixture.calls[0]["arguments"] == REQUESTS[source]
    assert all(c.is_closed for c in fixture.clients)


async def test_declined_request_never_submits(monkeypatch):
    fixture = ProtocolFixture()
    fixture.install(monkeypatch)
    agent = Agent(
        model_calling("google_search", REQUESTS["google_search"]),
        capabilities=[FlashData()],
        output_type=[str, DeferredToolRequests],
    )
    result = await agent.run("Prepare")
    await agent.run(
        message_history=result.all_messages(),
        deferred_tool_results=DeferredToolResults(approvals={"call-fixture": False}),
    )
    assert not fixture.calls


@pytest.mark.parametrize(
    "name,args",
    [
        ("get_pricing", {"source": "google_search"}),
        ("get_job", {"job_id": "job_fixture"}),
        ("get_result", {"result_id": "result_fixture"}),
    ],
)
async def test_free_reads_do_not_need_approval(monkeypatch, name, args):
    fixture = ProtocolFixture()
    fixture.install(monkeypatch)
    agent = Agent(
        model_calling(name, args),
        capabilities=[FlashData()],
        output_type=[str, DeferredToolRequests],
    )
    result = await agent.run("Read the authorized fixture")
    assert isinstance(result.output, str)
    assert len(fixture.calls) == 1


@pytest.mark.parametrize("sources", [None, ["google_search", "youtube_transcript"]])
async def test_current_schemas_selection_and_no_submission(monkeypatch, sources):
    fixture = ProtocolFixture()
    fixture.install(monkeypatch)
    seen = []

    def inspect_tools(messages, info):
        seen.extend(info.function_tools)
        return ModelResponse(parts=[TextPart("Discovery only")])

    await Agent(FunctionModel(inspect_tools), capabilities=[FlashData(sources)]).run("Inspect")
    expected = set(QUERY_SOURCES if sources is None else sources) | capability.READ_TOOLS
    assert {t.name for t in seen} == expected
    assert "youtube_download" not in expected and "submit_batch" not in expected
    schemas = {t["name"]: t["inputSchema"] for t in TOOLS}
    assert all(t.parameters_json_schema == schemas[t.name] for t in seen)
    assert not fixture.calls


@pytest.mark.parametrize("mode", ["timeout", "redirect", "error"])
async def test_failed_paid_submission_is_not_retried(monkeypatch, mode):
    fixture = ProtocolFixture(mode)
    fixture.install(monkeypatch)
    agent = Agent(
        model_calling("google_search", REQUESTS["google_search"]),
        capabilities=[FlashData()],
        output_type=[str, DeferredToolRequests],
    )
    result = await agent.run("Prepare")
    with pytest.raises(RuntimeError, match="No automatic retry") as error:
        await agent.run(
            message_history=result.all_messages(),
            deferred_tool_results=DeferredToolResults(approvals={"call-fixture": True}),
        )
    assert KEY not in str(error.value)
    assert len(fixture.calls) == 1
    assert all(str(r.url) == capability.ENDPOINT for r in fixture.requests)


def test_agent_spec_construction_without_credentials_or_network(monkeypatch, tmp_path):
    monkeypatch.delenv("FLASHDATA_API_KEY", raising=False)
    spec = tmp_path / "agent.json"
    spec.write_text(
        json.dumps(
            {
                "model": "test",
                "capabilities": [
                    {
                        "FlashData": {
                            "sources": ["google_search"],
                            "api_key_env": "FLASHDATA_API_KEY",
                        }
                    }
                ],
            }
        )
    )
    agent = Agent.from_file(
        spec, custom_capability_types=[FlashData], output_type=[str, DeferredToolRequests]
    )
    assert agent is not None
    assert FlashData.from_spec(sources=["google_search"]).sources == ("google_search",)
    assert FlashData.get_serialization_name() == "FlashData"


@pytest.mark.parametrize(
    "sources",
    [[], ["youtube_download"], ["unknown"], ["google_search", "google_search"], "google_search"],
)
def test_invalid_selection(sources):
    with pytest.raises(ValueError):
        FlashData(sources)


async def test_missing_key_stops_before_connecting(monkeypatch):
    monkeypatch.delenv("FLASHDATA_API_KEY", raising=False)
    agent = Agent(TestModel(call_tools=[]), capabilities=[FlashData()])
    with pytest.raises(Exception, match="FlashData API key"):
        await agent.run("Discover")
