# YouTube Search Scraper — Fast & Affordable

**$0.50 per 1,000 requests with no monthly FlashData subscription. From $0.20/1,000 on FlashData Business ($1,999/month, including 40,000 Credits). Apify usage is billed separately.**

Turn a YouTube keyword search into a compact dataset of video results. Find relevant tutorials, product reviews and topic coverage, with filters that help narrow the search before you inspect individual videos.

Start with one query and your FlashData API key. Results are saved to an Apify dataset and a complete JSON OUTPUT record. API requests use your own FlashData account and Credits. Apify compute and storage are billed separately through Apify.

## Features

- **Keyword search:** video IDs and titles with available channels, durations, views and upload dates.
- **Focused filters:** filter by upload period, result type, duration or supported video features, and choose a sort order.
- **Small result sets:** request 1–20 results and export them as JSON or CSV.
- **Direct API workflow:** enter your key and inputs, then start the request without setting up a browser or proxy.

Use it to shortlist videos for content research, compare coverage of a topic or collect video IDs for a separate metadata or caption lookup.

## Input

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | One search query, e.g. battery recycling explained.  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `max_results` | No | Maximum results (1–20). Actual count may be lower. Range: 1–20. Default: `20`. |
| `filters` | No | JSON filters, e.g. {"upload_date":"this_week","type":"video"}. See README for supported values.  |

Each run searches one query. `max_results` defaults to 20; asking for 20 does not guarantee 20 results.

### Example input and first run

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

### Search filters

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

All prices below are in USD.

**Pay as you go: $0.50/1,000 requests, with no monthly FlashData subscription.** Lower API rates apply to FlashData monthly plans; these are FlashData plans, independent of your Apify subscription.

| FlashData plan | Monthly fee | Included Credits | API rate per 1,000 requests |
| --- | --- | --- | --- |
| Pay as you go | $0 | 0 | $0.50 |
| Micro | $49 | 1,000 | $0.40 |
| Starter | $199 | 4,000 | $0.35 |
| Pro | $499 | 10,000 | $0.30 |
| Scale | $999 | 20,000 | $0.25 |
| Business | $1,999 | 40,000 | $0.20 |

One request is **one keyword search**, with up to 20 requested results. The API rate is per request, not per video result; fewer returned items do not change the unit. Extended Search is a separate capability with its own rate.

Rates checked November 17, 2026. See [FlashData pricing](https://flashdata.dev/pricing/youtube-data) and your account for current rates. This standard-rate table excludes Extended Search. For example, 10,000 PAYG requests consume $5 of FlashData API usage, plus Apify resources. On a monthly plan, eligible usage is deducted from included Credits first.

### What you pay and where

- **FlashData API usage:** use your own [FlashData account and API key](https://flashdata.dev/app/api-keys). Requests consume that account's Credits at its applicable rate. 1 Credit = $0.05 of API usage; Credits are usage units, not request counts.
- **Monthly plans include Credits:** the monthly fee adds the shared Credits shown above. Usage covered by those Credits is not charged a second time. The same balance is shared across FlashData products; each product does not get a separate allowance.
- **Apify usage is separate:** compute, storage and other Apify platform operations use your Apify allowance or balance under your Apify plan. The FlashData API rate is not the total Apify cost. An Apify subscription does not select your FlashData plan.
- **No additional Actor service fee or proxy purchase:** this Actor adds no service fee and has no proxy input. You do not need to configure or buy an Apify Proxy for it. FlashData API usage and Apify resources still apply.

Clicking **Start** submits the request directly. Check key permissions and available Credits first. The Actor does not automatically retry an uncertain paid submission. After a timeout, inspect OUTPUT and FlashData Jobs/usage before starting a new run; the request may already have been charged.

## Output

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

## Send Results to Your Workflow

Pass selected video IDs to the separate metadata, transcript or captions Actor. Each follow-up lookup is a separate request with its own usage.

1. Save a Task or call this Actor with the [Apify API](https://docs.apify.com/api/v2) using the same input fields.
2. Use a run-succeeded integration or webhook to trigger your next step.
3. Read the default dataset for rows and the key-value store's **OUTPUT** record for the complete response, status and returned usage. JSON preserves nested fields; CSV is useful for flat rows.
4. Pass the selected fields to your spreadsheet, database or other application through your chosen connector or its API.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. Scheduled runs and follow-up Actor calls submit new requests and can incur further usage. See [Apify integrations](https://docs.apify.com/platform/integrations) for available methods.

## FAQ

**Can I collect more than 20 results?**

This standard search requests up to 20 results. The separate YouTube Search Scraper – Extended supports larger requests at a different FlashData rate.

**Does it return full descriptions, captions or video files?**

It returns search metadata. Use the dedicated metadata, transcript or download Actor for those separate operations.

**Why are fields missing for some results?**

YouTube may return different data for videos, channels, playlists and other result types. Live videos and unavailable items can omit duration or date information.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Contact

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_search) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
