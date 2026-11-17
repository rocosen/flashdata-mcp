# Google Search Results Scraper — Fast & Affordable

**$1.00 per 1,000 requests with no monthly FlashData subscription. From $0.40/1,000 on FlashData Business ($1,999/month, including 40,000 Credits). Apify usage is billed separately.**

Turn a Google search query into a dataset you can review, export or use in your workflow. Find relevant pages for web research, competitor analysis and market research, with controls for where and when to search.

Start with one query and your FlashData API key. Results are saved to an Apify dataset and a complete JSON OUTPUT record. API requests use your own FlashData account and Credits. Apify compute and storage are billed separately through Apify.

## Features

- **Structured results:** titles, URLs, snippets and search positions, with one organic result per dataset row.
- **Localized searches:** set the country, interface language and geographic location.
- **Time filters and pagination:** narrow the time range, choose a results page and request up to 100 results. Availability depends on the search response.
- **Export and integration:** download JSON or CSV, or start runs and retrieve results through the Apify API.
- **Direct API workflow:** enter your key and inputs, then start the request without setting up a browser or proxy.

## Input

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

### Example input and first run

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

## Pricing

All prices below are in USD.

**Pay as you go: $1.00/1,000 requests, with no monthly FlashData subscription.** Lower API rates apply to FlashData monthly plans; these are FlashData plans, independent of your Apify subscription.

| FlashData plan | Monthly fee | Included Credits | API rate per 1,000 requests |
| --- | --- | --- | --- |
| Pay as you go | $0 | 0 | $1.00 |
| Micro | $49 | 1,000 | $0.80 |
| Starter | $199 | 4,000 | $0.65 |
| Pro | $499 | 10,000 | $0.60 |
| Scale | $999 | 20,000 | $0.50 |
| Business | $1,999 | 40,000 | $0.40 |

One request is **one query and one selected results page**. Each additional query or page is a separate request. The API rate is per request, not per dataset row; requesting more results within the supported limit does not change that unit. Actual result counts may be lower.

### How the API rate compares

For one query returning the first 10 organic results on one page, FlashData PAYG has a **$1.00/1,000-request API rate**. [Apify Google Search Scraper](https://apify.com/apify/google-search-scraper) lists $4.50/1,000 SERP pages on its Free tier; [Apidojo](https://apify.com/apidojo/google-search-scraper) lists $2.00/1,000 queries on Free, including the first 10 results. The FlashData API component is about 78% and 50% lower, respectively.

This compares base retrieval rates, not total bills: FlashData adds Apify resource usage, while those competitors include run platform usage and can charge start or additional-feature events. It is not a claim of the lowest Store price. Competitor discounts, subscription fees, optional enrichment and larger result sets change the comparison. Checked November 17, 2026; follow the links for current rates.

Rates checked November 17, 2026. See [FlashData pricing](https://flashdata.dev/pricing/google-search) and your account for current rates. For example, 10,000 PAYG requests consume $10 of FlashData API usage, plus Apify resources. On a monthly plan, eligible usage is deducted from included Credits first.

### What you pay and where

- **FlashData API usage:** use your own [FlashData account and API key](https://flashdata.dev/app/api-keys). Requests consume that account's Credits at its applicable rate. 1 Credit = $0.05 of API usage; Credits are usage units, not request counts.
- **Monthly plans include Credits:** the monthly fee adds the shared Credits shown above. Usage covered by those Credits is not charged a second time. The same balance is shared across FlashData products; each product does not get a separate allowance.
- **Apify usage is separate:** compute, storage and other Apify platform operations use your Apify allowance or balance under your Apify plan. The FlashData API rate is not the total Apify cost. An Apify subscription does not select your FlashData plan.
- **No additional Actor service fee or proxy purchase:** this Actor adds no service fee and has no proxy input. You do not need to configure or buy an Apify Proxy for it. FlashData API usage and Apify resources still apply.

Clicking **Start** submits the request directly. Check key permissions and available Credits first. The Actor does not automatically retry an uncertain paid submission. After a timeout, inspect OUTPUT and FlashData Jobs/usage before starting a new run; the request may already have been charged.

## Output

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

## Send Results to Your Workflow

Pass titles, URLs and snippets into a research sheet or a page-fetching step. Keep search positions and request IDs when comparing later runs.

1. Save a Task or call this Actor with the [Apify API](https://docs.apify.com/api/v2) using the same input fields.
2. Use a run-succeeded integration or webhook to trigger your next step.
3. Read the default dataset for rows and the key-value store's **OUTPUT** record for the complete response, status and returned usage. JSON preserves nested fields; CSV is useful for flat rows.
4. Pass the selected fields to your spreadsheet, database or other application through your chosen connector or its API.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. Scheduled runs and follow-up Actor calls submit new requests and can incur further usage. See [Apify integrations](https://docs.apify.com/platform/integrations) for available methods.

## FAQ

**Why did I receive fewer results than requested?**

`num` is a requested count, not a guarantee. The response may contain fewer organic results or none. Check **Complete search response** for the full result.

**Does this return full articles?**

It returns search results and snippets. Fetching the full text of linked pages requires a separate tool.

**Are related searches and People Also Ask included?**

When the provider returns them, they are preserved in **Complete search response**. The dataset table contains organic results only.

**What should I do if a run fails?**

For authentication errors, check that your key is active, has `google_search` access and sufficient Credits. After a timeout or interrupted run, check the saved response and FlashData Jobs/usage before starting again: the request may already have been charged. Restarting the same run does not automatically repeat an attempted search; starting a new run can create another charge.

## Contact

For help, open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Keep API keys out of support messages and shared run data.

[API documentation](https://flashdata.dev/docs/sources/google_search) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official Google product.
