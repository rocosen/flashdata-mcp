# Google Images Scraper

Find images by keyword and collect their original image URLs and source pages in a structured dataset. Use the results to gather visual references, research competing content or trace an image back to its publishing page.

## What you get

- **Image search results:** titles, image URLs, source-page links and available source names, dimensions and positions.
- **Localized search:** set the country, interface language and search location, with page selection and optional Google search filters.
- **Exportable references:** review the dataset, download JSON or CSV, or retrieve results through the Apify API.

## Example output

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

## Quick start

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

## Input parameters

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

## Pricing

Searches use your FlashData Credits at your applicable [account rate](https://flashdata.dev/pricing). This Actor adds no service fee. Apify compute, storage and other platform usage are billed separately under your Apify plan.

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

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/google_images) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official Google product.
