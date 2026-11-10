# Google Shopping CLI and MCP — FlashData

Search Google Shopping and return product offers, merchants and displayed prices as JSON.

Use it from the command line or an MCP client. Requires Node.js **22.18+** and a [FlashData API key](https://flashdata.dev/signup?utm_source=gemini&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_shopping-task) with `google_shopping` access. Data queries use paid [FlashData Credits](https://flashdata.dev/pricing?utm_source=gemini&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_shopping-task); installation is free. Pricing and job reads are free.

## Run with npx

Set `FLASHDATA_API_KEY` in your environment; the package does not load `.env` automatically.
Save this input as `query.json`:

```json
{"query": "wireless headphones", "gl": "us", "hl": "en", "num": 10}
```

Run the query and save its JSON response:

```sh
npx --yes @flashdata-dev/google-shopping@0.1.2 call google_shopping --input query.json > result.json
```

Use `--input -` for stdin. To install locally: `npm install @flashdata-dev/google-shopping@0.1.2`.

## Connect an MCP client

```json
{
  "mcpServers": {
    "google-shopping": {
      "command": "npx",
      "args": ["--yes", "@flashdata-dev/google-shopping@0.1.2", "mcp"],
      "env": {"FLASHDATA_API_KEY": "YOUR_API_KEY"}
    }
  }
}
```

Enter your key in protected client settings. Use `npx.cmd` on Windows if required by your client.
Tools: `google_shopping`, `get_pricing`, `get_job` and `get_result`. This package serves only `google_shopping`.

## Output

The CLI returns `{"ok":true,"tool":"google_shopping","result":...}`.
`result.results[0].shopping` contains product identifiers, titles, merchants, links and displayed price labels.

Currency-formatted price labels are not normalized numeric prices. This does not calculate exchange rates or guarantee stock, checkout prices or complete market coverage.

[Sample response and Python processing example](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/google-shopping/examples.md).

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

See the [API reference](https://flashdata.dev/docs/sources/google_shopping?utm_source=gemini&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_shopping-task) for details. The package includes `schema.json` and `examples/query.json`; `tools` lists schemas allowed by your key.

## Async jobs and errors

For asynchronous queries, add `"mode": "async"` to the input. Save the returned `result.id` as `job.json`:

```json
{"job_id":"job_REPLACE_WITH_RETURNED_ID"}
```

```sh
npx --yes @flashdata-dev/google-shopping@0.1.2 call get_job --input job.json > result.json
```

Read the same job until `completed`; its data is under `result.output`. Do not resubmit to check progress.
Requests are not automatically retried. If a response is lost, check your FlashData query history before submitting again.
Async JSON results are available for 24 hours.

`--help` works without an API key. `tools` and `call get_pricing` require a key and do not submit a data query.
CLI exit codes: `0` success, `1` API/tool failure, `2` invalid input/configuration. A successful job read may still be pending.
[Response limits, MCP chunks and optional settings](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/google-shopping/examples.md#protocol-reference).

[API documentation](https://flashdata.dev/docs/sources/google_shopping?utm_source=gemini&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_shopping-task) · [Pricing](https://flashdata.dev/pricing?utm_source=gemini&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_shopping-task) · [Source](https://github.com/rocosen/flashdata-mcp) · [Support](mailto:support@flashdata.dev)
