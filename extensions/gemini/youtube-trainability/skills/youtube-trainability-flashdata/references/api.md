# YouTube Creative Commons License Metadata CLI and MCP — FlashData

Read a YouTube video’s Creative Commons license-label metadata as JSON.

Use it from the command line or an MCP client. Requires Node.js **22.18+** and a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_trainability` access. Data queries use paid [FlashData Credits](https://flashdata.dev/pricing); installation is free. Pricing and job reads are free.

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
