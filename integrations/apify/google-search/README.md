# Google Search Results Scraper

Turn a Google search query into a dataset you can review, export or use in your workflow. Find relevant pages for web research, competitor analysis and market research, with controls for where and when to search.

## Key features

- **Structured results:** titles, URLs, snippets and search positions, with one organic result per dataset row.
- **Localized searches:** set the country, interface language and geographic location.
- **Time filters and pagination:** narrow the time range, choose a results page and request up to 100 results. Availability depends on the search response.
- **Export and integration:** download JSON or CSV, or start runs and retrieve results through the Apify API.

## Example output

The **Organic search results** dataset contains rows in this format. This is an illustrative example, not a live search result:

```json
{
  "query": "battery recycling research",
  "position": 1,
  "title": "Example battery recycling research",
  "link": "https://example.com/battery-recycling",
  "snippet": "An illustrative summary of a research page.",
  "request_id": "req_example"
}
```

**Complete search response** contains the full response, including additional SERP fields such as related searches and People Also Ask when available.

## Quick start

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `google_search` access and available Credits.
2. Enter your **Search query** and key in the encrypted **FlashData API key** field. Adjust optional settings if needed.
3. Click **Start**, then open **Organic search results** to view or export the data.

Example input for one search:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling research",
  "num": 10,
  "gl": "us",
  "hl": "en"
}
```

## Input parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | One search query, 1–2,000 characters. |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input. |
| `num` | No | Requested result count: 1–100. Default: 10. |
| `page` | No | Results page: 1–100. Default: 1. |
| `gl` | No | Two-letter country code, e.g. `us`, `gb` or `sg`. |
| `hl` | No | Google interface language, e.g. `en` or `zh-cn`. |
| `location` | No | Geographic location, e.g. `Singapore` or `New York`. |
| `tbs` | No | Time or other Google filter, e.g. `qdr:d` (past day), `qdr:w` (week) or `qdr:m` (month). |
| `autocorrect` | No | Allow spelling correction. Omit to use the provider's behavior. |

Each run handles one query and one page. Use separate runs for additional queries or pages.

## Pricing

Searches use Credits from your FlashData account at your applicable [FlashData rate](https://flashdata.dev/pricing). This Actor adds no service fee. **Apify compute, storage and other platform usage are billed separately** under your Apify plan.

Clicking **Start** performs the search directly. A new run is a new request; additional queries and pages incur separate usage.

## FAQ

**Why did I receive fewer results than requested?**

`num` is a requested count, not a guarantee. The response may contain fewer organic results or none. Check **Complete search response** for the full result.

**Does this return full articles?**

It returns search results and snippets. Fetching the full text of linked pages requires a separate tool.

**Are related searches and People Also Ask included?**

When the provider returns them, they are preserved in **Complete search response**. The dataset table contains organic results only.

**What should I do if a run fails?**

For authentication errors, check that your key is active, has `google_search` access and sufficient Credits. After a timeout or interrupted run, check the saved response and FlashData Jobs/usage before starting again: the request may already have been charged. Restarting the same run does not automatically repeat an attempted search; starting a new run can create another charge.

## Support

For help, open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Keep API keys out of support messages and shared run data.

[API documentation](https://flashdata.dev/docs/sources/google_search) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official Google product.
