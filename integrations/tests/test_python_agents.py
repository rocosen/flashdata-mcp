import importlib
import json
from pathlib import Path
from typing import Any

import httpx
import httpx2
import pytest

from integrations.python_tools import ALLOWED_TOOLS, FAILURE, QUERY_TOOLS, ResearchTools
from registry.examples.call_tool import ENDPOINT

ROOT = Path(__file__).resolve().parents[2]
REQUESTS = {
    name: json.loads((ROOT / "registry/examples" / f"{name}.json").read_text())[
        "arguments"
    ]
    for name in QUERY_TOOLS
}


async def yes(name, arguments):
    return True


class MCPFixture:
    def __init__(self, *, failure: str | None = None, text_result: bool = False):
        self.calls: list[dict[str, Any]] = []
        self.failure = failure
        self.text_result = text_result

    def handle(self, request: httpx.Request) -> httpx.Response:
        assert str(request.url) == ENDPOINT
        assert request.headers["X-API-Key"] == "test-only-key"
        if request.method != "POST":
            return httpx.Response(405)
        payload = json.loads(request.content)
        if "id" not in payload:
            return httpx.Response(202)
        method = payload["method"]
        if method == "initialize":
            result = {
                "protocolVersion": "2025-03-26",
                "capabilities": {"tools": {}},
                "serverInfo": {"name": "fixture", "version": "1"},
            }
        elif method == "tools/list":
            names = ALLOWED_TOOLS | {"youtube_download", "submit_batch", "future_write"}
            result = {
                "tools": [
                    {
                        "name": name,
                        "description": "Fixture tool",
                        "inputSchema": {"type": "object"},
                    }
                    for name in sorted(names)
                ]
            }
        else:
            assert method == "tools/call"
            self.calls.append(payload["params"])
            if self.failure == "redirect":
                return httpx.Response(
                    307, headers={"Location": "https://untrusted.invalid/mcp"}
                )
            if self.failure == "timeout":
                raise httpx.ReadTimeout(
                    "private-url-and-storage-secret", request=request
                )
            if self.failure == "tool":
                result = {
                    "isError": True,
                    "content": [{"type": "text", "text": "private-secret"}],
                }
            else:
                name = payload["params"]["name"]
                body = {
                    "source": name,
                    "results": [
                        {"title": "Fixture only", "url": "https://example.com"}
                    ],
                }
                if name == "get_job":
                    body = {
                        "job": {
                            "id": "job_fixture",
                            "source": "youtube_download",
                            "status": "completed",
                        },
                        "output": {"signed_url": "private-url-and-storage-secret"},
                    }
                if name == "get_result":
                    body = {
                        "result_id": "result_fixture",
                        "next_offset": 12,
                        "chunk": "fixture-part",
                    }
                result = {"content": [{"type": "text", "text": json.dumps(body)}]}
                if not self.text_result:
                    result["structuredContent"] = body
        return httpx.Response(
            200, json={"jsonrpc": "2.0", "id": payload["id"], "result": result}
        )

    def bridge(self, approval=yes):
        return ResearchTools(
            "test-only-key",
            transport=httpx.MockTransport(self.handle),
            approval=approval,
        )


@pytest.mark.asyncio
@pytest.mark.parametrize("name", sorted(QUERY_TOOLS))
async def test_real_mcp_call_and_deduplication(name):
    fixture = MCPFixture()
    bridge = fixture.bridge()
    first = await bridge.execute("same-call", name, REQUESTS[name])
    second = await bridge.execute("same-call", name, REQUESTS[name])
    assert first == second and first["source"] == name
    assert fixture.calls == [{"name": name, "arguments": REQUESTS[name]}]


@pytest.mark.asyncio
async def test_catalog_excludes_secret_storage_and_batch():
    fixture = MCPFixture()
    catalog = await fixture.bridge().catalog()
    assert {t["name"] for t in catalog} == ALLOWED_TOOLS
    assert not fixture.calls


@pytest.mark.asyncio
@pytest.mark.parametrize("name", ["youtube_download", "submit_batch", "future_write"])
async def test_disallowed_tool_never_submitted(name):
    fixture = MCPFixture()
    assert "error" in await fixture.bridge().execute("call", name, {})
    assert not fixture.calls


@pytest.mark.asyncio
async def test_denied_query_never_submitted_or_reapproved():
    approvals = []

    async def no(name, arguments):
        approvals.append(name)
        return False

    fixture = MCPFixture()
    bridge = fixture.bridge(no)
    for _ in range(2):
        assert "error" in await bridge.execute("call", "google_search", {})
    assert approvals == ["google_search"] and not fixture.calls


@pytest.mark.asyncio
@pytest.mark.parametrize("failure", ["redirect", "timeout", "tool"])
async def test_error_not_retried_or_leaked(failure):
    fixture = MCPFixture(failure=failure)
    bridge = fixture.bridge()
    for _ in range(2):
        assert await bridge.execute("call", "google_search", {}) == {"error": FAILURE}
    assert len(fixture.calls) == 1


