# Google Search for AI Agents — FlashData

Give your AI agent a Google web search tool. FlashData returns ranked URLs, page titles and snippets as structured JSON, so research assistants, LLM applications and automated workflows can discover sources and bring web context into their work.

Use it when an agent needs to find relevant pages, look up information beyond its model knowledge, or collect links for an answer with citations. Your agent supplies a search query; the Actor returns results it can inspect, select and pass to the next step.

## When to use this tool

| Agent task | What Google Search returns for the next step |
| --- | --- |
| Web research and source discovery | Ranked pages with titles, URLs and snippets to build a research shortlist. |
| Answers with sources | Links and search excerpts for the agent to inspect before citing a source. |
| Fact-checking research | Candidate sources to compare when checking a claim. The agent still needs to evaluate the evidence. |
| Product, company or market research | Relevant web pages for comparisons and research briefs. |
| Localized research | Search results with optional country, language and location parameters. |
| Retrieval pipelines | Structured search results to select URLs for a separate page-fetching or indexing step. |

Each call searches one query and one results page. You receive search snippets and any other SERP fields returned by the provider. Full article text requires a separate page-fetching step; request additional pages with separate calls.

## Use it in an AI agent

Call this Actor through the Apify API from your agent's tool or function, or connect it to an existing workflow. The Actor's **API** tab provides platform request examples. Supply your FlashData key and the agent's search query, then read **Organic search results** or **Complete search response** when the run completes.

A typical flow is: **agent identifies an information gap → searches Google → inspects titles, snippets and source URLs → retrieves selected pages if needed → writes an answer with sources**. Search results provide source candidates; your agent handles reasoning and citation selection.

The dataset exposes `query`, `position`, `title`, `link`, `snippet` and `request_id`, and can be exported as JSON or CSV. The complete response also preserves additional fields such as related searches and People Also Ask when returned.

## Before you start

You need a [FlashData API key](https://flashdata.dev/app/api-keys) with `google_search` permission and sufficient Credits. Enter the key only in the encrypted **FlashData API key** field. Keep run input and storage private; do not share a run containing your credentials.

**Clicking Start performs one search and consumes your existing FlashData Credits.** This Actor has no additional Actor service fee. Apify compute, storage and other platform usage are separate and follow your Apify plan. See [FlashData pricing](https://flashdata.dev/pricing) for current rates.

## Get started

1. Enter your own **FlashData API key** and **Search query**, then click **Start**.
2. Open **Organic search results** for the table and JSON/CSV export. Open **Complete search response** for the full response, request ID and usage when returned.

## Input

| Field | Meaning |
| --- | --- |
| `flashdataApiKey` | Required, encrypted input; your own FlashData key. |
| `query` | Required search text, 1–2,000 characters. |
| `num` | Requested results, 1–100; default 10. Actual results may be fewer. |
| `page` | One page from 1–100; default 1. Each page is a separate query. |
| `gl`, `hl` | Optional country and interface language, for example `us` and `en`. |
| `location` | Optional geographic location. |
| `tbs` | Optional Google filter expression, such as `qdr:w`. |
| `autocorrect` | Optional boolean passed to the search provider. |

Search example; enter your own key through the encrypted input field:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling research",
  "gl": "us",
  "hl": "en",
  "num": 10,
  "page": 1
}
```

If you saved input from the earlier price-check version, remove `operation` and `maxCredits` before starting a new run. Old input is rejected so that a saved price check cannot silently become a paid search.

## Output

Each organic result becomes a dataset row. This is a **synthetic example**, not a live search result:

```json
{
  "query": "battery recycling research",
  "position": 1,
  "title": "Example research page",
  "link": "https://example.com/research",
  "snippet": "Illustrative result only.",
  "request_id": "req_example"
}
```

`OUTPUT` in the default key-value store retains the complete response, including additional SERP fields and returned usage. No organic results can be a valid outcome; inspect the complete response.

## Errors and retries

- Missing/invalid input or a key that cannot authenticate or lacks Google Search permission stops the run before it submits a search.
- A timeout or lost response can mean the search was already charged. **Do not automatically start another run.** Check saved `OUTPUT` and FlashData Jobs/usage first. A failure does not imply a refund.
- The Actor records the attempt before submission. Restarting/resurrecting the same run will not submit it again. If it stopped before completing output, inspect the saved response; a result may exist even if the dataset export is incomplete.
- A new run is a new request. The protection does not deduplicate separate runs or scheduled executions.

This independent FlashData integration is not an official Google product. Search content is external data. [API documentation](https://flashdata.dev/docs/sources/google_search) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).
