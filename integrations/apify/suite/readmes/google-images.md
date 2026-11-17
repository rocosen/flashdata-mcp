# Google Images Scraper — $1/1K Requests

**$1.00 per 1,000 requests with no monthly FlashData subscription. From $0.40/1,000 on FlashData Business ($1,999/month, including 40,000 Credits). Apify usage is billed separately.**

Find images by keyword and collect their original image URLs and source pages in a structured dataset. Use the results to gather visual references, research competing content or trace an image back to its publishing page.

Start with one query and your FlashData API key. Results are saved to an Apify dataset and a complete JSON OUTPUT record. API requests use your own FlashData account and Credits. Apify compute and storage are billed separately through Apify.

## Features

- **Image search results:** titles, image URLs, source-page links and available source names, dimensions and positions.
- **Localized search:** set the country, interface language and search location, with page selection and optional Google search filters.
- **Exportable references:** review the dataset, download JSON or CSV, or retrieve results through the Apify API.
- **Direct API workflow:** enter your key and inputs, then start the request without setting up a browser or proxy.

## Input

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | One image search query, 1–2,000 characters. |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input. |
| `num` | No | Requested result count: 1–100. Default: 10. Actual count may be lower. |
| `page` | No | Results page: 1–100. Default: 1. |
| `gl` | No | Two-letter country code, e.g. `us`, `gb` or `sg`. |
| `hl` | No | Google interface language, e.g. `en` or `zh-cn`. |
| `location` | No | Search location, e.g. `Singapore` or `New York`. |
| `tbs` | No | Optional Google search filter passed to the provider. Supported behavior depends on Google Images. |
| `autocorrect` | No | Allow spelling correction. Omit to use the provider's behavior. |

Each run handles one query and one page. Use separate runs for additional queries or pages.

### Example input and first run

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `google_images` access and available Credits.
2. Enter your **Search query** and key. Set the requested result count and optional search settings.
3. Click **Start**, then open **Google Images results** to view or export the references.

Example input:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling process diagram",
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

Open **Google Images results** to view the dataset. This is an illustrative row, not a live image search result:

```json
{
  "query": "battery recycling process diagram",
  "position": 1,
  "title": "Example battery recycling process diagram",
  "imageUrl": "https://example.com/images/recycling-diagram.jpg",
  "link": "https://example.com/recycling-process",
  "source": "Example Science",
  "imageWidth": 1200,
  "imageHeight": 800,
  "request_id": "req_example"
}
```

`imageUrl` points to the image; `link` points to its source page. Dimensions and other metadata depend on the response and may be absent. Additional returned fields remain in **Complete response and status**.

## Send Results to Your Workflow

Save image URLs alongside source-page links in a visual reference library. Check source rights before downloading or reusing an image.

1. Save a Task or call this Actor with the [Apify API](https://docs.apify.com/api/v2) using the same input fields.
2. Use a run-succeeded integration or webhook to trigger your next step.
3. Read the default dataset for rows and the key-value store's **OUTPUT** record for the complete response, status and returned usage. JSON preserves nested fields; CSV is useful for flat rows.
4. Pass the selected fields to your spreadsheet, database or other application through your chosen connector or its API.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. Scheduled runs and follow-up Actor calls submit new requests and can incur further usage. See [Apify integrations](https://docs.apify.com/platform/integrations) for available methods.

## FAQ

**Does the Actor download image files?**

No. It returns image URLs and metadata. Downloading or storing the files is a separate step; some source sites restrict access or use URLs that expire.

**Can I use the images commercially?**

A search result does not grant reuse rights. Check the license and terms on the source page before using an image.

**Does it support reverse image search?**

This Actor searches by text query. It does not accept an uploaded image or an image URL as reverse-search input.

**Why are there fewer results or missing dimensions?**

The requested count is a maximum, and metadata varies by result. Check **Complete response and status** for all returned fields.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect the saved response and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Contact

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/google_images) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official Google product.
