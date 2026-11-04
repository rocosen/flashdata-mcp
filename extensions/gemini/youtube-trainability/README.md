# YouTube Creative Commons License Metadata for Gemini CLI — FlashData

Read a YouTube video’s Creative Commons license-label metadata as JSON.

Use it from the command line or an MCP client. Requires Node.js **22.18+** and a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_trainability` access. Data queries use paid [FlashData Credits](https://flashdata.dev/pricing); installation is free. Pricing and job reads are free.

## Install in Gemini CLI

Install from this extension's repository (GitHub installation and gallery indexing are separate):

```sh
gemini extensions install https://github.com/rocosen/youtube-trainability-gemini
```

Review the extension and enter your own FlashData API key at the sensitive setting prompt. To change it later, run `gemini extensions config youtube-trainability-flashdata`. Restart Gemini CLI after configuration. Run `gemini extensions list`, `gemini skills list --all` and `gemini mcp list` to inspect installation, Skill availability and connection.

Node.js **22.18 or newer**, npm and Git must be available. The extension starts `npx --yes @flashdata-dev/youtube-trainability@0.1.1 mcp`; first launch downloads the pinned package. Local evaluation also supports `gemini extensions install /absolute/path/to/this-extension`. Model access and fees are separate; this does not claim Antigravity CLI compatibility.

## Use in Gemini CLI

Activate the `youtube-trainability-flashdata` Skill and use the `youtube-trainability-flashdata` MCP server. Its tools are `youtube_trainability`, `get_pricing`, `get_job` and `get_result`. The server rejects other sources and their jobs even when your API key has broader permissions. If you install several FlashData task integrations, choose the supporting tools from this task's server.

First check the connection without a paid data request:

> Use youtube-trainability-flashdata to call get_pricing for youtube_trainability, request_count 1. Do not submit a data query.

After approving the API cost, try:

> Inspect the license-label classification for YouTube video dQw4w9WgXcQ with one request. Record the raw permitted field beside the video ID, without treating it as training authorization.

The source tool accepts these flat arguments (example values; replace them for your task):

```json
{
  "video_id": "dQw4w9WgXcQ"
}
```

MCP success data is in `structuredContent`; the terminal examples below wrap it under `result`. For asynchronous calls retain the returned `id`, call this server's `get_job` with `job_id`, and read `output` after completion. For chunked MCP responses follow `result_id` and `next_offset` with `get_result` on the same server. Never automatically repeat a paid submission after a timeout.

[Full input schema](skills/youtube-trainability-flashdata/references/schema.json) · [Example arguments](skills/youtube-trainability-flashdata/references/query.json)

## Run with npx

Set `FLASHDATA_API_KEY` in your environment; the package does not load `.env` automatically.
Save this input as `query.json`:

```json
{"video_id": "dQw4w9WgXcQ"}
```

Run the query and save its JSON response:

```sh
npx --yes @flashdata-dev/youtube-trainability@0.1.2 call youtube_trainability --input query.json > result.json
```

Use `--input -` for stdin. To install locally: `npm install @flashdata-dev/youtube-trainability@0.1.2`.

## Connect an MCP client

```json
{
  "mcpServers": {
    "youtube-trainability": {
      "command": "npx",
      "args": ["--yes", "@flashdata-dev/youtube-trainability@0.1.2", "mcp"],
      "env": {"FLASHDATA_API_KEY": "YOUR_API_KEY"}
    }
  }
}
```

Enter your key in protected client settings. Use `npx.cmd` on Windows if required by your client.
Tools: `youtube_trainability`, `get_pricing`, `get_job` and `get_result`. This package serves only `youtube_trainability`.

## Output

The CLI returns `{"ok":true,"tool":"youtube_trainability","result":...}`.
`result.results[0]` contains `videoId` and the returned `permitted` classification.

The tool name is youtube_trainability, but it checks a license label. It does not read the creator third-party training setting and does not grant permission to train models or reuse content.

[Sample response and Python processing example](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-trainability/examples.md).

## Parameters

| Parameter | Type | Required | Default and constraints |
| --- | --- | --- | --- |
| `video_id` | string | Yes | Pattern: `^[A-Za-z0-9_-]{11}$`. |
| `mode` | string | No | Default: `"realtime"`. Allowed: `realtime`, `async`. |

See the [API reference](https://flashdata.dev/docs/sources/youtube_trainability) for details. The package includes `schema.json` and `examples/query.json`; `tools` lists schemas allowed by your key.

## Async jobs and errors

For asynchronous queries, add `"mode": "async"` to the input. Save the returned `result.id` as `job.json`:

```json
{"job_id":"job_REPLACE_WITH_RETURNED_ID"}
```

```sh
npx --yes @flashdata-dev/youtube-trainability@0.1.2 call get_job --input job.json > result.json
```

Read the same job until `completed`; its data is under `result.output`. Do not resubmit to check progress.
Requests are not automatically retried. If a response is lost, check your FlashData query history before submitting again.
Async JSON results are available for 24 hours.

`--help` works without an API key. `tools` and `call get_pricing` require a key and do not submit a data query.
CLI exit codes: `0` success, `1` API/tool failure, `2` invalid input/configuration. A successful job read may still be pending.
[Response limits, MCP chunks and optional settings](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-trainability/examples.md#protocol-reference).

[API documentation](https://flashdata.dev/docs/sources/youtube_trainability) · [Pricing](https://flashdata.dev/pricing) · [Source](https://github.com/rocosen/flashdata-mcp) · [Support](mailto:support@flashdata.dev)
