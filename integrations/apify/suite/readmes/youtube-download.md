# YouTube Video & Audio Downloader to Cloud Storage

Save a YouTube video or audio track directly to cloud storage you control. Choose the download type and available format options, then follow the asynchronous job until the uploaded file appears in the delivery manifest.

## What you get

- **Video or audio:** select combined video and audio, video only, or audio only.
- **Your destination:** deliver to S3, S3-compatible storage, GCS, Azure, OSS, COS, BOS or TOS.
- **Job tracking:** keep a job ID for later status checks and read the completed file URL and size from the delivery manifest.

Use it to deliver media you are authorized to obtain into your own storage for archiving, editing or a separate processing workflow.

## Example output

Completed uploads appear in **Delivery manifest**. A completed row has this form. This example is illustrative, not a live result:

```json
{
  "job_id": "job_example",
  "file_url": "https://example-bucket.s3.amazonaws.com/example.mp4",
  "file_size": 1048576
}
```

**Complete response and status** shows job progress and the full response. Pending jobs do not produce completed file rows. A file URL in your private bucket remains subject to that bucket's access controls.

## Quick start

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_download` access and available Credits.
2. Enter a real video ID, your FlashData key and the destination configuration in encrypted `storageJson`. Select the download type and optional format settings.
3. Click **Start**, then check **Complete response and status**. Open **Delivery manifest** once the job has completed.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "video_id": "abcdefghijk",
  "download_type": "audio_video",
  "output_format": "mp4",
  "storageJson": "{\"storage_type\":\"s3\",\"storage_url\":\"your-bucket\",\"access_key\":\"YOUR_ACCESS_KEY\",\"secret_key\":\"YOUR_SECRET_KEY\",\"region\":\"us-east-1\"}"
}
```

## Input parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `video_id` | New job | 11-character YouTube video ID (the v= value in a watch URL).  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `storageJson` | New job | Storage credentials as JSON; required for a new download. See README for provider fields and an S3 example.  |
| `download_type` | No | `audio_video` combines video and audio; `video` is video only; `audio` is audio only. Default: `"audio_video"`. |
| `video_quality` | No | Video constraint such as `best`, `<=720` or `==1080`. Omit for audio-only downloads.  |
| `fps` | No | Frame-rate constraint such as `<=30`. Omit for audio-only downloads.  |
| `audio_language` | No | `default` or `original`. Omit for video-only downloads.  |
| `audio_quality` | No | For audio-only downloads: `best`, `320`, `256`, `192` or `128`. Omit for video or combined media.  |
| `yt_dlp_format` | No | Advanced format selector; overrides quality, FPS and audio-language selection.  |
| `upload_metadata` | No | Also upload metadata to your customer storage. Default: `false`. |
| `output_format` | No | Video: mp4, webm, mkv. Audio: m4a, mp3, opus. Omit to use the type-specific default.  |
| `start_at` | No | Optional start timestamp in HH:MM:SS, at most 12:00:00.  |
| `end_at` | No | Optional end timestamp after start_at, in HH:MM:SS.  |
| `jobId` | Existing job | Read an existing job without a new download charge. Clear video_id and storageJson.  |
| `waitSeconds` | No | Polling window. Pending jobs continue; resume with jobId. An in-flight read may finish later. Range: 0–120. Default: `60`. |

Replace the video and credential placeholders before running. New jobs require video_id and storageJson; status-only requests use jobId instead. Quality and format selections depend on what the source supports.

## Storage configuration

The input example uses AWS S3. `storage_url` is the bucket or Azure container name; use `object_prefix` for a folder within it. Keep provider credentials inside the encrypted `storageJson` field.

Supported `storage_type` values: `s3`, `s3_compatible`, `gcs`, `azure`, `oss`, `cos`, `bos`, `tos`. S3-compatible destinations need an `endpoint_url`; GCS uses `service_account`; Azure uses `account_name` and a writable container `sas_token`. See the [provider-specific configuration](https://flashdata.dev/docs/sources/youtube_download) for required fields.

## Check an unfinished job

The Actor polls for up to `waitSeconds` (default 60, maximum 120), plus the last in-flight read. If the job is still pending or processing, keep the `jobId` from **Complete response and status**.

Start a status-only run with the same key and job ID. Clear video_id, storageJson and other new-download settings; use this minimal input:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "jobId": "job_example",
  "waitSeconds": 60
}
```

This reads the existing job without submitting another download. Do not resubmit the video just because the first polling window ended.

## Pricing

New downloads reserve FlashData Credits and settle based on uploaded bytes at your applicable [download rate](https://flashdata.dev/pricing). Reading an existing job does not create another download charge. This Actor adds no service fee. Apify platform usage and your storage provider's storage/transfer fees are separate.

## FAQ

**Where is the downloaded file?**

In the destination you supplied, after the job completes. This Actor does not provide a shared download bucket or make private objects public.

**Can I download several videos in one run?**

This Actor submits one video per new job. Use separate jobs for additional videos.

**Does it create transcripts or translate audio?**

No. It delivers media files; transcription and translation are separate operations.

**Are all requested qualities and formats guaranteed?**

No. Available streams and valid combinations depend on the source. Leave unnecessary constraints unset rather than requesting an unavailable combination.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. If a jobId was saved, use it to read the existing job. Starting a fresh video request can create a second download charge.

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_download) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
