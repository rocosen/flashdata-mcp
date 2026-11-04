# YouTube Search for Cursor — FlashData

Search YouTube with keyword, date, duration and sorting filters. Request up to 20 video results.

Use it from the command line or an MCP client. Requires Node.js **22.18+** and a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_search` access. Data queries use paid [FlashData Credits](https://flashdata.dev/pricing); installation is free. Pricing and job reads are free.

## Install in Cursor

This plugin's public Marketplace listing is not yet confirmed. Once published, install **YouTube Search — FlashData** from Cursor's Marketplace and configure `FLASHDATA_API_KEY` through the plugin's protected settings.

For local evaluation now, copy this entire plugin directory into `~/.cursor/plugins/local/youtube-search-flashdata/` as real files, then run **Developer: Reload Window** and check **Customize**. Do not use a symlink outside that directory. Configure the key through the plugin settings, then reload the entire Cursor window again so the server receives the saved value. Reloading only the MCP server may retain the previous configuration. Never put the key in Agent chat or commit it to a file. Organization policy can restrict local plugins.

The plugin starts `npx --yes @flashdata-dev/youtube-search@0.1.1 mcp`. Node.js **22.18 or newer** and npm must be available to Cursor. First launch downloads the pinned package from npm.

## Use in Cursor

Activate the `youtube-search-flashdata` Skill and use the `youtube-search-flashdata` MCP server. Its tools are `youtube_search`, `get_pricing`, `get_job` and `get_result`. The server rejects other sources and their jobs even when your API key has broader permissions. If you install several FlashData task integrations, choose the supporting tools from this task's server.

First check the connection without a paid data request:

> Use youtube-search-flashdata to call get_pricing for youtube_search, request_count 1. Do not submit a data query.

After approving the API cost, try:

> Find 10 YouTube videos about battery recycling with one standard search. Return the video IDs, watch URLs, channels and available durations.

The source tool accepts these flat arguments (example values; replace them for your task):

```json
{
  "query": "battery recycling",
  "max_results": 10
}
```

MCP success data is in `structuredContent`; the terminal examples below wrap it under `result`. For asynchronous calls retain the returned `id`, call this server's `get_job` with `job_id`, and read `output` after completion. For chunked MCP responses follow `result_id` and `next_offset` with `get_result` on the same server. Never automatically repeat a paid submission after a timeout.

[Full input schema](skills/youtube-search-flashdata/references/schema.json) · [Example arguments](skills/youtube-search-flashdata/references/query.json)

## Run with npx

Set `FLASHDATA_API_KEY` in your environment; the package does not load `.env` automatically.
Save this input as `query.json`:

```json
{"query": "battery recycling", "max_results": 10}
```

Run the query and save its JSON response:

```sh
npx --yes @flashdata-dev/youtube-search@0.1.2 call youtube_search --input query.json > result.json
```

Use `--input -` for stdin. To install locally: `npm install @flashdata-dev/youtube-search@0.1.2`.

## Connect an MCP client

```json
{
  "mcpServers": {
    "youtube-search": {
      "command": "npx",
      "args": ["--yes", "@flashdata-dev/youtube-search@0.1.2", "mcp"],
      "env": {"FLASHDATA_API_KEY": "YOUR_API_KEY"}
    }
  }
}
```

Enter your key in protected client settings. Use `npx.cmd` on Windows if required by your client.
Tools: `youtube_search`, `get_pricing`, `get_job` and `get_result`. This package serves only `youtube_search`.

## Output

The CLI returns `{"ok":true,"tool":"youtube_search","result":...}`.
`result.results[0].results` contains video IDs, titles, channels and available statistics.

max_results is 1 to 20; actual results can be fewer. Metadata and transcript enrichment are separate paid calls.

[Sample response and Python processing example](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-search/examples.md).

## Parameters

| Parameter | Type | Required | Default and constraints |
| --- | --- | --- | --- |
| `query` | string | Yes |  |
| `max_results` | integer | No | Default: `20`. Range: 1–20. |
| `filters` | object/null | No | Optional object; see the full JSON schema for upload_date, duration, sort and feature filters. Null is also accepted. |
| `mode` | string | No | Default: `"realtime"`. Allowed: `realtime`, `async`. |

See the [API reference](https://flashdata.dev/docs/sources/youtube_search) for details. The package includes `schema.json` and `examples/query.json`; `tools` lists schemas allowed by your key.

## Async jobs and errors

For asynchronous queries, add `"mode": "async"` to the input. Save the returned `result.id` as `job.json`:

```json
{"job_id":"job_REPLACE_WITH_RETURNED_ID"}
```

```sh
npx --yes @flashdata-dev/youtube-search@0.1.2 call get_job --input job.json > result.json
```

Read the same job until `completed`; its data is under `result.output`. Do not resubmit to check progress.
Requests are not automatically retried. If a response is lost, check your FlashData query history before submitting again.
Async JSON results are available for 24 hours.

`--help` works without an API key. `tools` and `call get_pricing` require a key and do not submit a data query.
CLI exit codes: `0` success, `1` API/tool failure, `2` invalid input/configuration. A successful job read may still be pending.
[Response limits, MCP chunks and optional settings](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-search/examples.md#protocol-reference).

[API documentation](https://flashdata.dev/docs/sources/youtube_search) · [Pricing](https://flashdata.dev/pricing) · [Source](https://github.com/rocosen/flashdata-mcp) · [Support](mailto:support@flashdata.dev)
