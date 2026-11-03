# YouTube Channel Scraper

Look up a YouTube channel by handle and collect its profile with a recent-video sample. Review what a creator has been publishing and inspect the available video statistics without building a full channel archive.

## What you get

- **Channel profile:** retrieve the channel information available in the full response.
- **Recent videos:** request 1–100 video records with available titles, durations, view counts and upload dates.
- **Exportable rows:** each recent video keeps its channel context for JSON or CSV export.

Use it for creator research, comparing recent publishing topics or selecting videos for a separate metadata or caption lookup.

## Example output

The **YouTube Channel results** dataset contains one recent video per row. This example is illustrative, not a live result:

```json
{
  "channelHandle": "@example",
  "videoId": "abcdefghijk",
  "title": "Example recent channel upload",
  "viewCount": 1234,
  "uploadDate": "2026-01-15",
  "request_id": "req_example"
}
```

The table includes available `channelId`, `channelHandle`, `videoId`, `title`, `duration`, `viewCount` and `uploadDate`. Open **Complete response and status** for the full channel profile, returned videos and usage information.

## Quick start

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_channel` access and available Credits.
2. Enter a channel `handle`, such as `@Google`, and your key. Set `video_limit` to the number of recent videos you want.
3. Click **Start**, then open **YouTube Channel results** for videos or **Complete response and status** for the channel profile.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "handle": "@example",
  "video_limit": 20
}
```

## Input parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `handle` | Yes | YouTube channel handle, e.g. @Google. Use a handle, not a channel ID or URL.  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `video_limit` | No | Maximum recent videos (1–100); not the full channel history. Range: 1–100. Default: `20`. |

Replace the example handle with a real channel handle. The leading @ is optional. Full YouTube URLs and channel IDs are not accepted; use one channel per run.

## Pricing

Requests use your FlashData Credits at your applicable [account rate](https://flashdata.dev/pricing). This Actor adds no service fee. Apify compute, storage and other platform usage are billed separately under your Apify plan.

## FAQ

**Does this collect the entire channel history?**

No. It requests a recent-video sample of up to 100 items. The default is 20, and the actual count can be lower.

**Where are the channel profile fields?**

The dataset table is organized around recent videos. The complete channel profile is in Complete response and status, alongside the returned video list.

**Does a missing subscriber or view count mean zero?**

No. Counts may be unavailable or omitted by the provider. Missing values should remain unknown rather than being treated as zero.

**Does it collect business emails, captions or video files?**

No. It returns channel and recent-video metadata. Those other operations are outside this Actor's scope.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_channel) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
