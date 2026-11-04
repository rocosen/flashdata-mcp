# Google Video Search for Cursor — FlashData

Search Google Videos across websites and return video titles, links, sources and available durations as JSON.

Use it from the command line or an MCP client. Requires Node.js **22.18+** and a [FlashData API key](https://flashdata.dev/app/api-keys) with `google_videos` access. Data queries use paid [FlashData Credits](https://flashdata.dev/pricing); installation is free. Pricing and job reads are free.

## Install in Cursor

This plugin's public Marketplace listing is not yet confirmed. Once published, install **Google Video Search — FlashData** from Cursor's Marketplace and configure `FLASHDATA_API_KEY` through the plugin's protected settings.

For local evaluation now, copy this entire plugin directory into `~/.cursor/plugins/local/google-video-search-flashdata/` as real files, then run **Developer: Reload Window** and check **Customize**. Do not use a symlink outside that directory. Configure the key through the plugin settings, then reload the entire Cursor window again so the server receives the saved value. Reloading only the MCP server may retain the previous configuration. Never put the key in Agent chat or commit it to a file. Organization policy can restrict local plugins.

The plugin starts `npx --yes @flashdata-dev/google-video-search@0.1.1 mcp`. Node.js **22.18 or newer** and npm must be available to Cursor. First launch downloads the pinned package from npm.

## Use in Cursor

Activate the `google-video-search-flashdata` Skill and use the `google-video-search-flashdata` MCP server. Its tools are `google_videos`, `get_pricing`, `get_job` and `get_result`. The server rejects other sources and their jobs even when your API key has broader permissions. If you install several FlashData task integrations, choose the supporting tools from this task's server.

First check the connection without a paid data request:

> Use google-video-search-flashdata to call get_pricing for google_videos, request_count 1. Do not submit a data query.

After approving the API cost, try:

> Search Google Videos once for battery recycling process demonstrations. Request 10 results and group the returned titles, URLs and available durations by website.

The source tool accepts these flat arguments (example values; replace them for your task):

```json
{
  "query": "battery recycling process",
  "num": 10
}
```

MCP success data is in `structuredContent`; the terminal examples below wrap it under `result`. For asynchronous calls retain the returned `id`, call this server's `get_job` with `job_id`, and read `output` after completion. For chunked MCP responses follow `result_id` and `next_offset` with `get_result` on the same server. Never automatically repeat a paid submission after a timeout.

[Full input schema](skills/google-video-search-flashdata/references/schema.json) · [Example arguments](skills/google-video-search-flashdata/references/query.json)

## Run with npx

Set `FLASHDATA_API_KEY` in your environment; the package does not load `.env` automatically.
Save this input as `query.json`:

```json
{"query": "battery recycling process", "num": 10}
```

Run the query and save its JSON response:

```sh
npx --yes @flashdata-dev/google-video-search@0.1.2 call google_videos --input query.json > result.json
```

Use `--input -` for stdin. To install locally: `npm install @flashdata-dev/google-video-search@0.1.2`.

## Connect an MCP client

```json
{
  "mcpServers": {
    "google-video-search": {
      "command": "npx",
      "args": ["--yes", "@flashdata-dev/google-video-search@0.1.2", "mcp"],
      "env": {"FLASHDATA_API_KEY": "YOUR_API_KEY"}
    }
  }
}
```

Enter your key in protected client settings. Use `npx.cmd` on Windows if required by your client.
Tools: `google_videos`, `get_pricing`, `get_job` and `get_result`. This package serves only `google_videos`.

## Output

The CLI returns `{"ok":true,"tool":"google_videos","result":...}`.
`result.results[0].videos` contains titles, links, source websites and available durations.

This is Google video search, distinct from YouTube Search. Results contain search metadata, not media files.

[Sample response and Python processing example](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/google-video-search/examples.md).

## Parameters

| Parameter | Type | Required | Default and constraints |
| --- | --- | --- | --- |
| `query` | string | Yes |  |
| `gl` | string | No | Pattern: `^[A-Za-z]{2}$`. Country code. Set explicitly when needed; omitted values use the search provider’s behavior. |
| `hl` | string | No | Pattern: `^[A-Za-z0-9-]+$`. Interface language. Set explicitly when needed; omitted values use the search provider’s behavior. |
| `location` | string | No |  |
| `num` | integer | No | Range: 1–100. Requested result count. Actual count varies by query and search type; no fixed value is added when omitted. |
| `page` | integer | No | Range: 1–100. Requested page. Set explicitly for pagination; each page is a separate query. |
| `tbs` | string | No |  |
| `autocorrect` | boolean | No |  |
| `mode` | string | No | Default: `"realtime"`. Allowed: `realtime`, `async`. |

See the [API reference](https://flashdata.dev/docs/sources/google_videos) for details. The package includes `schema.json` and `examples/query.json`; `tools` lists schemas allowed by your key.

## Async jobs and errors

For asynchronous queries, add `"mode": "async"` to the input. Save the returned `result.id` as `job.json`:

```json
{"job_id":"job_REPLACE_WITH_RETURNED_ID"}
```

```sh
npx --yes @flashdata-dev/google-video-search@0.1.2 call get_job --input job.json > result.json
```

Read the same job until `completed`; its data is under `result.output`. Do not resubmit to check progress.
Requests are not automatically retried. If a response is lost, check your FlashData query history before submitting again.
Async JSON results are available for 24 hours.

`--help` works without an API key. `tools` and `call get_pricing` require a key and do not submit a data query.
CLI exit codes: `0` success, `1` API/tool failure, `2` invalid input/configuration. A successful job read may still be pending.
[Response limits, MCP chunks and optional settings](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/google-video-search/examples.md#protocol-reference).

[API documentation](https://flashdata.dev/docs/sources/google_videos) · [Pricing](https://flashdata.dev/pricing) · [Source](https://github.com/rocosen/flashdata-mcp) · [Support](mailto:support@flashdata.dev)
