# Google Shopping Scraper

Search Google Shopping by keyword and collect product listings in a structured dataset. Compare the offers returned for a product category, review merchant coverage and research displayed prices in different markets.

## What you get

- **Product listings:** titles, merchant/source names, displayed prices and product links.
- **Available ratings:** rating values and rating counts when returned by the provider.
- **Market selection:** country, language, location and results-page controls; export the dataset as JSON or CSV.

Use it to explore a product niche, shortlist competing offers or collect a pricing snapshot for further analysis.

## Example output

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

## Quick start

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

## Input parameters

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

## Pricing

Requests use your FlashData Credits at your applicable [account rate](https://flashdata.dev/pricing). This Actor adds no service fee. Apify compute, storage and other platform usage are billed separately under your Apify plan.

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

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/google_shopping) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official Google product.
