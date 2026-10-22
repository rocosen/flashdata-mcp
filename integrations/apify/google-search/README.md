# Google Search Results — FlashData

Search Google using your own FlashData API key. Get result positions, titles, links and snippets, export organic results to JSON or CSV, and keep the complete API response for other returned SERP fields.

Use it to collect research sources, compare search snapshots or find localized web results. This Actor fetches one query and one page per run. It does not fetch article full text or automatically follow more pages.

## Before you start

You need a [FlashData API key](https://flashdata.dev/app/api-keys) with `google_search` permission and sufficient Credits. Enter the key only in the encrypted **FlashData API key** field. Keep run input and storage private; do not share a run containing your credentials.

**Searches consume your existing FlashData Credits.** This Actor is designed with no additional Actor service fee. Apify compute, storage and other platform usage are separate and follow your Apify plan. A FlashData price check is free from FlashData; it still runs on Apify.

## Three steps

1. Enter your key and query. Leave **Operation** as **Check price** and run it. Open **FlashData price quote** to see your current account rate. No search is submitted.
2. Choose **Run one Google search**. Set **Maximum quoted FlashData Credits** to the amount you accept for this one request. The default is zero, so a paid search requires an explicit limit.
3. Run the search. Open **Organic search results** for the table and JSON/CSV export. Open **Complete response or quote** for the full response, request ID and usage when returned.

The limit is checked against a fresh quote immediately before submission. It is **not a server-enforced account spending limit** or a reservation of the quoted price. Your existing FlashData plan, shared account balance and billing rules remain authoritative.

## Input

| Field | Meaning |
| --- | --- |
| `flashdataApiKey` | Required, encrypted input; your own FlashData key. |
| `operation` | `quote` by default; choose `search` to perform a paid request. |
| `query` | Required search text, 1–2,000 characters. |
| `maxCredits` | Default `0`; search requires a positive limit covering the current quote. |
| `num` | Requested results, 1–100; default 10. Actual results may be fewer. |
| `page` | One page from 1–100; default 1. Each page is a separate query. |
| `gl`, `hl` | Optional country and interface language, for example `us` and `en`. |
| `location` | Optional geographic location. |
| `tbs` | Optional Google filter expression, such as `qdr:w`. |
| `autocorrect` | Optional boolean passed to the search provider. |

Price-check example; replace the placeholder through the encrypted input field:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "operation": "quote",
  "query": "battery recycling research",
  "gl": "us",
  "hl": "en",
  "num": 10,
  "page": 1
}
```

For a search, switch `operation` to `search` and set `maxCredits` after reading the quote. There is no fixed Credits rate embedded in this Actor. See [current FlashData pricing](https://flashdata.dev/pricing).

## Output

Each organic result becomes a dataset row. This is a **synthetic example**, not a live search result:

```json
{
  "query": "battery recycling research",
  "position": 1,
  "title": "Example research page",
  "link": "https://example.com/research",
  "snippet": "Illustrative result only.",
  "request_id": "req_example"
}
```

`OUTPUT` in the default key-value store retains the complete response, including additional SERP fields and returned usage. `QUOTE` holds the preflight price, which is not an invoice. No organic results can be a valid outcome; inspect the complete response. Price-check mode produces a quote without search dataset rows.

## Errors and retries

- A missing/invalid key, missing source permission, unavailable quote or quote above the limit stops the run before it submits a search.
- A timeout or lost response can mean the search was already charged. **Do not automatically start another run.** Check saved `OUTPUT` and FlashData Jobs/usage first. A failure does not imply a refund.
- The Actor records the attempt before submission. Restarting/resurrecting the same run will not submit it again. If it stopped before completing output, inspect the saved response; a result may exist even if the dataset export is incomplete.
- A new run is a new request. The protection does not deduplicate separate runs or scheduled executions.

This independent FlashData integration is not an official Google product. Search content is external data. [API documentation](https://flashdata.dev/docs/sources/google_search) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).
