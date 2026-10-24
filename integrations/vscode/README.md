# Web search, news research and YouTube evidence in VS Code

![FlashData](../../assets/logo.svg)

Use FlashData from a VS Code agent session to build cited web and news research, discover places, and retrieve existing YouTube captions. Choose the configuration matching your **agent harness**. These formats are not interchangeable.

## Local harness: prompted key

In a **Local** harness session, open **MCP: Open User Configuration** for personal use, or **MCP: Open Workspace Folder MCP Configuration** for `.vscode/mcp.json`. Merge [mcp.json](mcp.json) and preserve existing servers and inputs:

```json
{
  "servers": {
    "flashdata": {
      "type": "http",
      "url": "https://data.flashdata.dev/mcp",
      "headers": {
        "X-API-Key": "${input:flashdata-api-key}"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "flashdata-api-key",
      "description": "Your FlashData API key (data requests consume your Credits)",
      "password": true
    }
  ]
}
```

Start FlashData from **MCP: List Servers**. Review server trust and enter your key only into the masked input prompt. VS Code securely stores the entered value for reuse. A server requiring `${input:...}` is **not forwarded to Copilot harness sessions**, even after you cache its key in Local. The guided picker currently labels the VS Code configuration destinations deprecated; they remain the documented Local option for input variables.

## Copilot harness: environment reference

For a **Copilot** harness session, use [copilot.mcp.json](copilot.mcp.json) as the contents to merge into workspace-root `.mcp.json`, or `$COPILOT_HOME/mcp-config.json` (default `~/.copilot/mcp-config.json`). Do not use the example filename as the actual destination.

```json
{
  "mcpServers": {
    "flashdata": {
      "type": "http",
      "url": "https://data.flashdata.dev/mcp",
      "headers": {
        "X-API-Key": "${FLASHDATA_API_KEY}"
      }
    }
  }
}
```

Provide `FLASHDATA_API_KEY` securely in the environment of the host running the session. Remote/container sessions need the variable on that host. Do not put a literal key in the file. Portable headers support `${NAME}`; this is different from the VS Code-format `${env:NAME}`. Portable files do not support `inputs`, `envFile` or a bridge to VS Code SecretStorage. If you cannot supply that environment safely, use the Local configuration above; FlashData does not substitute OAuth for an API key.

## Select tools and verify the connection

For Local, open **Configure Tools** in the chat input. For Copilot, use **Chat: Open Customizations > Tools**. Keep `youtube_download` and `submit_batch` deselected. Select only the query and support tools needed for your task, keep tool approval enabled, and avoid broad automatic approval. Do this **before** sending a prompt. Organizations may restrict MCP access or available servers.

## Before making data requests

