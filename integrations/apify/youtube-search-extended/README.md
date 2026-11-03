# YouTube Search Scraper – Extended

Build a larger collection of YouTube search results for a topic. Extended Search lets you request up to 700 items from one query, giving content researchers and analysts more candidates to review than the standard 20-result search.

## What you get

- **Larger result sets:** request 1–700 search items from a single keyword query.
- **Search filters:** narrow the upload period, type, duration and supported features, with selectable sort order.
- **Exportable metadata:** titles and video IDs with available channel, duration, view and date fields, ready for JSON or CSV.

Use it to explore broad topics, assemble a video research dataset or compare a larger set of content before selecting individual videos.

## Example output

The **YouTube Extended Search results** dataset contains one returned search item per row. This example is illustrative, not a live result:

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

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_search_extended` access and available Credits.
2. Enter one query and your key, then set `max_results` above 20 when you need a larger collection. Optional filters narrow the search.
3. Click **Start**, then open **YouTube Extended Search results** to inspect and export the returned collection.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling explained",
  "max_results": 50,
  "filters": {
    "type": "video",
    "sort_by": "relevance"
  }
}
```

## Input parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | One search query, e.g. battery recycling explained.  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `max_results` | No | Maximum results (1–700). Actual count may be lower. Range: 1–700. Default: `20`. |
| `filters` | No | JSON filters, e.g. {"upload_date":"this_week","type":"video"}. See README for supported values.  |

Each run handles one query. The default is 20 results, so set max_results explicitly when you want more. The maximum of 700 is a requested ceiling, not a guaranteed delivery count.

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

Requests use the **extended-search FlashData rate**, which is higher than the standard YouTube search rate, even when you request a small result set. Check your [FlashData account rate](https://flashdata.dev/pricing). This Actor adds no service fee; Apify compute, storage and other platform usage are billed separately.

## FAQ

**When should I use Extended instead of standard Search?**

Use Extended when you need more than the standard 20-result ceiling. For a short shortlist, the standard YouTube Search Scraper uses the lower search rate.

**Will a request for 700 return 700 results?**

Not necessarily. The query, filters and available YouTube results determine the actual count. It is not an exhaustive archive or an unlimited collection mode.

**Can I submit multiple queries or continue through pages?**

This Actor accepts one query per run and does not expose automatic pagination or a continuation token. Use separate runs for additional queries.

**Does it fetch captions or enrich every video with full details?**

It returns search metadata. Captions, full video metadata and downloads are separate operations.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_search_extended) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