@pytest.mark.asyncio
async def test_download_job_suppresses_output_and_chunks_survive():
    bridge = MCPFixture(text_result=True).bridge()
    result = await bridge.execute("job", "get_job", {"job_id": "job_fixture"})
    assert result["job"] == {"id": "job_fixture", "status": "completed"}
    assert "output" not in result and "storage-secret" not in json.dumps(result)
    result = await bridge.execute(
        "chunk", "get_result", {"result_id": "result_fixture"}
    )
    assert result["next_offset"] == 12 and result["chunk"] == "fixture-part"


@pytest.mark.asyncio
@pytest.mark.parametrize("provider", ["openai", "anthropic"])
async def test_real_provider_sdk_tool_result_order(provider):
    fixture = MCPFixture()
    requests = []
    names = ["google_search", "youtube_transcript"]

    def handle(request):
        payload = json.loads(request.content)
        requests.append(payload)
        assert "test-only-key" not in request.content.decode()
        assert {t["name"] for t in payload["tools"]} == ALLOWED_TOOLS
        if provider == "openai":
            if len(requests) == 1:
                output = [
                    {
                        "type": "reasoning",
                        "id": "rs_test",
                        "summary": [],
                        "encrypted_content": "fixture",
                    }
                ]
                output += [
                    {
                        "type": "function_call",
                        "id": f"fc_{i}",
                        "call_id": f"call_{i}",
                        "name": n,
                        "arguments": json.dumps(REQUESTS[n]),
                        "status": "completed",
                    }
                    for i, n in enumerate(names)
                ]
            else:
                history = payload["input"]
                assert [x.get("type") for x in history[1:]] == [
                    "reasoning",
                    "function_call",
                    "function_call",
                    "function_call_output",
                    "function_call_output",
                ]
                assert [x["call_id"] for x in history[-2:]] == ["call_0", "call_1"]
                output = [
                    {
                        "type": "message",
                        "id": "msg_test",
                        "role": "assistant",
                        "status": "completed",
                        "content": [
                            {
                                "type": "output_text",
                                "text": "Fixture answer",
                                "annotations": [],
                            }
                        ],
                    }
                ]
            body = {
                "id": "resp_test",
                "object": "response",
                "status": "completed",
                "created_at": 0,
                "model": "fixture-model",
                "output": output,
            }
        else:
            if len(requests) == 1:
                content = [{"type": "text", "text": "I will research."}] + [
                    {
                        "type": "tool_use",
                        "id": f"call_{i}",
                        "name": n,
                        "input": REQUESTS[n],
                    }
                    for i, n in enumerate(names)
                ]
                reason = "tool_use"
            else:
                messages = payload["messages"]
                assert [m["role"] for m in messages] == ["user", "assistant", "user"]
                assert len(messages[1]["content"]) == 3
                assert all(x["type"] == "tool_result" for x in messages[2]["content"])
                assert [x["tool_use_id"] for x in messages[2]["content"]] == [
                    "call_0",
                    "call_1",
                ]
                content = [{"type": "text", "text": "Fixture answer"}]
                reason = "end_turn"
            body = {
                "id": "msg_test",
                "type": "message",
                "role": "assistant",
                "model": "fixture-model",
                "content": content,
                "stop_reason": reason,
                "stop_sequence": None,
                "usage": {"input_tokens": 0, "output_tokens": 0},
            }
        return httpx2.Response(200, json=body)

    sdk = importlib.import_module(provider)
    client_class = sdk.AsyncOpenAI if provider == "openai" else sdk.AsyncAnthropic
    async with client_class(
        api_key="model-test-key",
        max_retries=0,
        http_client=sdk.DefaultAsyncHttpxClient(
            transport=httpx2.MockTransport(handle),
            trust_env=False,
            follow_redirects=False,
        ),
    ) as client:
        run = importlib.import_module(f"integrations.{provider}.research").research
        assert (
            await run(client, fixture.bridge(), "fixture-model", "Research fixture")
            == "Fixture answer"
        )
    assert len(requests) == 2 and len(fixture.calls) == 2


@pytest.mark.asyncio
@pytest.mark.parametrize("provider", ["openai", "anthropic"])
async def test_provider_error_not_retried(provider):
    requests = []

    def handle(request):
        requests.append(request)
        return httpx2.Response(
            500, json={"error": {"message": "fixture", "type": "api_error"}}
        )

    sdk = importlib.import_module(provider)
    client_class = sdk.AsyncOpenAI if provider == "openai" else sdk.AsyncAnthropic
    fixture = MCPFixture()
    async with client_class(
        api_key="model-test-key",
        max_retries=0,
        http_client=sdk.DefaultAsyncHttpxClient(transport=httpx2.MockTransport(handle)),
    ) as client:
        run = importlib.import_module(f"integrations.{provider}.research").research
        with pytest.raises(sdk.APIStatusError):
            await run(client, fixture.bridge(), "fixture-model", "Research fixture")
    assert len(requests) == 1 and not fixture.calls
