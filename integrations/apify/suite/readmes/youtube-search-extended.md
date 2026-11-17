# YouTube Search Scraper — Up to 700 Results

**Request up to 700 results from one query. Extended Search uses its own FlashData rate, separate from standard YouTube Search. Check your account rate before starting. Apify usage is billed separately.**

Build a larger collection of YouTube search results for a topic. Extended Search lets you request up to 700 items from one query, giving content researchers and analysts more candidates to review than the standard 20-result search.

Start with one query and your FlashData API key. Results are saved to an Apify dataset and a complete JSON OUTPUT record. API requests use your own FlashData account and Credits. Apify compute and storage are billed separately through Apify.

## Features

- **Larger result sets:** request 1–700 search items from a single keyword query.
- **Search filters:** narrow the upload period, type, duration and supported features, with selectable sort order.
- **Exportable metadata:** titles and video IDs with available channel, duration, view and date fields, ready for JSON or CSV.
- **Direct API workflow:** enter your key and inputs, then start the request without setting up a browser or proxy.

Use it to explore broad topics, assemble a video research dataset or compare a larger set of content before selecting individual videos.

## Input

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | One search query, e.g. battery recycling explained.  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `max_results` | No | Maximum results (1–700). Actual count may be lower. Range: 1–700. Default: `20`. |
| `filters` | No | JSON filters, e.g. {"upload_date":"this_week","type":"video"}. See README for supported values.  |

Each run handles one query. The default is 20 results, so set max_results explicitly when you want more. The maximum of 700 is a requested ceiling, not a guaranteed delivery count.

### Example input and first run

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

**Extended Search is priced separately from standard YouTube requests**, even when you request 20 results or fewer. The standard $0.50/1,000 PAYG and $0.20/1,000 Business rates do not apply here.

The [public YouTube pricing page](https://flashdata.dev/pricing/youtube-data) does not list a numeric Extended Search rate. Check the Extended Search rate for your account in [FlashData](https://flashdata.dev/app) before submitting; do not estimate it from the standard-search table. Monthly plans use the same shared Credits balance, but the amount consumed by this capability follows its own account rate.

Each run submits one query with `max_results` from 1 to 700 (default 20). The ceiling is a requested result count, not a guarantee of 700 rows. For a shortlist of 20 or fewer items, consider the lower-rate [standard YouTube Search Actor](https://apify.com/flashdata/youtube-search).

### What you pay and where

- **FlashData API usage:** use your own [FlashData account and API key](https://flashdata.dev/app/api-keys). Requests consume that account's Credits at its applicable rate. 1 Credit = $0.05 of API usage; Credits are usage units, not request counts.
- **Monthly plans include Credits:** the monthly fee adds shared Credits. Usage covered by those Credits is not charged a second time. The same balance is shared across FlashData products; each product does not get a separate allowance.
- **Apify usage is separate:** compute, storage and other Apify platform operations use your Apify allowance or balance under your Apify plan. The FlashData API rate is not the total Apify cost. An Apify subscription does not select your FlashData plan.
- **No additional Actor service fee or proxy purchase:** this Actor adds no service fee and has no proxy input. You do not need to configure or buy an Apify Proxy for it. FlashData API usage and Apify resources still apply.

Clicking **Start** submits the request directly. Check key permissions and available Credits first. The Actor does not automatically retry an uncertain paid submission. After a timeout, inspect OUTPUT and FlashData Jobs/usage before starting a new run; the request may already have been charged.

## Output

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

## Send Results to Your Workflow

Filter the returned candidate list before selecting IDs for metadata or caption lookups. Those follow-up operations are separate requests; Extended does not enrich every video automatically.

1. Save a Task or call this Actor with the [Apify API](https://docs.apify.com/api/v2) using the same input fields.
2. Use a run-succeeded integration or webhook to trigger your next step.
3. Read the default dataset for rows and the key-value store's **OUTPUT** record for the complete response, status and returned usage. JSON preserves nested fields; CSV is useful for flat rows.
4. Pass the selected fields to your spreadsheet, database or other application through your chosen connector or its API.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. Scheduled runs and follow-up Actor calls submit new requests and can incur further usage. See [Apify integrations](https://docs.apify.com/platform/integrations) for available methods.

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

## Contact

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_search_extended) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
