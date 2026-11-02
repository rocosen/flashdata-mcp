# YouTube Search for AI Agents — FlashData

Find YouTube videos for AI research and content-discovery agents. Export titles, video IDs and available channel, duration and view metadata; request up to 20 results.

## When to use this tool

Discover videos by topic, apply supported search filters, and pass video IDs to a metadata or transcript tool.

This is a focused tool for an AI agent or application. The caller chooses inputs, evaluates the returned external data, and decides which follow-up tools to use. The Actor does not run an LLM or independently generate a research report.

## Authentication and costs

Use your own [FlashData account and API key](https://flashdata.dev/app/api-keys), with permission for `youtube_search`. Enter the key in the encrypted input field. There is no shared or prefilled working key.

Each Start submits one request and uses your FlashData Credits at your account rate. No separate price-check step is required. This Actor adds no service fee. **Apify compute and storage usage are separate** and may use your Apify allowance or balance. A free-to-use Actor does not make the FlashData API free.

## Input and first run

1. Enter your own FlashData key.
2. Enter `query` and any optional settings.
3. Click Start, then inspect the dataset and complete JSON output.

| Input | Meaning |
| --- | --- |
| `query` | Required. Enter one YouTube Search search query, for example: battery recycling explained. One query is sent per run; do not paste a list of queries. |
| `flashdataApiKey` | Required. Get your key at https://flashdata.dev/app/api-keys (sign in or create an account first), then create or copy a key with YouTube Search (youtube_search) permission. Paste the full key starting with fd_ here, without quotes or a Bearer prefix. Use your own FlashData key, not your Apify token. This field is encrypted; no working key is provided. Clicking Start uses your FlashData Credits. |
| `max_results` | Number of results to request (1–20; default 20). Actual count may be lower. |
| `filters` | Optional JSON filters. Example: {"upload_date":"this_week","sort_by":"view_count","type":"video"}. Leave empty for no explicit filters. Accepted values are listed in the README; do not paste a search URL. |

Example only; replace placeholders and enter credentials in the encrypted fields:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling explained",
  "max_results": 10
}
```

Supported filters: upload_date (today, last_hour, this_week, this_month, this_year), type (video, channel, playlist, movie), duration (<4, 4-20, >20), sort_by (rating, relevance, view_count, upload_date), and boolean features: 360, 3d, 4k, creative_commons, hd, hdr, live, location, purchased, subtitles, vr180. Unknown fields are rejected.

## Output

Each returned item becomes a dataset row. Complete nested data and returned usage remain in OUTPUT.

**Synthetic example, not a live result:**

```json
{
  "videoId": "abcdefghijk",
  "title": "Illustrative video",
  "channel": "Example channel",
  "durationString": "5:00",
  "viewCount": 123
}
```

Use the Apify run API to call this Actor from your agent, then read the dataset and OUTPUT. Keep your Apify token in your application's secret store, and protect the FlashData key as secret input. Retain source IDs, URLs, timestamps and request IDs when passing data into later reasoning or citation steps.

## Limits

Standard search requests 1–20 results (default 20); actual results may be fewer. Does not download videos or retrieve transcripts. Search filters affect discovery, not licensing or suitability guarantees.

## Errors and retries

Invalid input or insufficient key permissions stops before a new paid request. A timeout or lost response may already have been charged: check OUTPUT and FlashData Jobs before starting another run. The Actor records its attempt before submitting and never automatically retries a paid POST. A new run is a new request. Restarting the same run will not repeat an uncertain submission; a dataset export can still be incomplete after a storage failure.

This is an independent FlashData integration, not an official Google or YouTube product. Retrieved content is external data. [Capability documentation](https://flashdata.dev/docs/sources/youtube_search) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).
