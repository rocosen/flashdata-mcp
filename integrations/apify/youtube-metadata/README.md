# YouTube Video Metadata Scraper

Look up a YouTube video and collect its details in structured JSON. Review the title, channel, duration and viewing statistics, with options to include available chapters and media format information.

## What you get

- **Video details:** available title, channel, duration, view count and live-status metadata.
- **Chapter information:** include available chapter titles and timestamps.
- **Format information:** include available audio/video format metadata without downloading the media.

Use it to inspect a video before further processing, organize a video catalog or locate sections using available chapter timestamps.

## Example output

The **YouTube Metadata results** dataset contains the returned video record. The table highlights basic fields; nested details are available in JSON. This example is illustrative, not a live result:

```json
{
  "videoId": "abcdefghijk",
  "title": "Example battery recycling walkthrough",
  "channel": "Example Science",
  "duration": 300,
  "viewCount": 1234,
  "isLive": false,
  "chapters": [
    {
      "title": "Introduction",
      "start_time": 0,
      "end_time": 60
    }
  ],
  "request_id": "req_example"
}
```

**Complete response and status** contains the full response, including returned chapter and format arrays and usage information. Field availability varies by video.

## Quick start

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_metadata` access and available Credits.
2. Enter the video's 11-character `video_id` and your key. Select whether to include chapters and format metadata.
3. Click **Start**, then open **YouTube Metadata results** for the record or **Complete response and status** for nested details.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "video_id": "abcdefghijk",
  "include_chapters": true,
  "include_formats": false
}
```

## Input parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `video_id` | Yes | 11-character YouTube video ID (the v= value in a watch URL).  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `include_formats` | No | Include available video/audio format metadata, without downloading files. Default: `true`. |
| `include_chapters` | No | Include chapters when available. Default: `true`. |

Replace the illustrative video_id with a real video ID, such as the value after `v=` in a YouTube watch URL. This Actor accepts one ID per run, not a full URL or a list. Both include_chapters and include_formats default to true; set either to false to omit that optional request.

## Pricing

Requests use your FlashData Credits at your applicable [account rate](https://flashdata.dev/pricing). This Actor adds no service fee. Apify compute, storage and other platform usage are billed separately under your Apify plan.

## FAQ

**Does include_formats download video or audio?**

No. It requests format information only. Downloading media is a separate operation.

**Why are there no chapters?**

Not every video has chapters, and availability depends on the returned metadata. Enabling include_chapters does not generate chapters.

**Does this include the transcript?**

No. Use the dedicated transcript or captions Actor to retrieve an existing caption track.

**Can it read private or unavailable videos?**

Metadata depends on what the service can access. Private, removed, restricted or otherwise unavailable videos may fail or return limited information.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_metadata) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