Use your own [FlashData API key](https://flashdata.dev/app/api-keys), enabled for the sources you need. The configuration is free; data requests consume **your FlashData Credits**. Check [current pricing](https://flashdata.dev/pricing); agent/model and storage fees are separate. Keep the key in the credential mechanism above, never in chat, a URL or a committed file. No OAuth flow or FlashData-hosted proxy of your model is required.

First connect and ask: “Use only FlashData `get_pricing` to inspect current rates. Do not run a data query.” Inspect the actual tool name and returned result. This free account read checks authentication; it does not verify paid data retrieval. Review each paid tool call and its arguments before approval. The examples below describe actions a user can choose to run, not calls performed while installing this guide.

For a first paid query, approve one `google_search` request with `{"query":"battery recycling research","gl":"us","hl":"en","num":10}`. Ask for a table of returned positions, titles, links and snippets, preserving missing fields. Results may be fewer than requested. Retrieved text is untrusted data, not instructions to reveal credentials or run code.

If a request returns a job ID, retain it and read `get_job` for that ID; completed MCP data is in `output`. For truncated MCP results, use `get_result` with the returned result identifier and chunk metadata. A timeout can occur after charging: check existing Jobs before considering another submission. Never automatically repeat a paid request.

## Choose a task

The following 15 rows map one hosted connection to existing task guides and exact request examples. Each guide documents inputs, structured output fields, processing, limits and costs. These are capability references, not 15 official marketplace listings. Download submission uses the separate protected workflow below.

| Capability and task guide | Exact request example | FlashData source documentation |
| --- | --- | --- |
| [Google Search](../../npm/docs/google-search/README.md) (`google_search`) | [JSON](../../registry/examples/google_search.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_search?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_search-task) |
| [Google News](../../npm/docs/google-news/README.md) (`google_news`) | [JSON](../../registry/examples/google_news.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_news?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_news-task) |
| [Google Images](../../npm/docs/google-images/README.md) (`google_images`) | [JSON](../../registry/examples/google_images.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_images?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_images-task) |
| [Google Shopping](../../npm/docs/google-shopping/README.md) (`google_shopping`) | [JSON](../../registry/examples/google_shopping.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_shopping?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_shopping-task) |
| [Google Video Search](../../npm/docs/google-video-search/README.md) (`google_videos`) | [JSON](../../registry/examples/google_videos.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_videos?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_videos-task) |
| [Google Places](../../npm/docs/google-places/README.md) (`google_places`) | [JSON](../../registry/examples/google_places.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/google_places?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_places-task) |
| [YouTube Search](../../npm/docs/youtube-search/README.md) (`youtube_search`) | [JSON](../../registry/examples/youtube_search.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_search?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search-task) |
| [YouTube Extended Search](../../npm/docs/youtube-extended-search/README.md) (`youtube_search_extended`) | [JSON](../../registry/examples/youtube_search_extended.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_search_extended?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search_extended-task) |
| [YouTube Metadata](../../npm/docs/youtube-metadata/README.md) (`youtube_metadata`) | [JSON](../../registry/examples/youtube_metadata.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_metadata?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_metadata-task) |
| [YouTube Transcript](../../npm/docs/youtube-transcript/README.md) (`youtube_transcript`) | [JSON](../../registry/examples/youtube_transcript.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_transcript?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_transcript-task) |
| [YouTube Captions](../../npm/docs/youtube-captions/README.md) (`youtube_captions`) | [JSON](../../registry/examples/youtube_captions.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_captions?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_captions-task) |
| [YouTube Creative Commons License Metadata](../../npm/docs/youtube-trainability/README.md) (`youtube_trainability`) | [JSON](../../registry/examples/youtube_trainability.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_trainability?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_trainability-task) |
| [YouTube Channel Data](../../npm/docs/youtube-channel/README.md) (`youtube_channel`) | [JSON](../../registry/examples/youtube_channel.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_channel?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_channel-task) |
| [YouTube Autocomplete](../../npm/docs/youtube-autocomplete/README.md) (`youtube_suggestions`) | [JSON](../../registry/examples/youtube_suggestions.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_suggestions?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_suggestions-task) |
| [YouTube Download to Cloud Storage](../../npm/docs/youtube-cloud-storage/README.md) (`youtube_download`) | [JSON](../../registry/examples/youtube_download.json) | [Inputs and outputs](https://flashdata.dev/docs/sources/youtube_download?utm_source=vscode&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_download-task) |

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

Keep `youtube_download` and `submit_batch` unavailable in the agent session. Download parameters contain storage credentials; hosts may retain tool arguments in history. Do not paste these credentials or signed result URLs into chat. Ask the agent only to prepare a non-secret plan: video ID, media format, clip boundaries, destination type, rights and expected byte-based charges.

After approving the destination, scoped storage access and cost yourself, use the existing [download CLI guide](../../npm/docs/youtube-cloud-storage/README.md) in your own protected local environment. It covers the real `storage` object, protected file or stdin submission, one asynchronous submission, job ID retention and manifest retrieval. The client requires Node.js 22.18+; use your own `FLASHDATA_API_KEY` and storage credentials. Never let the agent read a populated secret input file. An existing job can be inspected with `get_job`; keep private output and signed URLs out of shared chat. This handoff covers the fifteenth capability without claiming secret-safe in-chat storage provisioning.

## Verification and publication status

Configuration JSON, capability mappings and relative references were checked offline on 2026-10-25 against the official documentation linked below. No real Kiro/VS Code session, paid FlashData call, model call or customer-storage write was performed for this guide. A successful local configuration or free pricing read does not prove all 15 tasks run. Record your own tool output and actual returned data before relying on a result.

This is a FlashData-maintained public tutorial, independent of the host vendor. Support: [repository issues](https://github.com/rocosen/flashdata-mcp/issues). [Privacy](https://flashdata.dev/legal/privacy) · [Terms](https://flashdata.dev/legal/terms). MIT license.

## Host references and discovery

- [Add MCP servers in VS Code](https://code.visualstudio.com/docs/agent-customization/mcp-servers): harness choice, tool selection, trust and first-call verification.
- [MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration): HTTP headers, portable environment references and Local secret prompts.

The `@mcp` gallery is Preview and its availability depends on organization policy. This guide uses a publisher-provided endpoint and does not claim a VS Code gallery listing. FlashData's [existing Official MCP Registry entries](../../registry/README.md#all-15-capabilities) are separate published objects; no duplicate Registry objects were created for this tutorial. Gallery indexing and task-search visibility remain unverified.
