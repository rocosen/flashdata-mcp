# YouTube Video & Audio Downloader — No Platform or Proxy Fees

**Download from $0.10/GB on Apify Business, or $0.125/GB on Starter. No extra platform or proxy fees for the Actor run.** Free-plan downloads are $2.50/GB; see the full tier table below.

Paste a public YouTube video or Shorts URL, choose video with sound, silent video or audio, and get a hosted download link. Save video as MP4, WEBM or MKV, or extract audio as MP3, M4A or OPUS. Choose video quality up to 4K where the source supports it.

You do not need a FlashData account, a FlashData API key or your own cloud storage. Payment stays in Apify and is based on the completed file size, with no separate start fee or dataset-row charge.

## Features

- **Videos, Shorts and audio:** download from public YouTube watch, Shorts and youtu.be links; one file per run.
- **Video quality from 144p to 4K:** choose a resolution ceiling or an exact resolution, subject to source availability. The default ceiling is 1080p.
- **Six output formats:** MP4, WEBM and MKV for video; MP3, M4A and OPUS for audio.
- **Audio and frame-rate controls:** choose audio bitrate, the default or original source audio track, and a video FPS constraint.
- **Hosted files without storage setup:** receive a temporary download link and the file name, type, size and expiry in JSON.
- **Pay for completed MB:** the download rate includes temporary hosting and Actor run platform usage. No extra proxy, start or dataset-row event fees.
- **Continue in your workflow:** retrieve results through the Apify API or use a run-finished integration to pass them to your next step.

## Input

Only `url` is required. Optional settings let you choose the media type, format, quality and maximum file size.

| Field | Required | What it does |
| --- | --- | --- |
| `url` | Yes | Public YouTube watch, Shorts or youtu.be HTTPS URL. |
| `download_type` | No | `audio_video` for video with sound (default), `video` for silent video, or `audio` for audio only. |
| `output_format` | No | Video: `mp4`, `webm`, `mkv`. Audio: `mp3`, `m4a`, `opus`. Omit to use the default for the selected download type. |
| `video_quality` | No | `<=N` selects a resolution ceiling; `==N` requests an exact resolution. Supported N: 144, 360, 480, 720, 1080, 1440, 2160. Default: up to 1080p. Omit for audio-only downloads. |
| `fps` | No | Video frame-rate constraint, such as `<=30`. Operators: `<=`, `==`, `>=`; values: 1–240. Omit for audio only. |
| `audio_quality` | No | Audio-only bitrate: `best`, `320`, `256`, `192` or `128` kbps. Omit for video downloads. |
| `audio_language` | No | `default` or `original` source audio track. Omit for silent video. This selects an existing track; it does not translate audio. |
| `maxFileMB` | No | Maximum completed file size in decimal MB. Default: 50; maximum: 800. Your run budget can reduce this limit. |

Formats, resolutions and frame rates depend on the source video; the Actor does not upscale it. This Actor accepts one URL per run and provides hosted delivery. It does not offer clipping, batch input or delivery to customer cloud storage.

### Storage options

**Hosted delivery is included.** The media file is hosted by FlashData, and the Actor saves its download link and file details to Apify's **OUTPUT** record and default dataset. You do not need to create a bucket or enter storage credentials.

Download links normally last up to **five minutes**. The underlying hosted file is normally retained for about **24 hours**. These are different expiry times: use `expires_at` for the link and `file_expires_at` for the file, and save the media promptly.

If you need a lasting copy in S3, Google Cloud, Azure or another destination, have your own workflow download and upload the file while the link is valid. This Actor does not upload directly to those services.

### Example input

For an MP4 video with sound:

```json
{
  "url": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  "download_type": "audio_video",
  "output_format": "mp4",
  "video_quality": "<=1080",
  "maxFileMB": 50
}
```

For MP3 audio:

```json
{
  "url": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  "download_type": "audio",
  "output_format": "mp3",
  "audio_quality": "192",
  "maxFileMB": 50
}
```

Paste your URL, choose the settings, set **Max total charge** and click **Start**. Open **OUTPUT** when the run finishes to get the latest link. A **$0.125 run budget** allows up to 50 MB under the current conservative budget check; it is a spending ceiling, not a fixed download charge. Recommended run timeout: **900 seconds**.

Saved tasks from the former FlashData-key version must use the fields above; remove `flashdataApiKey`, `storageJson`, `video_id`, `jobId` and `waitSeconds`.

## Pricing

**Pay per completed MB, with no additional Actor run platform fee, proxy fee, start fee or dataset-row event charge.** The same per-MB rate applies to video and audio at every supported quality. A smaller audio file can cost less than the corresponding video because fewer MB are delivered.

