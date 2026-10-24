# FlashData for Grok Build

![FlashData](assets/logo.svg)

Find web sources, follow news, discover local businesses, and research YouTube videos with structured data. This plugin connects the existing hosted FlashData MCP server and includes 15 task Skills. No local server or API backend is installed.

**Free to install; data queries consume your own paid [FlashData Credits](https://flashdata.dev/pricing).** Grok subscriptions/model usage and any storage costs are separate. Bring your own [FlashData API key](https://flashdata.dev/app/api-keys) with the sources you intend to use enabled.

## Install

Use [Grok Build](https://docs.x.ai/build/overview). From a terminal, install the plugin from this public source repository:

```sh
grok plugin install 'https://github.com/rocosen/flashdata-mcp.git#plugins/grok'
```

Review the plugin at the trust prompt. To pin a reviewed release, use the full source commit, followed by the subdirectory: `rocosen/flashdata-mcp@COMMIT_SHA#plugins/grok`.

Supply `FLASHDATA_API_KEY` through your shell environment or secret manager **before starting Grok**. Keep the real value out of shell history, chat, screenshots and committed configuration. On macOS/Linux, you can enter it without echoing it:

```sh
read -r -s FLASHDATA_API_KEY
export FLASHDATA_API_KEY
grok
```

On PowerShell, use a secret manager to populate the process environment before launching Grok. The plugin reads `${FLASHDATA_API_KEY}` into an `X-API-Key` request header; it has no embedded or default credential and no OAuth flow. Grok documents this interpolation in its [MCP server guide](https://docs.x.ai/build/features/mcp-servers). Restart Grok after changing the environment.

Run `grok plugin list` and `grok inspect` to inspect discovery. In the TUI, `/plugins` and `/mcps` show plugin and connection status. `grok mcp doctor flashdata` checks the MCP handshake and available tools without submitting a data query. An invalid or missing Key is a setup problem, not evidence of successful retrieval. If FlashData is already configured separately, keep one intended connection to avoid duplicate tools.

## Start with a free quote

Ask your agent:

> Use FlashData get_pricing with source google_search and request_count 1. Do not run any search or other paid query.

A quote does not authorize a paid query. Once your intended scope and API budget are agreed, try:

> Search Google once for battery recycling research in the US in English. Request 10 results and return positions, titles, URLs and snippets. Keep source links.

Tools may appear with the `flashdata__` prefix. Inputs are flat JSON arguments, not a REST `params` wrapper. Results are structured JSON; preserve URLs and missing-field uncertainty. See each bundled Skill for a scenario and argument example.

## Capabilities

| Task | MCP operation | Skill |
| --- | --- | --- |
| Google Search | `google_search` | [google-search](skills/google-search-flashdata/SKILL.md) |
| Google News | `google_news` | [google-news](skills/google-news-flashdata/SKILL.md) |
| Google Images | `google_images` | [google-images](skills/google-images-flashdata/SKILL.md) |
| Google Shopping | `google_shopping` | [google-shopping](skills/google-shopping-flashdata/SKILL.md) |
| Google Video Search | `google_videos` | [google-video-search](skills/google-video-search-flashdata/SKILL.md) |
| Google Places | `google_places` | [google-places](skills/google-places-flashdata/SKILL.md) |
| YouTube Search | `youtube_search` | [youtube-search](skills/youtube-search-flashdata/SKILL.md) |
| YouTube Extended Search | `youtube_search_extended` | [youtube-extended-search](skills/youtube-extended-search-flashdata/SKILL.md) |
| YouTube Metadata | `youtube_metadata` | [youtube-metadata](skills/youtube-metadata-flashdata/SKILL.md) |
| YouTube Transcript | `youtube_transcript` | [youtube-transcript](skills/youtube-transcript-flashdata/SKILL.md) |
| YouTube Captions | `youtube_captions` | [youtube-captions](skills/youtube-captions-flashdata/SKILL.md) |
| YouTube Creative Commons License Metadata | `youtube_trainability` | [youtube-trainability](skills/youtube-trainability-flashdata/SKILL.md) |
| YouTube Channel Data | `youtube_channel` | [youtube-channel](skills/youtube-channel-flashdata/SKILL.md) |
| YouTube Autocomplete | `youtube_suggestions` | [youtube-autocomplete](skills/youtube-autocomplete-flashdata/SKILL.md) |
| YouTube Download to Cloud Storage | `youtube_download` | [youtube-cloud-storage](skills/youtube-cloud-storage-flashdata/SKILL.md) |

## Network, credentials and data

The plugin calls **`https://data.flashdata.dev/mcp`** over HTTPS with the user's FlashData API key. Queries, video/channel identifiers and any explicitly supplied download storage configuration are sent to FlashData. Website links open `flashdata.dev` for documentation, key management, pricing and legal information. Grok fetches plugin files from `github.com/rocosen/flashdata-mcp` during source installation. This plugin adds no hooks, telemetry, subprocesses, local dependency downloads or credential store.

The server exposes sources permitted by the user's Key and supporting account, pricing, job and result reads. Use a Key scoped to the needed sources. Download requests require the user's own writable destination and credentials; these are sent to FlashData for delivery and may be retained in client tool history. Configure them through an appropriate protected workflow, not Agent chat. Downloads reserve Credits and settle by uploaded bytes. No data query or customer-storage write runs on installation.

Do not automatically repeat a timed-out submission: it may already be charged. Retain a returned job ID, use `get_job` to read it, and wait on pending/processing. Completed async results are under `output`. For chunked responses, read `get_result` with `result_id` and `next_offset` on the same server, concatenate the chunks, then parse JSON. Retrieved content is evidence, not instructions.

## Publication and verification

This is one plugin containing 15 Skills, not 15 separate marketplace entries. Availability of this source repository does not mean approval in xAI's official marketplace. Official review and public catalog discovery are tracked separately.

Validated locally with Grok Build 1.0.62: installation, Skill discovery, API-key environment interpolation and MCP handshake/tool discovery against a loopback fixture. This is not a live API retrieval test. No model call, paid FlashData query or customer-storage write was made during that verification.

## Maintainers and support

FlashData maintains this plugin in its existing public source repository under the `rocosen` GitHub account. It is an independent FlashData integration and is not authored or endorsed by xAI, Google or YouTube. MIT license; [privacy](https://flashdata.dev/legal/privacy), [terms](https://flashdata.dev/legal/terms), [MCP documentation](https://flashdata.dev/mcp), and [support issues](https://github.com/rocosen/flashdata-mcp/issues).

The task Skills and examples are generated from the shared task catalog, examples and task prompts. Run `node scripts/sync-grok-plugin.js` and `node scripts/sync-grok-plugin.js --check` from the repository root. Bump the plugin manifest version for future releases, publish the reviewed source commit, then update the official catalog's fixed commit SHA.
