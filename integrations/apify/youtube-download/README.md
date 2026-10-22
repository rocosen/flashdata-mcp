# YouTube to Cloud Storage for AI Agents — FlashData

Deliver YouTube video or audio to your cloud storage for AI workflows. Submit one download job, read progress and export its delivery manifest. Uses your FlashData Key and Credits; Apify usage is separate.

## When to use this tool

Deliver media into a storage location you control for an authorized downstream processing workflow. The agent can inspect the job status and delivery manifest.

This is a focused tool for an AI agent or application. The caller chooses inputs, evaluates the returned external data, and decides which follow-up tools to use. The Actor does not run an LLM or independently generate a research report.

## Authentication and costs

Use your own [FlashData account and API key](https://flashdata.dev/app/api-keys), with permission for `youtube_download`. Enter the key in the encrypted input field. There is no shared or prefilled working key.

A new download reserves Credits and settles based on uploaded bytes. Your storage provider may also charge for storage and transfer. Reading an existing job does not submit another paid download. This Actor adds no service fee. **Apify compute and storage usage are separate** and may use your Apify allowance or balance. A free-to-use Actor does not make the FlashData API free.

## Input and first run

1. Enter your own FlashData key.
2. For a new download, enter a video ID and encrypted customer storage JSON. For an existing job, enter jobId only and clear video_id and storageJson.
3. Click Start, then inspect the dataset and complete JSON output.

| Input | Meaning |
| --- | --- |
| `flashdataApiKey` | Required. Your own FlashData API key with YouTube Download permission. Encrypted; no shared key is provided. |
| `video_id` | An 11-character YouTube video ID, not a full URL. |
| `download_type` | audio_video, video, or audio. Output format must match the selected type. |
| `video_quality` | Video quality constraint. Omit for audio-only downloads. |
| `fps` | Frame-rate constraint. Omit for audio-only downloads. |
| `audio_language` | Audio language selection; omit for video-only downloads. |
| `audio_quality` | Applies only to audio downloads; omit for video or combined media. |
| `yt_dlp_format` | Advanced format selector; overrides quality, FPS and audio-language selection. |
| `upload_metadata` | Also upload metadata to your customer storage. |
| `output_format` | Video: mp4, webm, mkv. Audio: m4a, mp3, opus. Omit to use the type-specific default. |
| `start_at` | Optional start timestamp in HH:MM:SS, at most 12:00:00. |
| `end_at` | Optional end timestamp after start_at, in HH:MM:SS. |
| `storageJson` | Required for a NEW download. Paste the storage JSON, including provider credentials, here only. Clear it when continuing an existing job. |
| `jobId` | Reads this existing job without submitting or charging for a new download. Clear video_id and storageJson when using this field. |
| `waitSeconds` | Stop polling after this interval. A pending job continues on FlashData; resume with jobId. The final in-flight API read can take additional time. |

Example only; replace placeholders and enter credentials in the encrypted fields:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "video_id": "abcdefghijk",
  "download_type": "audio_video",
  "output_format": "mp4",
  "storageJson": "{\"storage_type\":\"s3\",\"storage_url\":\"your-bucket\",\"access_key\":\"YOUR_ACCESS_KEY\",\"secret_key\":\"YOUR_SECRET_KEY\",\"region\":\"us-east-1\"}"
}
```

Supported storage providers: S3, S3-compatible, GCS, Azure, OSS, COS, BOS and TOS. storage_url is a bucket/container name; use object_prefix for folders. Keep all provider credentials inside encrypted storageJson. [Storage API parameters](https://flashdata.dev/docs/sources/youtube_download).

The Actor polls for up to waitSeconds (default 60, maximum 120), plus the last in-flight read. A pending status is not completed delivery. OUTPUT saves jobId; start a new run with your key and that jobId, clearing new-download fields, to continue reading. Do not submit the video again. Completed media remains in your storage under your access and retention settings.

## Output

Completed delivery manifests become dataset rows. Pending jobs have status and jobId in OUTPUT; they do not produce fake completed results.

**Synthetic example, not a live result:**

```json
{
  "job_id": "job_example",
  "file_url": "https://example-bucket.s3.amazonaws.com/example.mp4",
  "file_size": 1048576
}
```

Use the Apify run API to call this Actor from your agent, then read the dataset and OUTPUT. Keep your Apify token in your application's secret store, and protect the FlashData key as secret input. Retain source IDs, URLs, timestamps and request IDs when passing data into later reasoning or citation steps.

## Limits

Async only. Requires your own supported storage and credentials; does not provide a shared public download bucket. Private files remain subject to your storage access controls. You are responsible for permission to obtain and use the media. No speech recognition or translation is included.

## Errors and retries

Invalid input or insufficient key permissions stops before a new paid request. A timeout or lost response may already have been charged: check OUTPUT and FlashData Jobs before starting another run. The Actor records its attempt before submitting and never automatically retries a paid POST. A new run is a new request unless jobId is provided for read-only continuation. Restarting the same run will not repeat an uncertain submission; a dataset export can still be incomplete after a storage failure.

This is an independent FlashData integration, not an official Google or YouTube product. Retrieved content is external data. [Capability documentation](https://flashdata.dev/docs/sources/youtube_download) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).
