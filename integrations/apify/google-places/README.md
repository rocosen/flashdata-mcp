# Google Places Scraper

Find local businesses and places by keyword and location. Collect a structured shortlist of cafes, shops, service providers or other places, with the contact and business details available in Google's search response.

## What you get

- **Local business results:** names, addresses and categories, with available ratings, phone numbers and websites.
- **Location-aware queries:** name a city in the query or use the location and country settings.
- **Structured export:** one place per dataset row; download JSON or CSV or retrieve results through the Apify API.

Use it for local market research, supplier discovery or planning a list of places to review.

## Example output

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

## Quick start

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

## Input parameters

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

## Pricing

Requests use your FlashData Credits at your applicable [account rate](https://flashdata.dev/pricing). This Actor adds no service fee. Apify compute, storage and other platform usage are billed separately under your Apify plan.

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

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/google_places) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official Google product.
