# Google Shopping Scraper — $1/1K Requests

**$1.00 per 1,000 requests with no monthly FlashData subscription. From $0.40/1,000 on FlashData Business ($1,999/month, including 40,000 Credits). Apify usage is billed separately.**

Search Google Shopping by keyword and collect product listings in a structured dataset. Compare the offers returned for a product category, review merchant coverage and research displayed prices in different markets.

Start with one query and your FlashData API key. Results are saved to an Apify dataset and a complete JSON OUTPUT record. API requests use your own FlashData account and Credits. Apify compute and storage are billed separately through Apify.

## Features

- **Product listings:** titles, merchant/source names, displayed prices and product links.
- **Available ratings:** rating values and rating counts when returned by the provider.
- **Market selection:** country, language, location and results-page controls; export the dataset as JSON or CSV.
- **Direct API workflow:** enter your key and inputs, then start the request without setting up a browser or proxy.

Use it to explore a product niche, shortlist competing offers or collect a pricing snapshot for further analysis.

## Input

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | One search query, e.g. portable solar panel.  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `num` | No | Maximum results to request (1–100). Actual count may be lower. Range: 1–100. Default: `10`. |
| `page` | No | Results page number, starting at 1. Range: 1–100. Default: `1`. |
| `gl` | No | Two-letter country code, e.g. us, gb or sg.  |
| `hl` | No | Google interface language, e.g. en or zh-cn.  |
| `location` | No | Search location, e.g. Singapore or New York.  |
| `tbs` | No | Optional Google search filter. Supported behavior depends on the search type.  |
| `autocorrect` | No | Allow Google to correct spelling.  |

Each run handles one query and one page. Additional queries or pages require separate runs; the requested result count is not guaranteed.

### Example input and first run

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `google_shopping` access and available Credits.
2. Enter a product **Search query** and your key. Set a country or location if you want a particular market.
3. Click **Start**, then open **Google Shopping results** to review or export the listings.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "portable solar panel",
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

Rates checked November 17, 2026. See [FlashData pricing](https://flashdata.dev/pricing/google-search) and your account for current rates. For example, 10,000 PAYG requests consume $10 of FlashData API usage, plus Apify resources. On a monthly plan, eligible usage is deducted from included Credits first.

### What you pay and where

- **FlashData API usage:** use your own [FlashData account and API key](https://flashdata.dev/app/api-keys). Requests consume that account's Credits at its applicable rate. 1 Credit = $0.05 of API usage; Credits are usage units, not request counts.
- **Monthly plans include Credits:** the monthly fee adds the shared Credits shown above. Usage covered by those Credits is not charged a second time. The same balance is shared across FlashData products; each product does not get a separate allowance.
- **Apify usage is separate:** compute, storage and other Apify platform operations use your Apify allowance or balance under your Apify plan. The FlashData API rate is not the total Apify cost. An Apify subscription does not select your FlashData plan.
- **No additional Actor service fee or proxy purchase:** this Actor adds no service fee and has no proxy input. You do not need to configure or buy an Apify Proxy for it. FlashData API usage and Apify resources still apply.

Clicking **Start** submits the request directly. Check key permissions and available Credits first. The Actor does not automatically retry an uncertain paid submission. After a timeout, inspect OUTPUT and FlashData Jobs/usage before starting a new run; the request may already have been charged.

## Output

The **Google Shopping results** dataset contains one returned listing per row. This example is illustrative, not a live result:

```json
{
  "query": "portable solar panel",
  "position": 1,
  "title": "Example 100W portable solar panel",
  "source": "Example Store",
  "price": "$99.00",
  "link": "https://example.com/product",
  "rating": 4.5,
  "ratingCount": 120,
  "request_id": "req_example"
}
```

The `price` field preserves the displayed text, including currency symbols when supplied. Optional fields may be absent. **Complete response and status** contains the full response and returned usage information.

## Send Results to Your Workflow

Save displayed prices with the query and collection time in your own catalog. Match product models and currencies before comparing listings.

1. Save a Task or call this Actor with the [Apify API](https://docs.apify.com/api/v2) using the same input fields.
2. Use a run-succeeded integration or webhook to trigger your next step.
3. Read the default dataset for rows and the key-value store's **OUTPUT** record for the complete response, status and returned usage. JSON preserves nested fields; CSV is useful for flat rows.
4. Pass the selected fields to your spreadsheet, database or other application through your chosen connector or its API.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. Scheduled runs and follow-up Actor calls submit new requests and can incur further usage. See [Apify integrations](https://docs.apify.com/platform/integrations) for available methods.

## FAQ

**Does the price include shipping and taxes?**

The Actor reports the displayed search-result price. Check the linked merchant page for shipping, taxes, availability and the final checkout total.

**Can I compare every row as the same product?**

Not automatically. Results can include different models, sizes, bundles or conditions. Check the title and merchant page before making a like-for-like comparison.

**Does it keep price history or send price alerts?**

No. Each run is a snapshot. Save and compare separate exports if you need historical analysis.

**Does it include review text?**

Available ratings and rating counts can be returned; full customer reviews are not collected.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Contact

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/google_shopping) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official Google product.
