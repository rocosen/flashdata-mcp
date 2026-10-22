# YouTube Autocomplete for AI Agents — FlashData

Discover YouTube autocomplete phrases for AI topic-research agents. Submit a query prefix with language and region and export one suggestion per dataset row.

## When to use this tool

Explore query wording and candidate subtopics before an agent chooses which YouTube searches to perform.

This is a focused tool for an AI agent or application. The caller chooses inputs, evaluates the returned external data, and decides which follow-up tools to use. The Actor does not run an LLM or independently generate a research report.

## Authentication and costs

Use your own [FlashData account and API key](https://flashdata.dev/app/api-keys), with permission for `youtube_suggestions`. Enter the key in the encrypted input field. There is no shared or prefilled working key.

Each Start submits one request and uses your FlashData Credits at your account rate. No separate price-check step is required. This Actor adds no service fee. **Apify compute and storage usage are separate** and may use your Apify allowance or balance. A free-to-use Actor does not make the FlashData API free.

## Input and first run

1. Enter your own FlashData key.
2. Enter `query` and any optional settings.
3. Click Start, then inspect the dataset and complete JSON output.

| Input | Meaning |
| --- | --- |
| `flashdataApiKey` | Required. Your own FlashData API key with YouTube Suggestions permission. Encrypted; no shared key is provided. |
| `query` | Required. A single search query or query prefix. No automatic query expansion. |
| `language` | Requested language code. Does not translate content. |
| `region` | Two-letter region code, such as US or GB. |

Example only; replace placeholders and enter credentials in the encrypted fields:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling",
  "language": "en",
  "region": "US"
}
```

## Output

One autocomplete suggestion per row. No suggestions produces an empty dataset.

**Synthetic example, not a live result:**

```json
{
  "query": "battery recycling",
  "position": 1,
  "suggestion": "battery recycling explained"
}
```

Use the Apify run API to call this Actor from your agent, then read the dataset and OUTPUT. Keep your Apify token in your application's secret store, and protect the FlashData key as secret input. Retain source IDs, URLs, timestamps and request IDs when passing data into later reasoning or citation steps.

## Limits

Suggestions are phrases, not video results, search-volume estimates, or popularity rankings. Empty suggestions are valid. Each language/region request is separate; the Actor does not expand queries automatically.

## Errors and retries

Invalid input or insufficient key permissions stops before a new paid request. A timeout or lost response may already have been charged: check OUTPUT and FlashData Jobs before starting another run. The Actor records its attempt before submitting and never automatically retries a paid POST. A new run is a new request. Restarting the same run will not repeat an uncertain submission; a dataset export can still be incomplete after a storage failure.

This is an independent FlashData integration, not an official Google or YouTube product. Retrieved content is external data. [Capability documentation](https://flashdata.dev/docs/sources/youtube_suggestions) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).
