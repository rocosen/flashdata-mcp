# YouTube Video & Audio Downloader by FlashData

Download a public YouTube video, audio track or Short and get a hosted file link. Pay through Apify for the completed file size. No FlashData account, FlashData API key or cloud storage credentials are required.

## Quick start

1. Paste a YouTube HTTPS URL.
2. Choose video with sound, silent video or audio, and optional format/quality settings.
3. Set **Max total charge** in Apify and start the run.
4. Open **OUTPUT** for the latest download link. Save the file before the link expires.

```json
{
  "url": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  "download_type": "audio_video",
  "output_format": "mp4",
  "video_quality": "<=1080",
  "maxFileMB": 50
}
```

For MP3, use `download_type: "audio"`, `output_format: "mp3"`, and optionally `audio_quality: "192"`. Omit video quality and FPS for audio. Source availability determines which combinations work; no upscaling or translation.

## Inputs

| Field | Meaning |
| --- | --- |
| `url` | Required. Public YouTube watch, Shorts or youtu.be HTTPS link. |
| `download_type` | `audio_video` (default), `video` (silent) or `audio`. |
| `output_format` | Video: `mp4`, `webm`, `mkv`. Audio: `m4a`, `mp3`, `opus`. Omit for the type-specific default. |
| `video_quality` | `<=N` ceiling or `==N` exact resolution. N: 144, 360, 480, 720, 1080, 1440, 2160. Default ceiling 1080p. Video only. |
| `fps` | Frame-rate constraint such as `<=30`; operators `<=`, `==`, `>=` and values 1–240. Video only. |
| `audio_quality` | Audio-only: `best`, `320`, `256`, `192` or `128` kbps. |
| `audio_language` | `default` or `original` source audio track. Omit for silent video. |
| `maxFileMB` | File-size ceiling, default 50 MB, maximum 800 MB. Also reduced to fit the run budget. |

One file per run. Custom format selectors, clipping, metadata upload, callbacks and customer storage are not supported. Old `flashdataApiKey`, `storageJson`, `video_id`, `jobId` and `waitSeconds` inputs must be removed when migrating saved tasks.

## Pricing and free accounts

The **Download 1 MB** (`download-mb`) rate depends on your Apify discount tier:

| Apify tier | Typical platform plan | Price per MB | Price per GB |
| --- | --- | --- | --- |
| FREE | Free | $0.000125 | $0.125 |
| BRONZE | Starter | $0.000100 | $0.100 |
| SILVER | Scale | $0.0000875 | $0.0875 |
| GOLD | Business | $0.000075 | $0.075 |
| PLATINUM / DIAMOND | Enterprise | $0.000075 | $0.075 |

These are usage rates, not a separate FlashData monthly subscription. Your Apify subscription credits are shared across the platform. Check the **Pricing** tab for your effective price and any pending price changes. Each completed file is rounded up to a whole decimal MB (1 MB = 1,000,000 bytes). A 2,100,000-byte file is 3 events. The event covers downloading and temporary hosting; it does not bill every later use of the same link.

Submission, polling and failed downloads produce no download events. The run budget caps the permitted file size before work begins. When Apify supplies the complete tier price table, we conservatively reserve budget at the highest rate ($0.125/GB with this table); Apify still charges your actual discounted rate. A very small budget can therefore limit the permitted size more than your discounted rate would require. Increasing the run budget does not increase the per-MB price. An oversized file fails instead of silently exceeding that ceiling. Only the download event should be configured: no start fee or dataset-row fee.

Apify free accounts can use their available platform credits, shared with other Actors. There is no separate FlashData free allowance and no charge to a personal FlashData account. Available platform credit and account restrictions still apply. The file link is released after Apify confirms the download charge. Free-plan activity does not generate developer payouts; it is not a payment from Apify to FlashData.

## Results and retention

OUTPUT contains `download_url`, `filename`, `content_type`, `size_bytes`, `charged_mb`, `expires_at`, `file_expires_at` and `run_id`. A dataset row is also provided. Links normally last up to five minutes; hosted files are normally retained about 24 hours. Save the file promptly. OUTPUT's expiry fields are authoritative.

To refresh a link or continue an interrupted download, **resurrect the same Apify run with its original input** before the hosted file expires. Confirmed charges are not repeated. OUTPUT is refreshed; the original dataset row can contain an expired link. Starting a new run is a new download and can incur a new charge.

## Errors and retries

The Actor waits up to ten minutes for completion. A timeout does not cancel an accepted backend download. Resume the same run; do not repeatedly press Start for the same video.

A charge with an uncertain response is reconciled against Apify's event count. Automatic charge attempts are confined to the original short authorization window. If the window has expired and no charge is confirmed, the Actor stops for support review instead of risking a duplicate charge. A charge may have succeeded even if the run failed while saving its output.

Set a sufficient Apify run timeout (recommended 900 seconds). Private, restricted, removed, oversized or incompatible videos can fail. Download only media you have permission to use.

[Support](mailto:support@flashdata.dev) — include the run URL, never tokens or secrets. This is an independent FlashData integration, not an official YouTube product.
