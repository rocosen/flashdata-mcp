# YouTube Autocomplete for Gemini CLI — FlashData

Get YouTube autocomplete phrases for a search prefix, language and region.

Use it from the command line or an MCP client. Requires Node.js **22.18+** and a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_suggestions` access. Data queries use paid [FlashData Credits](https://flashdata.dev/pricing); installation is free. Pricing and job reads are free.

## Install in Gemini CLI

Install from this extension's repository (GitHub installation and gallery indexing are separate):

```sh
gemini extensions install https://github.com/rocosen/youtube-autocomplete-gemini
```

Review the extension and enter your own FlashData API key at the sensitive setting prompt. To change it later, run `gemini extensions config youtube-autocomplete-flashdata`. Restart Gemini CLI after configuration. Run `gemini extensions list`, `gemini skills list --all` and `gemini mcp list` to inspect installation, Skill availability and connection.

Node.js **22.18 or newer**, npm and Git must be available. The extension starts `npx --yes @flashdata-dev/youtube-autocomplete@0.1.1 mcp`; first launch downloads the pinned package. Local evaluation also supports `gemini extensions install /absolute/path/to/this-extension`. Model access and fees are separate; this does not claim Antigravity CLI compatibility.

## Use in Gemini CLI

Activate the `youtube-autocomplete-flashdata` Skill and use the `youtube-autocomplete-flashdata` MCP server. Its tools are `youtube_suggestions`, `get_pricing`, `get_job` and `get_result`. The server rejects other sources and their jobs even when your API key has broader permissions. If you install several FlashData task integrations, choose the supporting tools from this task's server.

First check the connection without a paid data request:

> Use youtube-autocomplete-flashdata to call get_pricing for youtube_suggestions, request_count 1. Do not submit a data query.

After approving the API cost, try:

> Get YouTube autocomplete suggestions for battery recycling in English and the US with one request. Return unique phrases while preserving the query and locale; do not estimate search volume.

The source tool accepts these flat arguments (example values; replace them for your task):

```json
{
  "query": "battery recycling",
  "language": "en",
  "region": "US"
}
```

MCP success data is in `structuredContent`; the terminal examples below wrap it under `result`. For asynchronous calls retain the returned `id`, call this server's `get_job` with `job_id`, and read `output` after completion. For chunked MCP responses follow `result_id` and `next_offset` with `get_result` on the same server. Never automatically repeat a paid submission after a timeout.

[Full input schema](skills/youtube-autocomplete-flashdata/references/schema.json) · [Example arguments](skills/youtube-autocomplete-flashdata/references/query.json)

## Run with npx

Set `FLASHDATA_API_KEY` in your environment; the package does not load `.env` automatically.
Save this input as `query.json`:

```json
{"query": "battery recycling", "language": "en", "region": "US"}
```

Run the query and save its JSON response:

```sh
npx --yes @flashdata-dev/youtube-autocomplete@0.1.2 call youtube_suggestions --input query.json > result.json
```

Use `--input -` for stdin. To install locally: `npm install @flashdata-dev/youtube-autocomplete@0.1.2`.

## Connect an MCP client

```json
{
  "mcpServers": {
    "youtube-autocomplete": {
      "command": "npx",
      "args": ["--yes", "@flashdata-dev/youtube-autocomplete@0.1.2", "mcp"],
      "env": {"FLASHDATA_API_KEY": "YOUR_API_KEY"}
    }
  }
}
```

Enter your key in protected client settings. Use `npx.cmd` on Windows if required by your client.
Tools: `youtube_suggestions`, `get_pricing`, `get_job` and `get_result`. This package serves only `youtube_suggestions`.

## Output

The CLI returns `{"ok":true,"tool":"youtube_suggestions","result":...}`.
`result.results[0]` contains the autocomplete phrases.

Autocomplete returns phrases, not video results or search-volume estimates. A suggestion is not evidence of demand size.

[Sample response and Python processing example](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-autocomplete/examples.md).

## Parameters

| Parameter | Type | Required | Default and constraints |
| --- | --- | --- | --- |
| `query` | string | Yes |  |
| `language` | string | No | Default: `"en"`. Pattern: `^[A-Za-z0-9-]+$`. |
| `region` | string | No | Default: `"US"`. Pattern: `^[A-Za-z]{2}$`. |
| `mode` | string | No | Default: `"realtime"`. Allowed: `realtime`, `async`. |

See the [API reference](https://flashdata.dev/docs/sources/youtube_suggestions) for details. The package includes `schema.json` and `examples/query.json`; `tools` lists schemas allowed by your key.

## Async jobs and errors

For asynchronous queries, add `"mode": "async"` to the input. Save the returned `result.id` as `job.json`:

```json
{"job_id":"job_REPLACE_WITH_RETURNED_ID"}
```

```sh
npx --yes @flashdata-dev/youtube-autocomplete@0.1.2 call get_job --input job.json > result.json
```

Read the same job until `completed`; its data is under `result.output`. Do not resubmit to check progress.
Requests are not automatically retried. If a response is lost, check your FlashData query history before submitting again.
Async JSON results are available for 24 hours.

`--help` works without an API key. `tools` and `call get_pricing` require a key and do not submit a data query.
CLI exit codes: `0` success, `1` API/tool failure, `2` invalid input/configuration. A successful job read may still be pending.
[Response limits, MCP chunks and optional settings](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-autocomplete/examples.md#protocol-reference).

[API documentation](https://flashdata.dev/docs/sources/youtube_suggestions) · [Pricing](https://flashdata.dev/pricing) · [Source](https://github.com/rocosen/flashdata-mcp) · [Support](mailto:support@flashdata.dev)
