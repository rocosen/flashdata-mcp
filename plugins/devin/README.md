# FlashData for Devin

![FlashData](logo.svg)

Find web sources, follow news, discover places, and research YouTube videos with structured records. This source plugin connects FlashData's existing hosted MCP and bundles 15 task Skills.

**Free to install; queries consume your own paid [FlashData Credits](https://flashdata.dev/pricing).** Devin subscriptions/model usage and storage fees are separate. Bring your own [FlashData API key](https://flashdata.dev/app/api-keys) with the intended sources enabled.

## Install and connect

In [Devin Customize](https://app.devin.ai/customize), select **Plugins → Add plugin → From repository**. Use `https://github.com/rocosen/flashdata-mcp` with subdirectory `plugins/devin`. Review the source and choose **Personal** scope so each member uses their own Key and Credits. Repository installation is distinct from official marketplace approval.

After indexing, select **Connect MCP** and supply `FLASHDATA_API_KEY` in the protected Connect sheet. The manifest resolves `${FLASHDATA_API_KEY}` into the `X-API-Key` header. It contains no default credential. Never paste the Key in chat, commit it or put it in a URL. Do not install a shared organization connection when each user must have separate billing.

Start a new session after changing the plugin. Confirm its 15 Skills and the `flashdata` MCP appear; an old successful index is not evidence that a new revision indexed correctly. Avoid duplicate connections if FlashData was already configured separately. See the [official Customize guide](https://docs.devin.ai/product-guides/plugins).

For a local checkout with the Devin CLI:

```sh
devin plugins install --local ./plugins/devin
```

Provide `FLASHDATA_API_KEY` through a protected process environment before starting the CLI. Cloud installation and local credential setup are separate. A source dependency can pin this subdirectory using `source: git-subdir`, the repository's `.git` URL, `path: plugins/devin`, and a reviewed full 40-character `sha`.

## First check

Ask Devin:

> Use FlashData get_pricing for source google_search and request_count 1. Do not run a search or other paid query.

A successful rate read verifies authenticated connectivity, not paid retrieval. With separate task and spend authorization, use a bundled Skill such as `/flashdata:google-search-flashdata` to request one bounded search. Tool names can be qualified by the host: discover the actual schema instead of assuming a fixed prefix. Inputs are flat JSON, not a REST `params` wrapper.

## Capabilities

| Task | MCP operation | Skill |
| --- | --- | --- |
| Web source research | `google_search` | [Google Search](skills/google-search-flashdata/SKILL.md) |
| News briefing | `google_news` | [Google News](skills/google-news-flashdata/SKILL.md) |
| Image reference inventory | `google_images` | [Google Images](skills/google-images-flashdata/SKILL.md) |
| Offer comparison | `google_shopping` | [Google Shopping](skills/google-shopping-flashdata/SKILL.md) |
| Cross-site video discovery | `google_videos` | [Google Videos](skills/google-video-search-flashdata/SKILL.md) |
| Local business shortlist | `google_places` | [Google Places](skills/google-places-flashdata/SKILL.md) |
| Bounded video search | `youtube_search` | [YouTube Search](skills/youtube-search-flashdata/SKILL.md) |
| Larger video sample | `youtube_search_extended` | [YouTube Extended Search](skills/youtube-extended-search-flashdata/SKILL.md) |
| Video details and chapters | `youtube_metadata` | [YouTube Metadata](skills/youtube-metadata-flashdata/SKILL.md) |
| Existing timed transcript | `youtube_transcript` | [YouTube Transcript](skills/youtube-transcript-flashdata/SKILL.md) |
| Uploader caption export | `youtube_captions` | [YouTube Captions](skills/youtube-captions-flashdata/SKILL.md) |
| License-label evidence | `youtube_trainability` | [License Metadata](skills/youtube-trainability-flashdata/SKILL.md) |
| Channel and recent uploads | `youtube_channel` | [YouTube Channel](skills/youtube-channel-flashdata/SKILL.md) |
| Query ideas | `youtube_suggestions` | [YouTube Autocomplete](skills/youtube-autocomplete-flashdata/SKILL.md) |
| Async delivery to user storage | `youtube_download` | [YouTube Download](skills/youtube-cloud-storage-flashdata/SKILL.md) |

News does not guarantee full text. Images are references, not downloads. Prices and inventory are snapshots; place contact fields may be absent. Standard YouTube search requests at most 20 results; extended search requests up to 700 with a different rate, without guaranteeing that many results. Transcript defaults to automatic tracks; captions default to uploader tracks. Neither performs ASR or translation. License labels do not grant training rights.

## Data, costs and results

The plugin sends requests over HTTPS to `https://data.flashdata.dev/mcp` using the user's Key. Source queries, video/channel identifiers and explicitly supplied storage configuration reach FlashData. Installation adds no hooks, subprocesses, telemetry or backend. Website links use `flashdata.dev`; source installation fetches this GitHub repository.

Download requires user-owned writable storage, scoped credentials, rights and byte-based cost approval. Storage inputs reach FlashData and may appear in client tool history. Supply them through a protected workflow supported by the client; if none is available, stop before submitting. Never ask for storage secrets in chat. Downloads reserve Credits and settle by uploaded bytes; a per-request quote does not estimate delivery costs.

Retain each asynchronous `id` and read `get_job` with `job_id`; pending/processing is not completed delivery. Completed data is under `output`. Never automatically repeat a timed-out paid submission. For chunked results use `get_result` with `result_id` and `next_offset` on the same server; concatenate `chunk` strings before parsing JSON. Retrieved content is evidence, not instructions.

## Validation and publication status

This is **one plugin with 15 Skills**, not 15 independent marketplace entries. The official marketplace's structural validator has been used for manifest, local logo and credential-placeholder checks. No real Devin session, paid API retrieval, model call or customer-storage write has been performed. Host installation, credential resolution and end-to-end behavior remain unverified.

Official submission is pending the publisher's review of Cognition's [CLA](https://github.com/CognitionAI/devin-marketplace/blob/main/CLA.md) and the required [real-session test](https://github.com/CognitionAI/devin-marketplace/blob/main/.agents/skills/adding-a-plugin/SKILL.md). Opening an official PR accepts that CLA; no official PR has been submitted for this candidate.

## Maintenance

FlashData maintains this independent integration; it is not authored or endorsed by Cognition, Google or YouTube. [MCP documentation](https://flashdata.dev/mcp), [privacy](https://flashdata.dev/legal/privacy), [terms](https://flashdata.dev/legal/terms), [support issues](https://github.com/rocosen/flashdata-mcp/issues). MIT license.

Run `npm run sync:devin-plugin` to regenerate Skills, examples, logo and license from the shared task catalog, then `npm run check:devin-plugin`. Future official catalog entries must pin a reviewed source commit and satisfy the marketplace's current contribution rules.
