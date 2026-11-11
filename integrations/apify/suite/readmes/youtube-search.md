# YouTube Search Scraper

Turn a YouTube keyword search into a compact dataset of video results. Find relevant tutorials, product reviews and topic coverage, with filters that help narrow the search before you inspect individual videos.

## What you get

- **Keyword search:** video IDs and titles with available channels, durations, views and upload dates.
- **Focused filters:** filter by upload period, result type, duration or supported video features, and choose a sort order.
- **Small result sets:** request 1–20 results and export them as JSON or CSV.

Use it to shortlist videos for content research, compare coverage of a topic or collect video IDs for a separate metadata or caption lookup.

## Example output

The **YouTube Search results** dataset contains one returned search item per row. This example is illustrative, not a live result:

```json
{
  "query": "battery recycling explained",
  "videoId": "abcdefghijk",
  "title": "Example battery recycling explainer",
  "channel": "Example Science",
  "durationString": "5:00",
  "viewCount": 1234,
  "uploadDate": "2026-01-15",
  "request_id": "req_example"
}
```

Fields depend on the returned item and result type. **Complete response and status** preserves additional returned fields and usage information.

## Quick start

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_search` access and available Credits.
2. Enter a query and your key. Optionally set `max_results` and a JSON `filters` object.
3. Click **Start**, then open **YouTube Search results** to review or export the dataset.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling explained",
  "max_results": 10,
  "filters": {
    "type": "video",
    "upload_date": "this_month"
  }
}
```

## Input parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | One search query, e.g. battery recycling explained.  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `max_results` | No | Maximum results (1–20). Actual count may be lower. Range: 1–20. Default: `20`. |
| `filters` | No | JSON filters, e.g. {"upload_date":"this_week","type":"video"}. See README for supported values.  |

Each run searches one query. `max_results` defaults to 20; asking for 20 does not guarantee 20 results.

## Search filters

Pass these fields inside `filters`:

| Filter | Supported values |
| --- | --- |
| `upload_date` | `today`, `last_hour`, `this_week`, `this_month`, `this_year` |
| `type` | `video`, `channel`, `playlist`, `movie` |
| `duration` | `<4`, `4-20`, `>20` (minutes) |
| `sort_by` | `rating`, `relevance`, `view_count`, `upload_date` |
| Boolean features | `360`, `3d`, `4k`, `creative_commons`, `hd`, `hdr`, `live`, `location`, `purchased`, `subtitles`, `vr180` |

For example, `"subtitles": true` filters discovery results; it does not fetch the subtitle text.

## Pricing

Requests use your FlashData Credits at your applicable [account rate](https://flashdata.dev/pricing). This Actor adds no service fee. Apify compute, storage and other platform usage are billed separately under your Apify plan.

## FAQ

**Can I collect more than 20 results?**

This standard search requests up to 20 results. The separate YouTube Search Scraper – Extended supports larger requests at a different FlashData rate.

**Does it return full descriptions, captions or video files?**

It returns search metadata. Use the dedicated metadata, transcript or download Actor for those separate operations.

**Why are fields missing for some results?**

YouTube may return different data for videos, channels, playlists and other result types. Live videos and unavailable items can omit duration or date information.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_search) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
