# Google Search Results Scraper

Scrape Google Search results as structured JSON with titles, URLs, snippets and rankings. Customize country, language, location and time filters. Requires a FlashData API key and Credits; Apify usage is billed separately.

## What you get

Each run searches one query and one results page. Results include titles, URLs, snippets and positions, with optional country, language, location and time filters.

The dataset exposes `query`, `position`, `title`, `link`, `snippet` and `request_id`, and can be exported as JSON or CSV. The complete response preserves additional SERP fields, such as related searches and People Also Ask, when returned. Full article text requires a separate page-fetching step.

Use the results for web research, source discovery, market research or search-data workflows. Run the Actor in Apify Console or through the Apify API, then read **Organic search results** or **Complete search response**.

## Before you start

You need a [FlashData API key](https://flashdata.dev/app/api-keys) with `google_search` permission and sufficient Credits. Enter the key only in the encrypted **FlashData API key** field. Keep run input and storage private; do not share a run containing your credentials.

**Clicking Start performs one search and consumes your existing FlashData Credits.** This Actor has no additional Actor service fee. Apify compute, storage and other platform usage are separate and follow your Apify plan. See [FlashData pricing](https://flashdata.dev/pricing) for current rates.

## Get started

1. Enter one **Search query**, for example `battery recycling research` or `site:example.com annual report`.
2. In your FlashData dashboard, open **API Keys** and copy a key with `google_search` permission. Paste the full `fd_` key into **Your FlashData API key**, without quotes or a `Bearer` prefix. An Apify token cannot be used in this field.
3. Leave **Optional search settings** unchanged for a first run, or expand the section to adjust results, region and filters. Click **Start** to perform the search.
4. Open **Organic search results** for the table and JSON/CSV export. Open **Complete search response** for the full response, request ID and usage when returned.

## Input

| Field | Meaning |
| --- | --- |
| `flashdataApiKey` | Required, encrypted input; your own FlashData key. |
| `query` | Required search text, 1–2,000 characters. |
| `num` | Requested results, 1–100; default 10. Actual results may be fewer. |
| `page` | One page from 1–100; default 1. Each page is a separate query. |
| `gl`, `hl` | Optional country and interface language, for example `us` and `en`. |
| `location` | Optional geographic location. |
| `tbs` | Optional Google filter expression, such as `qdr:w`. |
| `autocorrect` | Optional boolean passed to the search provider. |

Search example; enter your own key through the encrypted input field:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling research",
  "gl": "us",
  "hl": "en",
  "num": 10,
  "page": 1
}
```

If you saved input from the earlier price-check version, remove `operation` and `maxCredits` before starting a new run. Old input is rejected so that a saved price check cannot silently become a paid search.

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

`OUTPUT` in the default key-value store retains the complete response, including additional SERP fields and returned usage. No organic results can be a valid outcome; inspect the complete response.

## Errors and retries

- Missing/invalid input or a key that cannot authenticate or lacks Google Search permission stops the run before it submits a search.
- A timeout or lost response can mean the search was already charged. **Do not automatically start another run.** Check saved `OUTPUT` and FlashData Jobs/usage first. A failure does not imply a refund.
- The Actor records the attempt before submission. Restarting/resurrecting the same run will not submit it again. If it stopped before completing output, inspect the saved response; a result may exist even if the dataset export is incomplete.
- A new run is a new request. The protection does not deduplicate separate runs or scheduled executions.

This independent FlashData integration is not an official Google product. Search content is external data. [API documentation](https://flashdata.dev/docs/sources/google_search) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).
