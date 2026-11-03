# Google News Scraper

Search Google News for coverage of a brand, company or industry topic. Collect headlines and publisher links in a structured dataset for news monitoring, market research and media analysis.

## What you get

- **News results by keyword:** headlines, publishers, dates, links and snippets when available.
- **Search controls:** choose a country, language, location and time filter, then select a results page.
- **Exportable data:** one news result per dataset row, ready to download as JSON or CSV or retrieve through the Apify API.

Use it to track product announcements, review competitor coverage or build a reading list for an industry report.

## Example output

Open **Google News results** to view the dataset. The following row is illustrative, not a live news result:

```json
{
  "query": "battery recycling",
  "position": 1,
  "title": "Example company announces battery recycling facility",
  "link": "https://example.com/news/recycling-facility",
  "source": "Example News",
  "date": "1 day ago",
  "snippet": "An illustrative summary of the announcement.",
  "request_id": "req_example"
}
```

Fields depend on the search response. Dates may be relative or absent, and snippets are not guaranteed. **Complete response and status** contains the full JSON response and returned usage information.

## Quick start

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `google_news` access and available Credits.
2. Enter your **Search query** and key, then adjust optional filters.
3. Click **Start** and open **Google News results** to review or export the results.

Example: search for recent coverage in English, using the US country setting.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling",
  "num": 10,
  "gl": "us",
  "hl": "en",
  "tbs": "qdr:w"
}
```

## Input parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | One news search query, 1–2,000 characters. |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input. |
| `num` | No | Requested result count: 1–100. Default: 10. Actual count may be lower. |
| `page` | No | Results page: 1–100. Default: 1. |
| `gl` | No | Two-letter country code, e.g. `us`, `gb` or `sg`. |
| `hl` | No | Google interface language, e.g. `en` or `zh-cn`. |
| `location` | No | Search location, e.g. `Singapore` or `New York`. |
| `tbs` | No | Google search filter, e.g. `qdr:d` (past day), `qdr:w` (week) or `qdr:m` (month). |
| `autocorrect` | No | Allow spelling correction. Omit to use the provider's behavior. |

Each run searches one query and one page. Use separate runs for additional queries or pages. For recurring monitoring, save your input as an Apify Task and schedule it; each scheduled run makes a new request.

## Pricing

Searches use your FlashData Credits at your applicable [account rate](https://flashdata.dev/pricing). This Actor adds no service fee. Apify compute, storage and other platform usage are billed separately under your Apify plan.

## FAQ

**Does it return the full article?**

It returns news search metadata and available snippets. Full article text requires opening or fetching the linked page separately.

**Can I retrieve every article about a topic?**

Search results are a snapshot, not a complete news archive. Result counts, ordering and dates depend on the query and provider response; requesting 100 results does not guarantee 100 rows.

**Does a repeated search return only new articles?**

No. Each run is independent and does not deduplicate against previous runs. Compare saved links across runs if you need a list of newly discovered stories.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/google_news) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official Google product.
