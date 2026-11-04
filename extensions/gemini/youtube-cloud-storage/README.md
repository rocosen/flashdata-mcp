# YouTube Download to Cloud Storage for Gemini CLI — FlashData

Download YouTube video, audio or clips to your own S3 or other supported cloud storage.

Use it from the command line or an MCP client. Requires Node.js **22.18+** and a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_download` access. Downloads reserve Credits and settle by uploaded bytes; cloud-storage charges are separate. A per-request quote does not estimate delivery cost.

## Install in Gemini CLI

Install from this extension's repository (GitHub installation and gallery indexing are separate):

```sh
gemini extensions install https://github.com/rocosen/youtube-cloud-storage-gemini
```

Review the extension and enter your own FlashData API key at the sensitive setting prompt. To change it later, run `gemini extensions config youtube-cloud-storage-flashdata`. Restart Gemini CLI after configuration. Run `gemini extensions list`, `gemini skills list --all` and `gemini mcp list` to inspect installation, Skill availability and connection.

Node.js **22.18 or newer**, npm and Git must be available. The extension starts `npx --yes @flashdata-dev/youtube-cloud-storage@0.1.1 mcp`; first launch downloads the pinned package. Local evaluation also supports `gemini extensions install /absolute/path/to/this-extension`. Model access and fees are separate; this does not claim Antigravity CLI compatibility.

## Use in Gemini CLI

Activate the `youtube-cloud-storage-flashdata` Skill and use the `youtube-cloud-storage-flashdata` MCP server. Its tools are `youtube_download`, `get_pricing`, `get_job` and `get_result`. The server rejects other sources and their jobs even when your API key has broader permissions. If you install several FlashData task integrations, choose the supporting tools from this task's server.

First check the connection without a paid data request:

> Use youtube-cloud-storage-flashdata to call get_pricing for youtube_download, request_count 1. Do not submit a data query.

A per-request price is not a download-cost estimate: downloads reserve Credits and settle by actual uploaded bytes.

After approving the API cost, try:

> Prepare a 10-second MP4 delivery of YouTube video jNQXAC9IVRw to my own S3 bucket. First confirm the destination, credentials, rights and byte-based cost approval. After I approve, submit once, retain the job ID, and inspect the completed delivery manifest. Never retry the paid submission automatically.

The source tool accepts these flat arguments (example values; replace them for your task):

```json
{
  "video_id": "jNQXAC9IVRw",
  "mode": "async",
  "download_type": "audio_video",
  "video_quality": "<=720",
  "output_format": "mp4",
  "start_at": "00:00:00",
  "end_at": "00:00:10",
  "storage": {
    "storage_type": "s3",
    "storage_url": "your-media-bucket",
    "access_key": "YOUR_ACCESS_KEY",
    "secret_key": "YOUR_SECRET_KEY",
    "region": "us-east-1",
    "object_prefix": "flashdata-clips"
  }
}
```

MCP success data is in `structuredContent`; the terminal examples below wrap it under `result`. For asynchronous calls retain the returned `id`, call this server's `get_job` with `job_id`, and read `output` after completion. For chunked MCP responses follow `result_id` and `next_offset` with `get_result` on the same server. Never automatically repeat a paid submission after a timeout.

[Full input schema](skills/youtube-cloud-storage-flashdata/references/schema.json) · [Example arguments](skills/youtube-cloud-storage-flashdata/references/query.json)

## Run with npx

Set `FLASHDATA_API_KEY` in your environment; the package does not load `.env` automatically.
Save this input as `query.json`:

```json
{
  "video_id": "jNQXAC9IVRw",
  "mode": "async",
  "download_type": "audio_video",
  "video_quality": "<=720",
  "output_format": "mp4",
  "start_at": "00:00:00",
  "end_at": "00:00:10",
  "storage": {
    "storage_type": "s3",
    "storage_url": "your-media-bucket",
    "access_key": "YOUR_ACCESS_KEY",
    "secret_key": "YOUR_SECRET_KEY",
    "region": "us-east-1",
    "object_prefix": "flashdata-clips"
  }
}
```

Replace the storage placeholders with your own writable destination and scoped credentials. Keep the file private; storage credentials are sent to FlashData for delivery.

Submit one asynchronous delivery job:

```sh
npx --yes @flashdata-dev/youtube-cloud-storage@0.1.2 call youtube_download --input query.json > result.json
```

Use `--input -` for stdin. To install locally: `npm install @flashdata-dev/youtube-cloud-storage@0.1.2`.

## Connect an MCP client

```json
{
  "mcpServers": {
    "youtube-cloud-storage": {
      "command": "npx",
      "args": ["--yes", "@flashdata-dev/youtube-cloud-storage@0.1.2", "mcp"],
      "env": {"FLASHDATA_API_KEY": "YOUR_API_KEY"}
    }
  }
}
```

Enter your key in protected client settings. Use `npx.cmd` on Windows if required by your client.
Tools: `youtube_download`, `get_pricing`, `get_job` and `get_result`. This package serves only `youtube_download`.

## Output

The CLI returns `{"ok":true,"tool":"youtube_download","result":...}`.
Submission returns `result.id`. Once the job completes, `get_job` returns a delivery manifest under `result.output`, including available file locations, sizes and format details.

Only asynchronous delivery is supported. Supply your own destination and credentials; media access and retention follow your storage settings. Private object URLs are not public download links. Charges reserve Credits and settle by uploaded bytes.

[Sample response and Python processing example](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-cloud-storage/examples.md).

## Parameters

| Parameter | Type | Required | Default and constraints |
| --- | --- | --- | --- |
| `video_id` | string | Yes | Pattern: `^[A-Za-z0-9_-]{11}$`. |
| `download_type` | string | No | Default: `"audio_video"`. Allowed: `audio_video`, `video`, `audio`. |
| `video_quality` | string | No | Default: `"<=720"`. Allowed: `best`, `worst`, `<=144`, `==144`, `>=144`, `<=360`, `==360`, `>=360`, `<=480`, `==480`, `>=480`, `<=720`, `==720`, `>=720`, `<=1080`, `==1080`, `>=1080`, `<=1440`, `==1440`, `>=1440`, `<=2160`, `==2160`, `>=2160`, `<=4320`, `==4320`, `>=4320`. |
| `fps` | string | No | Pattern: `^(?:>=&#124;<=&#124;==)(?:[1-9]\d?&#124;1\d\d&#124;2[0-3]\d&#124;240)$`. |
| `audio_language` | string | No | Default: `"default"`. Allowed: `default`, `original`. |
| `audio_quality` | string | No | Default: `"best"`. Allowed: `best`, `320`, `256`, `192`, `128`. |
| `yt_dlp_format` | string | No |  |
| `upload_metadata` | boolean | No | Default: `false`. |
| `output_format` | string | No | Allowed: `mp4`, `webm`, `mkv`, `m4a`, `mp3`, `opus`. Video defaults to mp4 (also webm/mkv); audio defaults to m4a (also mp3/opus). |
| `start_at` | string | No | Pattern: `^\d{1,2}:[0-5]\d:[0-5]\d$`. |
| `end_at` | string | No | Pattern: `^\d{1,2}:[0-5]\d:[0-5]\d$`. |
| `storage` | object | Yes | Customer-owned destination, using the same fields as Download API params.storage. Supply credentials from your configured storage; do not invent values or display secrets. GCS uses service_account; Azure uses account_name and a container SAS with write permission; other providers use access_key/secret_key and provider endpoint/region as needed. Required destination and provider credentials; see the linked Download API reference. Never commit real values. |
| `mode` | string | No | Default: `"async"`. Allowed: `async`. |

See the [API reference](https://flashdata.dev/docs/sources/youtube_download) for details. The package includes `schema.json` and `examples/query.json`; `tools` lists schemas allowed by your key.

## Async jobs and errors

Downloads are asynchronous. Save the returned `result.id` as `job.json`:

```json
{"job_id":"job_REPLACE_WITH_RETURNED_ID"}
```

```sh
npx --yes @flashdata-dev/youtube-cloud-storage@0.1.2 call get_job --input job.json > result.json
```

Read the same job until `completed`; its data is under `result.output`. Do not resubmit to check progress.
Requests are not automatically retried. If a response is lost, check your FlashData query history before submitting again.
Async JSON results are available for 24 hours; media retention follows your storage settings.

`--help` works without an API key. `tools` and `call get_pricing` require a key and do not submit a data query.
CLI exit codes: `0` success, `1` API/tool failure, `2` invalid input/configuration. A successful job read may still be pending.
[Response limits, MCP chunks and optional settings](https://github.com/rocosen/flashdata-mcp/blob/main/npm/docs/youtube-cloud-storage/examples.md#protocol-reference).

[API documentation](https://flashdata.dev/docs/sources/youtube_download) · [Pricing](https://flashdata.dev/pricing) · [Source](https://github.com/rocosen/flashdata-mcp) · [Support](mailto:support@flashdata.dev)
