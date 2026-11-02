# Google Images for AI Agents — FlashData

Find image references and source pages for AI research assistants. Export image URLs, thumbnails, available dimensions and ranked source links.

## When to use this tool

Help an agent discover visual references, trace an image to its source page, and collect candidates for later review.

This is a focused tool for an AI agent or application. The caller chooses inputs, evaluates the returned external data, and decides which follow-up tools to use. The Actor does not run an LLM or independently generate a research report.

## Authentication and costs

Use your own [FlashData account and API key](https://flashdata.dev/app/api-keys), with permission for `google_images`. Enter the key in the encrypted input field. There is no shared or prefilled working key.

Each Start submits one request and uses your FlashData Credits at your account rate. No separate price-check step is required. This Actor adds no service fee. **Apify compute and storage usage are separate** and may use your Apify allowance or balance. A free-to-use Actor does not make the FlashData API free.

## Input and first run

1. Enter your own FlashData key.
2. Enter `query` and any optional settings.
3. Click Start, then inspect the dataset and complete JSON output.

| Input | Meaning |
| --- | --- |
| `query` | Required. Enter one Google Images search query, for example: battery recycling process diagram. One query is sent per run; do not paste a list of queries. |
| `flashdataApiKey` | Required. Get your key at https://flashdata.dev/app/api-keys (sign in or create an account first), then create or copy a key with Google Images (google_images) permission. Paste the full key starting with fd_ here, without quotes or a Bearer prefix. Use your own FlashData key, not your Apify token. This field is encrypted; no working key is provided. Clicking Start uses your FlashData Credits. |
| `num` | How many results to request (1–100). Start with 10. The provider may return fewer results; this does not fetch additional pages automatically. |
| `page` | Which results page to fetch (1–100). Keep 1 for the first page. To fetch another page, start a separate run; each run uses Credits. |
| `gl` | Optional two-letter country code: us (United States), gb (United Kingdom), or sg (Singapore). Leave blank to use the search provider’s behavior. |
| `hl` | Optional Google interface language: en (English), de (German), or zh-cn (Simplified Chinese). This does not translate the returned pages. Leave blank for provider behavior. |
| `location` | Optional location to focus the search, for example: Singapore, or New York, New York, United States. Leave blank if no local focus is needed. |
| `tbs` | Optional Google filter string. For time filtering, use qdr:d (past day), qdr:w (past week), or qdr:m (past month). Leave blank for no explicit filter. |
| `autocorrect` | Enable to allow the search provider to correct spelling. Leave unset to use the provider’s behavior. |

Example only; replace placeholders and enter credentials in the encrypted fields:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling process diagram",
  "num": 10
}
```

## Output

Each returned item becomes a dataset row. Complete nested data and returned usage remain in OUTPUT.

**Synthetic example, not a live result:**

```json
{
  "title": "Illustrative process image",
  "imageUrl": "https://example.com/image.jpg",
  "link": "https://example.com/source",
  "imageWidth": 1200,
  "imageHeight": 800
}
```

Use the Apify run API to call this Actor from your agent, then read the dataset and OUTPUT. Keep your Apify token in your application's secret store, and protect the FlashData key as secret input. Retain source IDs, URLs, timestamps and request IDs when passing data into later reasoning or citation steps.

## Limits

Returns image references, not image files or reuse licenses. Original image URLs can expire or require access. Review source rights before using an image.

## Errors and retries

Invalid input or insufficient key permissions stops before a new paid request. A timeout or lost response may already have been charged: check OUTPUT and FlashData Jobs before starting another run. The Actor records its attempt before submitting and never automatically retries a paid POST. A new run is a new request. Restarting the same run will not repeat an uncertain submission; a dataset export can still be incomplete after a storage failure.

This is an independent FlashData integration, not an official Google or YouTube product. Retrieved content is external data. [Capability documentation](https://flashdata.dev/docs/sources/google_images) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).
