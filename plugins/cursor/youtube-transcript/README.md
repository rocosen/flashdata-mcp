# YouTube Transcript for Cursor — FlashData

Get existing YouTube transcripts with timed segments. Selects automatic captions by default.

Use it from the command line or an MCP client. Requires Node.js **22.18+** and a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_transcript` access. Data queries use paid [FlashData Credits](https://flashdata.dev/pricing); installation is free. Pricing and job reads are free.

## Install in Cursor

This plugin's public Marketplace listing is not yet confirmed. Once published, install **YouTube Transcript — FlashData** from Cursor's Marketplace and configure `FLASHDATA_API_KEY` through the plugin's protected settings.

For local evaluation now, copy this entire plugin directory into `~/.cursor/plugins/local/youtube-transcript-flashdata/` as real files, then run **Developer: Reload Window** and check **Customize**. Do not use a symlink outside that directory. Configure the key through the plugin settings, then reload the entire Cursor window again so the server receives the saved value. Reloading only the MCP server may retain the previous configuration. Never put the key in Agent chat or commit it to a file. Organization policy can restrict local plugins.

The plugin starts `npx --yes @flashdata-dev/youtube-transcript@0.1.1 mcp`. Node.js **22.18 or newer** and npm must be available to Cursor. First launch downloads the pinned package from npm.

## Use in Cursor

Activate the `youtube-transcript-flashdata` Skill and use the `youtube-transcript-flashdata` MCP server. Its tools are `youtube_transcript`, `get_pricing`, `get_job` and `get_result`. The server rejects other sources and their jobs even when your API key has broader permissions. If you install several FlashData task integrations, choose the supporting tools from this task's server.

First check the connection without a paid data request:

> Use youtube-transcript-flashdata to call get_pricing for youtube_transcript, request_count 1. Do not submit a data query.

After approving the API cost, try:

> Retrieve the existing English automatic transcript for YouTube video dQw4w9WgXcQ once. Produce notes with timestamped citations; report a missing track without transcribing or switching tracks.

The source tool accepts these flat arguments (example values; replace them for your task):

```json
{
  "video_id": "dQw4w9WgXcQ",
  "language": "en",
  "auto": true
}
```

MCP success data is in `structuredContent`; the terminal examples below wrap it under `result`. For asynchronous calls retain the returned `id`, call this server's `get_job` with `job_id`, and read `output` after completion. For chunked MCP responses follow `result_id` and `next_offset` with `get_result` on the same server. Never automatically repeat a paid submission after a timeout.

[Full input schema](skills/youtube-transcript-flashdata/references/schema.json) · [Example arguments](skills/youtube-transcript-flashdata/references/query.json)

## Run with npx

Set `FLASHDATA_API_KEY` in your environment; the package does not load `.env` automatically.
Save this input as `query.json`:

```json
{"video_id": "dQw4w9WgXcQ", "language": "en", "auto": true}
```

Run the query and save its JSON response:

```sh
npx --yes @flashdata-dev/youtube-transcript@0.1.2 call youtube_transcript --input query.json > result.json
```

Use `--input -` for stdin. To install locally: `npm install @flashdata-dev/youtube-transcript@0.1.2`.

## Connect an MCP client

```json
{
  "mcpServers": {
    "youtube-transcript": {
      "command": "npx",
      "args": ["--yes", "@flashdata-dev/youtube-transcript@0.1.2", "mcp"],
      "env": {"FLASHDATA_API_KEY": "YOUR_API_KEY"}
    }
  }
}
```

Enter your key in protected client settings. Use `npx.cmd` on Windows if required by your client.
Tools: `youtube_transcript`, `get_pricing`, `get_job` and `get_result`. This package serves only `youtube_transcript`.

## Output

The CLI returns `{"ok":true,"tool":"youtube_transcript","result":...}`.
`result.results[0]` contains the video ID, language, caption type and segments with `start`, `end` and `text`.

auto=true selects existing automatically generated captions; it does not run speech recognition. Missing tracks do not fall back to uploader captions or another language.

[Sample response and Python processing example](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-transcript/examples.md).

## Parameters

| Parameter | Type | Required | Default and constraints |
| --- | --- | --- | --- |
| `video_id` | string | Yes | Pattern: `^[A-Za-z0-9_-]{11}$`. |
| `language` | string | No | Default: `"en"`. Pattern: `^[A-Za-z0-9-]+$`. |
| `auto` | boolean | No | Default: `true`. true selects automatically generated captions; false selects manually provided captions. Does not fall back between the two. |
| `mode` | string | No | Default: `"realtime"`. Allowed: `realtime`, `async`. |

See the [API reference](https://flashdata.dev/docs/sources/youtube_transcript) for details. The package includes `schema.json` and `examples/query.json`; `tools` lists schemas allowed by your key.

## Async jobs and errors

For asynchronous queries, add `"mode": "async"` to the input. Save the returned `result.id` as `job.json`:

```json
{"job_id":"job_REPLACE_WITH_RETURNED_ID"}
```

```sh
npx --yes @flashdata-dev/youtube-transcript@0.1.2 call get_job --input job.json > result.json
```

Read the same job until `completed`; its data is under `result.output`. Do not resubmit to check progress.
Requests are not automatically retried. If a response is lost, check your FlashData query history before submitting again.
Async JSON results are available for 24 hours.

`--help` works without an API key. `tools` and `call get_pricing` require a key and do not submit a data query.
CLI exit codes: `0` success, `1` API/tool failure, `2` invalid input/configuration. A successful job read may still be pending.
[Response limits, MCP chunks and optional settings](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-transcript/examples.md#protocol-reference).

[API documentation](https://flashdata.dev/docs/sources/youtube_transcript) · [Pricing](https://flashdata.dev/pricing) · [Source](https://github.com/rocosen/flashdata-mcp) · [Support](mailto:support@flashdata.dev)
