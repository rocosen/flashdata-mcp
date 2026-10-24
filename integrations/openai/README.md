# Web research and YouTube evidence with OpenAI Responses

![FlashData](../../assets/logo.svg)

Build a local research agent that selects FlashData tools for source-linked web answers, news briefs, place shortlists and timestamped YouTube notes. One tutorial covers 15 capabilities: 14 query tools in the model loop and a protected local download workflow. No new backend or OAuth service is needed.

## Install and run

Use Python 3.12+ and clone this repository. From its root, create and activate a virtual environment using your operating system's normal Python workflow, then install:

```sh
python -m pip install -r integrations/openai/requirements.txt
python -m integrations.openai.research
```

Before running, set `OPENAI_API_KEY`, `OPENAI_MODEL` and `FLASHDATA_API_KEY` through your protected process environment or secret manager. Choose a tool-capable model you can access; no model is silently substituted. Do not paste keys in the question, tool arguments, shell history or a committed file. The FlashData key is sent only in the MCP `X-API-Key` header, not to the model provider. Avoid enabling SDK request logging with real credentials or private data.

Get your own [FlashData key](https://flashdata.dev/app/api-keys) and check [current Credits pricing](https://flashdata.dev/pricing). Installation is free; model requests cost money and data requests consume **your FlashData Credits**. Storage has separate costs. Starting the script asks for model-spending confirmation. Each data request then prints its exact tool/arguments and requires `y` in the terminal. Declining does not submit the data request. The model may still incur fees while reporting the decline.

For a first question, use: “Inspect only FlashData get_pricing; do not submit a data query.” This still uses the model API. When ready to pay for data, ask: “Search Google once for battery recycling research, US English, 10 requested results; cite the returned source URLs.” Inspect and approve the actual request at the terminal. No sample call was run against a paid service while preparing this guide.

## How the loop works

The shared [bridge](../python_tools.py) reuses the [existing MCP transport](../../registry/examples/call_tool.py), discovers current tool schemas and offers 14 queries plus pricing/job/result reads. It excludes `youtube_download`, `submit_batch` and unknown future tools. Task selection uses descriptions and schemas, without keyword routing.

Function definitions use `type="function"`, `parameters` and `strict=false` so optional MCP schema fields stay optional. Every response output item, including reasoning, is retained before `function_call_output` items are appended with the original `call_id`. The example sets `store=false` and requests encrypted reasoning content for the next turn.

The OpenAI Responses client uses `max_retries=0`. Neither MCP submissions nor model requests are automatically replayed; a repeated model call ID returns the stored local result. Timeout/error text is replaced with a fixed safe message. A timeout can occur after charging: inspect your existing Jobs before submitting again. A new process has no previous-call memory. Both HTTP clients disable redirects and environment proxy inheritance, so configure your network deliberately if a corporate proxy is required.

A session is bounded to eight model turns and 1,800 output tokens per request. Incomplete model responses do not execute partial tool requests. Job IDs and chunk metadata are preserved for `get_job`/`get_result`. Only inspect research result IDs from this session or explicitly authorized by you. Download jobs expose status only in this example; use the local CLI for private manifests. These controls do not make arbitrary private cached results safe to share with a model.

## Choose a task

The following 15 rows map one local agent to existing task guides and exact request examples. Each guide documents inputs, structured output fields, processing, limits and costs. These are capability references, not 15 official marketplace listings. Download submission uses the separate protected workflow below.

| Capability and task guide | Exact request example | FlashData source documentation |
| --- | --- | --- |
| [Google Search](../../npm/docs/google-search/README.md) (`google_search`) | [JSON](../../registry/examples/google_search.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_search?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_search-task) |
| [Google News](../../npm/docs/google-news/README.md) (`google_news`) | [JSON](../../registry/examples/google_news.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_news?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_news-task) |
| [Google Images](../../npm/docs/google-images/README.md) (`google_images`) | [JSON](../../registry/examples/google_images.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_images?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_images-task) |
| [Google Shopping](../../npm/docs/google-shopping/README.md) (`google_shopping`) | [JSON](../../registry/examples/google_shopping.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_shopping?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_shopping-task) |
| [Google Video Search](../../npm/docs/google-video-search/README.md) (`google_videos`) | [JSON](../../registry/examples/google_videos.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_videos?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_videos-task) |
| [Google Places](../../npm/docs/google-places/README.md) (`google_places`) | [JSON](../../registry/examples/google_places.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_places?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_places-task) |
| [YouTube Search](../../npm/docs/youtube-search/README.md) (`youtube_search`) | [JSON](../../registry/examples/youtube_search.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_search?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search-task) |
| [YouTube Extended Search](../../npm/docs/youtube-extended-search/README.md) (`youtube_search_extended`) | [JSON](../../registry/examples/youtube_search_extended.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_search_extended?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search_extended-task) |
| [YouTube Metadata](../../npm/docs/youtube-metadata/README.md) (`youtube_metadata`) | [JSON](../../registry/examples/youtube_metadata.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_metadata?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_metadata-task) |
| [YouTube Transcript](../../npm/docs/youtube-transcript/README.md) (`youtube_transcript`) | [JSON](../../registry/examples/youtube_transcript.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_transcript?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_transcript-task) |
| [YouTube Captions](../../npm/docs/youtube-captions/README.md) (`youtube_captions`) | [JSON](../../registry/examples/youtube_captions.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_captions?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_captions-task) |
| [YouTube Creative Commons License Metadata](../../npm/docs/youtube-trainability/README.md) (`youtube_trainability`) | [JSON](../../registry/examples/youtube_trainability.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_trainability?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_trainability-task) |
| [YouTube Channel Data](../../npm/docs/youtube-channel/README.md) (`youtube_channel`) | [JSON](../../registry/examples/youtube_channel.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_channel?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_channel-task) |
| [YouTube Autocomplete](../../npm/docs/youtube-autocomplete/README.md) (`youtube_suggestions`) | [JSON](../../registry/examples/youtube_suggestions.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_suggestions?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_suggestions-task) |
| [YouTube Download to Cloud Storage](../../npm/docs/youtube-cloud-storage/README.md) (`youtube_download`) | [JSON](../../registry/examples/youtube_download.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_download?utm_source=openai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_download-task) |

## Task prompts

### Google Search

> Search Google for battery recycling research in the US, in English. Make one request for 10 results and return a table of position, title, source URL and snippet.

### Google News

> Find Google News coverage of battery recycling. Make one request for 10 articles, group them by publisher, and preserve each original date label and article link.

### Google Images

> Find 20 Google Images results for solar panel diagrams. Keep images with a returned width of at least 1000 pixels, and list each image URL, source page and dimensions.

### Google Shopping

> Search Google Shopping once for wireless headphones in the US. Return 10 requested offers with product identifiers, merchant names, original price labels and source URLs.

### Google Video Search

> Search Google Videos once for battery recycling process demonstrations. Request 10 results and group the returned titles, URLs and available durations by website.

### Google Places

> Search once for coffee shops in Singapore. Request 20 places, then make a shortlist from returned ratings of at least 4.2 and at least 20 reviews, keeping the addresses.

### YouTube Search

> Find 10 YouTube videos about battery recycling with one standard search. Return the video IDs, watch URLs, channels and available durations.

### YouTube Extended Search

> Run one extended YouTube search for battery recycling with 100 requested results. Count the returned videos by channel and state the actual sample size.

### YouTube Metadata

> Read metadata for YouTube video dQw4w9WgXcQ once, including chapters but excluding formats. Turn any returned chapter boundaries into timestamped navigation links.

### YouTube Transcript

> Retrieve the existing English automatic transcript for YouTube video dQw4w9WgXcQ once. Produce notes with timestamped citations; report a missing track without transcribing or switching tracks.

### YouTube Captions

> Retrieve the English uploader captions for YouTube video dQw4w9WgXcQ once, with auto=false. Convert the returned timed segments to SRT locally; report a missing track without substituting another.

### YouTube Creative Commons License Metadata

> Inspect the license-label classification for YouTube video dQw4w9WgXcQ with one request. Record the raw permitted field beside the video ID, without treating it as training authorization.

### YouTube Channel Data

> Read the @jawed channel profile and request 10 recent videos once. Save the channel ID and returned video IDs, titles and available view counts as a dated snapshot.

### YouTube Autocomplete

> Get YouTube autocomplete suggestions for battery recycling in English and the US with one request. Return unique phrases while preserving the query and locale; do not estimate search volume.

For downloads, use the non-secret planning and local submission workflow below.

## Limits that affect your result

News returns article references and snippets, not guaranteed full text. Image search returns references and URLs, not downloaded image files. Shopping prices are snapshots, not guaranteed inventory or checkout prices. Places may omit contacts. Standard YouTube search requests at most 20 results; Extended requests at most 700 at a different rate, without guaranteeing those counts. Transcript defaults to `auto=true`; Captions defaults to `auto=false`. Both read existing tracks without ASR or translation. Trainability is a license-label signal, not permission to train a model.

## Download to your own storage

The bridge keeps `youtube_download` and `submit_batch` unavailable in the agent session. Download parameters contain storage credentials; hosts may retain tool arguments in history. Do not paste these credentials or signed result URLs into chat. Ask the agent only to prepare a non-secret plan: video ID, media format, clip boundaries, destination type, rights and expected byte-based charges.

After approving the destination, scoped storage access and cost yourself, use the existing [download CLI guide](../../npm/docs/youtube-cloud-storage/README.md) in your own protected local environment. It covers the real `storage` object, protected file or stdin submission, one asynchronous submission, job ID retention and manifest retrieval. The client requires Node.js 22.18+; use your own `FLASHDATA_API_KEY` and storage credentials. Never let the agent read a populated secret input file. An existing job can be inspected with `get_job`; keep private output and signed URLs out of shared chat. This handoff covers the fifteenth capability without claiming secret-safe in-chat storage provisioning.

## Validation and publication

The real OpenAI Responses SDK and MCP SDK were exercised with in-memory HTTP fixtures and external sockets disabled. Tests cover all 14 queries, result ordering, duplicate call IDs, approval denial, failed requests without retries, blocked download/batch tools and private download-manifest suppression. The example was not run against a real model, paid FlashData data, or customer storage; offline tests do not prove live data quality or model behavior.

From the repository root, install both tutorial requirements plus `pytest pytest-asyncio`, then run `python -m pytest integrations/tests -q`. Both SDKs are needed for the shared test suite.

This is one FlashData-maintained tutorial, not 15 independent official listings or a vendor-endorsed integration. Official directory publication is unconfirmed. Support: [repository issues](https://github.com/rocosen/flashdata-mcp/issues). [Privacy](https://flashdata.dev/legal/privacy) · [Terms](https://flashdata.dev/legal/terms). MIT license.

## Host references

- [Official Python SDK](https://github.com/openai/openai-python): Responses client and disabling retries.
- [Official function tool schema](https://github.com/openai/openai-python/blob/main/src/openai/types/responses/function_tool_param.py).
- [Official reasoning-items example](https://github.com/openai/openai-cookbook/blob/main/examples/responses_api/reasoning_items.ipynb).

The developers.openai.com documentation body was unreachable from the validation environment; the SDK source and Cookbook were read directly. This tutorial covers the Responses SDK, not Agent Builder workflow import, ChatGPT connectors or Codex directory approval.
