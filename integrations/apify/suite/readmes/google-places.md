# Google Places Scraper — $1/1K Requests

**$1.00 per 1,000 requests with no monthly FlashData subscription. From $0.40/1,000 on FlashData Business ($1,999/month, including 40,000 Credits). Apify usage is billed separately.**

Find local businesses and places by keyword and location. Collect a structured shortlist of cafes, shops, service providers or other places, with the contact and business details available in Google's search response.

Start with one query and your FlashData API key. Results are saved to an Apify dataset and a complete JSON OUTPUT record. API requests use your own FlashData account and Credits. Apify compute and storage are billed separately through Apify.

## Features

- **Local business results:** names, addresses and categories, with available ratings, phone numbers and websites.
- **Location-aware queries:** name a city in the query or use the location and country settings.
- **Structured export:** one place per dataset row; download JSON or CSV or retrieve results through the Apify API.
- **Direct API workflow:** enter your key and inputs, then start the request without setting up a browser or proxy.

Use it for local market research, supplier discovery or planning a list of places to review.

## Input

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | One search query, e.g. coffee shops in Singapore.  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `num` | No | Maximum results to request (1–100). Actual count may be lower. Range: 1–100. Default: `10`. |
| `page` | No | Results page number, starting at 1. Range: 1–100. Default: `1`. |
| `gl` | No | Two-letter country code, e.g. us, gb or sg.  |
| `hl` | No | Google interface language, e.g. en or zh-cn.  |
| `location` | No | Search location, e.g. Singapore or New York.  |
| `tbs` | No | Optional Google search filter. Supported behavior depends on the search type.  |
| `autocorrect` | No | Allow Google to correct spelling.  |

Each run handles one query and one page. Requested result counts are not guaranteed. Use separate runs for additional locations, queries or pages.

### Example input and first run

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `google_places` access and available Credits.
2. Enter a **Search query** such as `coffee shops in Singapore` and your key. Adjust the location, country or requested result count if needed.
3. Click **Start**, then open **Google Places results** to review the businesses and export the dataset.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "coffee shops in Singapore",
  "num": 10
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

Rates checked November 17, 2026. See [FlashData pricing](https://flashdata.dev/pricing/google-search) and your account for current rates. For example, 10,000 PAYG requests consume $10 of FlashData API usage, plus Apify resources. On a monthly plan, eligible usage is deducted from included Credits first.

### What you pay and where

- **FlashData API usage:** use your own [FlashData account and API key](https://flashdata.dev/app/api-keys). Requests consume that account's Credits at its applicable rate. 1 Credit = $0.05 of API usage; Credits are usage units, not request counts.
- **Monthly plans include Credits:** the monthly fee adds the shared Credits shown above. Usage covered by those Credits is not charged a second time. The same balance is shared across FlashData products; each product does not get a separate allowance.
- **Apify usage is separate:** compute, storage and other Apify platform operations use your Apify allowance or balance under your Apify plan. The FlashData API rate is not the total Apify cost. An Apify subscription does not select your FlashData plan.
- **No additional Actor service fee or proxy purchase:** this Actor adds no service fee and has no proxy input. You do not need to configure or buy an Apify Proxy for it. FlashData API usage and Apify resources still apply.

Clicking **Start** submits the request directly. Check key permissions and available Credits first. The Actor does not automatically retry an uncertain paid submission. After a timeout, inspect OUTPUT and FlashData Jobs/usage before starting a new run; the request may already have been charged.

## Output

The **Google Places results** dataset contains one returned place per row. This example is illustrative, not a live result:

```json
{
  "query": "coffee shops in Singapore",
  "position": 1,
  "title": "Example Cafe",
  "address": "Example Street, Singapore",
  "category": "Cafe",
  "rating": 4.5,
  "website": "https://example.com",
  "request_id": "req_example"
}
```

Optional details such as `phoneNumber`, website, ratings or coordinates may be absent. **Complete response and status** retains all returned fields and usage information.

## Send Results to Your Workflow

Export a business shortlist to your research sheet or CRM through your own connector. Verify available contact details before relying on them.

1. Save a Task or call this Actor with the [Apify API](https://docs.apify.com/api/v2) using the same input fields.
2. Use a run-succeeded integration or webhook to trigger your next step.
3. Read the default dataset for rows and the key-value store's **OUTPUT** record for the complete response, status and returned usage. JSON preserves nested fields; CSV is useful for flat rows.
4. Pass the selected fields to your spreadsheet, database or other application through your chosen connector or its API.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. Scheduled runs and follow-up Actor calls submit new requests and can incur further usage. See [Apify integrations](https://docs.apify.com/platform/integrations) for available methods.

## FAQ

**Will this find every business in a city?**

No. It returns the results available for your query and page. It does not scan a grid or build an exhaustive business directory.

**Does it collect emails or customer review text?**

No. Available phone numbers, websites and ratings can be returned, but the Actor does not crawl websites for emails or collect full reviews.

**Why are some phone numbers or websites missing?**

Fields depend on the provider response and the individual listing. A missing field does not mean the business has no phone or website.

**Can I rely on the information being current?**

Treat it as a search snapshot. Check the business website or listing before relying on contact details, opening hours or availability.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Contact

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/google_places) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official Google product.
