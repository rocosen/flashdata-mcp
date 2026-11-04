# YouTube Extended Search CLI and MCP — FlashData

Search YouTube with filters and up to 700 requested results, returned as structured video records.

Use it from the command line or an MCP client. Requires Node.js **22.18+** and a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_search_extended` access. Data queries use paid [FlashData Credits](https://flashdata.dev/pricing); installation is free. Pricing and job reads are free.

## Run with npx

Set `FLASHDATA_API_KEY` in your environment; the package does not load `.env` automatically.
Save this input as `query.json`:

```json
{"query": "battery recycling", "max_results": 100}
```

Run the query and save its JSON response:

```sh
npx --yes @flashdata-dev/youtube-extended-search@0.1.2 call youtube_search_extended --input query.json > result.json
```

Use `--input -` for stdin. To install locally: `npm install @flashdata-dev/youtube-extended-search@0.1.2`.

## Connect an MCP client

```json
{
  "mcpServers": {
    "youtube-extended-search": {
      "command": "npx",
      "args": ["--yes", "@flashdata-dev/youtube-extended-search@0.1.2", "mcp"],
      "env": {"FLASHDATA_API_KEY": "YOUR_API_KEY"}
    }
  }
}
```

Enter your key in protected client settings. Use `npx.cmd` on Windows if required by your client.
Tools: `youtube_search_extended`, `get_pricing`, `get_job` and `get_result`. This package serves only `youtube_search_extended`.

## Output

The CLI returns `{"ok":true,"tool":"youtube_search_extended","result":...}`.
`result.results[0].results` contains video IDs, titles, channels and available statistics.

The request limit is 700, not a promise of 700 returned videos or pagination. Extended search has its own rate, higher than standard search.

[Sample response and Python processing example](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-extended-search/examples.md).

## Parameters

| Parameter | Type | Required | Default and constraints |
| --- | --- | --- | --- |
| `query` | string | Yes |  |
| `max_results` | integer | No | Default: `20`. Range: 1–700. |
| `filters` | object/null | No | Optional object; see the full JSON schema for upload_date, duration, sort and feature filters. Null is also accepted. |
| `mode` | string | No | Default: `"realtime"`. Allowed: `realtime`, `async`. |

See the [API reference](https://flashdata.dev/docs/sources/youtube_search_extended?utm_source=agent-skills&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search_extended-task) for details. The package includes `schema.json` and `examples/query.json`; `tools` lists schemas allowed by your key.

## Async jobs and errors

For asynchronous queries, add `"mode": "async"` to the input. Save the returned `result.id` as `job.json`:

```json
{"job_id":"job_REPLACE_WITH_RETURNED_ID"}
```

```sh
npx --yes @flashdata-dev/youtube-extended-search@0.1.2 call get_job --input job.json > result.json
```

Read the same job until `completed`; its data is under `result.output`. Do not resubmit to check progress.
Requests are not automatically retried. If a response is lost, check your FlashData query history before submitting again.
Async JSON results are available for 24 hours.

`--help` works without an API key. `tools` and `call get_pricing` require a key and do not submit a data query.
CLI exit codes: `0` success, `1` API/tool failure, `2` invalid input/configuration. A successful job read may still be pending.
[Response limits, MCP chunks and optional settings](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-extended-search/examples.md#protocol-reference).

[API documentation](https://flashdata.dev/docs/sources/youtube_search_extended?utm_source=agent-skills&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search_extended-task) · [Pricing](https://flashdata.dev/pricing) · [Source](https://github.com/rocosen/flashdata-mcp) · [Support](mailto:support@flashdata.dev)
