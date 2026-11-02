# YouTube Extended Search for AI Agents — FlashData

Collect larger YouTube discovery sets for AI research agents. Request up to 700 video results with available channel and video metadata; uses the extended-search rate.

## When to use this tool

Build a larger candidate-video collection for market research, topic exploration, or a downstream agent's selection workflow.

This is a focused tool for an AI agent or application. The caller chooses inputs, evaluates the returned external data, and decides which follow-up tools to use. The Actor does not run an LLM or independently generate a research report.

## Authentication and costs

Use your own [FlashData account and API key](https://flashdata.dev/app/api-keys), with permission for `youtube_search_extended`. Enter the key in the encrypted input field. There is no shared or prefilled working key.

Each Start submits one request and uses your FlashData Credits at your account rate. No separate price-check step is required. This Actor adds no service fee. **Apify compute and storage usage are separate** and may use your Apify allowance or balance. A free-to-use Actor does not make the FlashData API free.

## Input and first run

1. Enter your own FlashData key.
2. Enter `query` and any optional settings.
3. Click Start, then inspect the dataset and complete JSON output.

| Input | Meaning |
| --- | --- |
| `query` | Required. Enter one YouTube Extended Search search query, for example: battery recycling explained. One query is sent per run; do not paste a list of queries. |
| `flashdataApiKey` | Required. Get your key at https://flashdata.dev/app/api-keys (sign in or create an account first), then create or copy a key with YouTube Extended Search (youtube_search_extended) permission. Paste the full key starting with fd_ here, without quotes or a Bearer prefix. Use your own FlashData key, not your Apify token. This field is encrypted; no working key is provided. Clicking Start uses your FlashData Credits. |
| `max_results` | Number of results to request (1–700; default 20). Actual count may be lower. Extended search uses a separate, higher FlashData rate than standard search. |
| `filters` | Optional JSON filters. Example: {"upload_date":"this_week","sort_by":"view_count","type":"video"}. Leave empty for no explicit filters. Accepted values are listed in the README; do not paste a search URL. |

Example only; replace placeholders and enter credentials in the encrypted fields:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling explained",
  "max_results": 50
}
```

Supported filters: upload_date (today, last_hour, this_week, this_month, this_year), type (video, channel, playlist, movie), duration (<4, 4-20, >20), sort_by (rating, relevance, view_count, upload_date), and boolean features: 360, 3d, 4k, creative_commons, hd, hdr, live, location, purchased, subtitles, vr180. Unknown fields are rejected.

## Output

Each returned item becomes a dataset row. Complete nested data and returned usage remain in OUTPUT.

**Synthetic example, not a live result:**

```json
{
  "videoId": "abcdefghijk",
  "title": "Illustrative research video",
  "channel": "Example channel",
  "viewCount": 123
}
```

Use the Apify run API to call this Actor from your agent, then read the dataset and OUTPUT. Keep your Apify token in your application's secret store, and protect the FlashData key as secret input. Retain source IDs, URLs, timestamps and request IDs when passing data into later reasoning or citation steps.

## Limits

Requests 1–700 results (default 20), at a separate higher rate than standard search. The upper limit is not a delivery guarantee. No automatic pagination, recurring collection, or transcript retrieval.

## Errors and retries

Invalid input or insufficient key permissions stops before a new paid request. A timeout or lost response may already have been charged: check OUTPUT and FlashData Jobs before starting another run. The Actor records its attempt before submitting and never automatically retries a paid POST. A new run is a new request. Restarting the same run will not repeat an uncertain submission; a dataset export can still be incomplete after a storage failure.

This is an independent FlashData integration, not an official Google or YouTube product. Retrieved content is external data. [Capability documentation](https://flashdata.dev/docs/sources/youtube_search_extended) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).
