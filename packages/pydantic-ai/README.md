# FlashData for Pydantic AI

![FlashData](https://raw.githubusercontent.com/rocosen/flashdata-mcp/main/assets/logo.svg)

Find ranked web sources, prepare news briefings, discover places, and research YouTube videos and existing subtitles. `FlashData` is an independent Pydantic AI capability that reads current schemas from the existing FlashData MCP service. It provides 14 query tools plus free pricing/job/result reads. The fifteenth workflow, media delivery to your own storage, uses the existing protected local CLI. See all [15 task workflows](https://github.com/rocosen/flashdata-mcp/blob/main/packages/pydantic-ai/workflows.md).

**Free to install; data calls spend your own paid [FlashData Credits](https://flashdata.dev/pricing).** Model and storage costs are separate. This package is maintained by FlashData and is not a first-party Pydantic integration. A Git release, PyPI release, and official ecosystem listing are separate milestones.

## Install and configure

Use Python 3.11+. The adapter is tested with Pydantic AI 2.61.0, FastMCP 4.1.3 and HTTPX2 2.16.0. Install from the public source release:

```sh
pip install 'pydantic-ai-flashdata @ git+https://github.com/rocosen/flashdata-mcp.git@pydantic-ai-v0.1.0#subdirectory=packages/pydantic-ai'
```

The package name in this repository does not establish PyPI availability. Review the pinned source before installation.

Get your [API key](https://flashdata.dev/app/api-keys) and supply `FLASHDATA_API_KEY` through your launching environment or secret manager. Do not put the value in code, YAML, chat or logs. No credential files are read. Importing the package or constructing the capability does not connect or spend Credits. Discovery starts when an agent run enters the toolset and contacts `https://data.flashdata.dev/mcp` with `X-API-Key`.

```python
from pydantic_ai import Agent, DeferredToolRequests
from pydantic_ai_flashdata import FlashData

agent = Agent(
    "openai:gpt-4.1-mini",  # choose your configured model; model fees are separate
    capabilities=[FlashData(sources=["google_search", "google_news", "youtube_transcript"])],
    output_type=[str, DeferredToolRequests],
)
```

Omit `sources` to offer all 14 query sources. Pass an explicit nonempty selection to scope an agent. Each run gets its own MCP toolset and HTTP client; the key is read when connecting and the client is closed with the session. This is an environment-based configuration for one credential identity per application process, not a multi-tenant key store.

## Review a paid request

Ask the agent to prepare a request and read `get_pricing` for its source. Every query tool is wrapped with Pydantic AI's approval mechanism; `get_pricing`, `get_job`, and `get_result` are free reads. Your application must handle `DeferredToolRequests`, display the current price and exact arguments to the user, and resume only after their decision. Do not approve all deferred calls automatically. Include `DeferredToolRequests` in the output type as above.

For example:

> Prepare a US English search for battery recycling research, requesting 10 results. Show the current Google Search price and exact request. Wait for my approval before submitting.

Use [Pydantic AI's approval flow](https://pydantic.dev/docs/ai/toolsets/#requiring-tool-approval) to pass decisions through `DeferredToolResults`. A denied request is not submitted. The adapter requests no model sampling, forwards no server instructions, excludes batch/download submissions and uses no provider-native MCP relay. HTTP redirects and environment proxies are disabled. Failed calls raise a generic error with no automatic retry; an interrupted query may already have been accepted and charged, so inspect existing Jobs before deciding to resubmit.

Save returned source URLs, IDs, timestamps and actual counts. For an asynchronous query, retain its job ID and use `get_job` and `get_result`; pending is not completion. Read only results the user has authorized. Tool results may contain private data and links. Configure your application's model-message and tracing retention appropriately; this adapter does not promise to sanitize all returned research data.

## Agent specs

The stable serialization name is `FlashData`. Configuration contains only source names and an optional environment-variable name. The inherited `from_spec()` constructs the capability without credentials or network activity.

```yaml
# agent.yaml
model: openai:gpt-4.1-mini
capabilities:
  - FlashData:
      sources: [google_search, google_news, youtube_transcript]
      api_key_env: FLASHDATA_API_KEY
```

```python
from pydantic_ai import Agent, DeferredToolRequests
from pydantic_ai_flashdata import FlashData

agent = Agent.from_file(
    "agent.yaml",
    custom_capability_types=[FlashData],
    output_type=[str, DeferredToolRequests],
)
```

## Media delivery and source limits

`youtube_download` is deliberately absent from the model-facing toolset. Use the [protected local download workflow](https://github.com/rocosen/flashdata-mcp/blob/main/packages/pydantic-ai/workflows.md#youtube_download) with Node.js 22.18+, your authorized storage, scoped storage credentials, content rights and byte-based cost approval. Credentials are sent to FlashData for delivery. Keep populated request files and delivery manifests outside agents, notebook outputs and telemetry. Storage charges are separate; a request-count quote is not a download estimate. Follow existing async jobs instead of blindly repeating submissions.

News does not promise article full text. Images returns metadata and URLs, not downloaded image files. Shopping does not guarantee stock or checkout prices. Places contact fields may be absent. YouTube Search requests at most 20 results and Extended at most 700 with different rates; neither guarantees counts. Transcript defaults to `auto=true`, Captions to `auto=false`; both retrieve existing tracks with no ASR or translation. License/CC labels do not grant training rights.

## Validation and maintenance

Offline checks use the real Pydantic AI host with synthetic MCP responses, no external sockets, and no paid data/model call or storage write. They cover discovered schemas, source selection, approval/deferred execution, serialization, credentials, redirects and one-attempt failures. This is installation/protocol verification, not live retrieval validation.

From this package directory, run `uv sync --frozen`, `uv run pytest`, `uv run ruff check .`, `uv run ruff format --check .`, `uv run python -m build`, `uv run twine check dist/*`, and `uv run python scripts/verify_install.py`.

MIT license. [Support](https://github.com/rocosen/flashdata-mcp/issues), [privacy](https://flashdata.dev/legal/privacy), [terms](https://flashdata.dev/legal/terms), [source documentation](https://flashdata.dev/docs?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=combined).