| Apify discount tier | Typical Apify plan | Price per MB | Equivalent per GB | A 100 MB file |
| --- | --- | --- | --- | --- |
| FREE | Free | $0.002500 | $2.50 | $0.25 |
| BRONZE | Starter | $0.000125 | $0.125 | $0.0125 |
| SILVER | Scale | $0.0001125 | $0.1125 | $0.01125 |
| GOLD | Business | $0.000100 | $0.10 | $0.01 |
| PLATINUM / DIAMOND | Enterprise tiers | $0.000100 | $0.10 | $0.01 |

1 MB = 1,000,000 bytes; 1 GB = 1,000 MB. Each completed file is rounded up to a whole MB: a 2,100,000-byte file is billed as 3 MB. The GB figures are unit conversions, not a requirement to buy a GB at a time. Check this Actor's **Pricing** tab for your effective tier and any scheduled changes.

### How the download rate compares

- **97.5% lower than streamers on Starter:** FlashData's download usage rate is **$0.125/GB**, versus **$5/GB** for [streamers/youtube-video-downloader](https://apify.com/streamers/youtube-video-downloader) at the same BRONZE tier. This compares the media download event rate only; optional services and platform subscriptions are excluded.
- **An example against per-second pricing:** [epctex/youtube-video-downloader](https://apify.com/epctex/youtube-video-downloader) charges $0.00075 per second for 1080p. Ten minutes is **$0.45** for the download, plus its duration lookup. If that download produces a **100 MB file**, FlashData costs **$0.0125 on Starter**, about **97.2% less** than the $0.45 download portion. This is an illustrative size assumption, not a measured result; the actual difference depends on file size, duration and your tier.

Comparison checked **November 17, 2026**, against the linked Actors' public pricing. Their capabilities and rates can change.

### Charges, free accounts and run budgets

Submission, polling and downloads that fail before file completion produce no download event. Downloading an already-paid file through the same valid link does not create another download charge. If a run stops after the completed file has been charged, resume that same run to recover the result rather than starting another download.

Your **Max total charge** and `maxFileMB` cap the permitted file size. When Apify supplies a complete tier price table, the size limit is checked conservatively at the highest rate, currently $2.50/GB. The default $0.05 budget can therefore limit a run to 20 MB even on a discounted tier. Increasing the budget changes the permitted size, not your actual per-MB rate. An oversized file fails instead of silently exceeding its limit.

Free accounts use their available Apify credits at the FREE rate. For example, $5 of available platform credits would cover up to 2 GB if entirely spent here. Credits are shared with other Actors; there is no separate FlashData free allowance or FlashData subscription. Your Apify plan subscription and separate platform operations after the run, such as dataset API access, remain subject to Apify's own charges.

## Output

Each completed run produces one **OUTPUT** record and one dataset row containing the hosted link and file details. OUTPUT also includes the run status. This illustrative JSON shows the completed OUTPUT structure; it is not a live download:

```json
{
  "status": "completed",
  "run_id": "EXAMPLE_RUN_ID",
  "download_url": "https://example.com/temporary-download/video.mp4",
  "filename": "video.mp4",
  "content_type": "video/mp4",
  "size_bytes": 10000000,
  "charged_mb": 10,
  "expires_at": "2026-11-17T12:05:00.000Z",
  "file_expires_at": "2026-11-18T12:00:00.000Z"
}
```

Use `download_url` to save the file, `size_bytes` for its actual size, and `charged_mb` for the billed whole-MB count. The expiry fields returned by your run are authoritative.

To refresh an expired link while the hosted file still exists, **resurrect the same Apify run with its original input**. Confirmed download charges are not repeated. Read the refreshed **OUTPUT**: the original dataset row can still contain the old link. Starting a new run creates a new download and can incur a new charge.

If processing is still pending after ten minutes, continue the same run. If a charge cannot be confirmed, contact support with the run URL. Private, restricted, removed or incompatible videos may fail; request only media you have permission to download.

## Send Results to Your Workflow

Use the download link and JSON result in your own media archive, editing pipeline or automation. For Notion, Todoist or another application, pass the result through your chosen automation service or the application's API:

1. Set up an Apify **run-succeeded integration or webhook** for this Actor.
2. Retrieve the run's **OUTPUT** record through the [Apify API](https://docs.apify.com/api/v2).
3. Send the file name, size and other result fields to your destination. If your workflow needs the media, download it before the link expires.
4. Save a permanent copy in your own storage when the destination needs lasting access.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. See [Apify integrations](https://docs.apify.com/platform/integrations) for available connection methods.

## Contact

For help, open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL and a description of the problem. Do not send API tokens, keys or storage credentials.

This is an independent FlashData integration, not an official YouTube product.
