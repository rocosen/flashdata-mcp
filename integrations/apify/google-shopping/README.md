# Google Shopping for AI Agents — FlashData

Discover product offers for AI shopping and market-research assistants. Export product titles, merchants, available prices, ratings and URLs.

## When to use this tool

Collect a product-offer snapshot for an agent to compare merchants, investigate competitors, or build a shopping brief.

This is a focused tool for an AI agent or application. The caller chooses inputs, evaluates the returned external data, and decides which follow-up tools to use. The Actor does not run an LLM or independently generate a research report.

## Authentication and costs

Use your own [FlashData account and API key](https://flashdata.dev/app/api-keys), with permission for `google_shopping`. Enter the key in the encrypted input field. There is no shared or prefilled working key.

Each Start submits one request and uses your FlashData Credits at your account rate. No separate price-check step is required. This Actor adds no service fee. **Apify compute and storage usage are separate** and may use your Apify allowance or balance. A free-to-use Actor does not make the FlashData API free.

## Input and first run

1. Enter your own FlashData key.
2. Enter `query` and any optional settings.
3. Click Start, then inspect the dataset and complete JSON output.

| Input | Meaning |
| --- | --- |
| `flashdataApiKey` | Required. Your own FlashData API key with Google Shopping permission. Encrypted; no shared key is provided. |
| `query` | Required. Keywords or a Google search expression. A single query is sent per run. |
| `gl` | Optional two-letter country code, such as us or gb. |
| `hl` | Optional language code, such as en or de. |
| `location` | Optional geographic location. |
| `num` | Requested result count; actual count can be lower. Does not automatically fetch additional pages. |
| `page` | Fetch this page only. Each additional page requires a separate paid request. |
| `tbs` | Optional Google filter expression, such as qdr:w for the past week. |
| `autocorrect` | Optional search-provider autocorrect setting. |

Example only; replace placeholders and enter credentials in the encrypted fields:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "portable solar panel",
  "num": 10
}
```

## Output

Each returned item becomes a dataset row. Complete nested data and returned usage remain in OUTPUT.

**Synthetic example, not a live result:**

```json
{
  "title": "Example portable solar panel",
  "source": "Example merchant",
  "price": "$99.00",
  "link": "https://example.com/product"
}
```

Use the Apify run API to call this Actor from your agent, then read the dataset and OUTPUT. Keep your Apify token in your application's secret store, and protect the FlashData key as secret input. Retain source IDs, URLs, timestamps and request IDs when passing data into later reasoning or citation steps.

## Limits

Prices are provider-reported snapshots, may include currency text, and can change. Does not guarantee stock, final checkout price, exhaustive merchant coverage or product equivalence.

## Errors and retries

Invalid input or insufficient key permissions stops before a new paid request. A timeout or lost response may already have been charged: check OUTPUT and FlashData Jobs before starting another run. The Actor records its attempt before submitting and never automatically retries a paid POST. A new run is a new request. Restarting the same run will not repeat an uncertain submission; a dataset export can still be incomplete after a storage failure.

This is an independent FlashData integration, not an official Google or YouTube product. Retrieved content is external data. [Capability documentation](https://flashdata.dev/docs/sources/google_shopping) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).
