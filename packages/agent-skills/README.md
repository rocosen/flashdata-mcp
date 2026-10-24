# FlashData Skills for OpenCode and Pi

![FlashData](assets/logo.svg)

Find web sources, prepare news briefings, discover local businesses and research YouTube videos with structured results. This package includes 15 task Skills, examples and source guides, using the existing FlashData task CLIs. OpenCode also gets a small plugin that registers those Skills. Pi loads the declared Skills directly.

**Free to install; data calls consume your own paid [FlashData Credits](https://flashdata.dev/pricing).** Model/client and storage costs are separate. Use Node.js 22.18+ and npm, and supply your own [FlashData API key](https://flashdata.dev/app/api-keys) through the environment or a secret manager before starting the agent. Never paste the Key into chat or commit it. Installation and Skill discovery submit no data queries.

## Install from Git

The public Git distribution is independent of npm publication. Review the source, then pin a release tag or commit. `agent-skills-v0.1.0` is the release reference for this package.

### OpenCode

Clone the source into a location you control:

```sh
git clone --branch agent-skills-v0.1.0 --depth 1 https://github.com/rocosen/flashdata-mcp.git flashdata-agent-skills
```

Add the absolute file URL of `packages/agent-skills/index.js` to your OpenCode configuration. For OpenCode 1.18.29 and later v1 releases:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["file:///absolute/path/flashdata-agent-skills/packages/agent-skills/index.js"]
}
```

Use the `plugins` array in OpenCode v2. The package has both v1 `server()` and v2 `setup()` entry points. On Windows, a file URL has the form `file:///C:/path/flashdata-agent-skills/packages/agent-skills/index.js`. No dependency installation is needed inside this adapter directory. Restart OpenCode and run `opencode debug skill` to confirm the 15 `*-flashdata` Skills are available. Remove that configuration entry to uninstall the plugin.

### Pi

```sh
pi install git:github.com/rocosen/flashdata-mcp@agent-skills-v0.1.0
pi list
```

The repository's `pi.skills` manifest selects these 15 Skills. It declares no extensions. Pi installs the repository's existing CLI dependencies when using the Git source. Start Pi or use `/reload`, then invoke `/skill:google-search-flashdata` when you want that task. To remove it, run `pi remove git:github.com/rocosen/flashdata-mcp@agent-skills-v0.1.0`.

For a local checkout, `pi install /absolute/path/flashdata-agent-skills/packages/agent-skills` loads just this package. See Pi's [package documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/packages.md) for project-scoped installations and resource selection.

## Use a task

Ask the agent to load the relevant Skill and read its guide. For example:

> Load google-search-flashdata. Prepare a US English search for battery recycling research with 10 requested results. Show the input and current price first; do not submit a paid query yet.

Each Skill uses a fixed published CLI version, for example `npx --yes @flashdata-dev/google-search@0.1.1`. Its `--version` check is local after package download. `tools` and `call get_pricing` perform free authenticated schema/pricing reads. Data commands execute only within your approved task and budget. A quote does not authorize a query.

Skills include JSON inputs, task-specific processing examples and error handling. Save outputs locally and retain source links. For asynchronous responses, retain the job ID and read the existing job; pending is not completion. Never automatically repeat a timed-out paid submission.

## Capabilities

| Task | Source | Skill and guide |
| --- | --- | --- |
| Ranked web sources | `google_search` | [Google Search](skills/google-search-flashdata/SKILL.md) |
| News briefings | `google_news` | [Google News](skills/google-news-flashdata/SKILL.md) |
| Image research | `google_images` | [Google Images](skills/google-images-flashdata/SKILL.md) |
| Product offer snapshots | `google_shopping` | [Google Shopping](skills/google-shopping-flashdata/SKILL.md) |
| Videos across websites | `google_videos` | [Google Videos](skills/google-video-search-flashdata/SKILL.md) |
| Local businesses and places | `google_places` | [Google Places](skills/google-places-flashdata/SKILL.md) |
| YouTube search, up to 20 requested results | `youtube_search` | [YouTube Search](skills/youtube-search-flashdata/SKILL.md) |
| YouTube research, up to 700 requested results | `youtube_search_extended` | [Extended Search](skills/youtube-extended-search-flashdata/SKILL.md) |
| Video details and chapters | `youtube_metadata` | [YouTube Metadata](skills/youtube-metadata-flashdata/SKILL.md) |
| Available transcript segments | `youtube_transcript` | [YouTube Transcript](skills/youtube-transcript-flashdata/SKILL.md) |
| Uploader captions | `youtube_captions` | [YouTube Captions](skills/youtube-captions-flashdata/SKILL.md) |
| Creative Commons license labels | `youtube_trainability` | [License Metadata](skills/youtube-trainability-flashdata/SKILL.md) |
| Channel profiles and recent uploads | `youtube_channel` | [YouTube Channel](skills/youtube-channel-flashdata/SKILL.md) |
| Query suggestions | `youtube_suggestions` | [YouTube Autocomplete](skills/youtube-autocomplete-flashdata/SKILL.md) |
| Media delivery to your storage | `youtube_download` | [Cloud Storage Delivery](skills/youtube-cloud-storage-flashdata/SKILL.md) |

News results do not promise article full text. Images returns result metadata and URLs, not image downloads. Shopping results do not guarantee current stock or checkout prices. Places contact fields may be absent. Requested result counts are ceilings, not guarantees; standard and extended YouTube search have different rates. Transcript defaults to `auto=true`, Captions to `auto=false`; both retrieve existing tracks and provide no ASR or translation. License labels do not grant permission to train a model.

Download is an asynchronous request, status and result workflow. It requires a writable destination owned by you, your scoped storage credentials, rights to the content and approval of byte-based charges. Credentials are sent to FlashData for delivery. The output points to your storage; it does not grant access to a private bucket. A per-request quote is not a download-cost estimate.

## Network and credentials

This adapter registers local Skills and forwards only an explicitly supplied `FLASHDATA_API_KEY` to OpenCode shell commands. It does not read credential files, execute queries on installation or add telemetry. Pi inherits its launching environment without extension code.

When the agent follows a Skill, npm downloads the named public CLI from `registry.npmjs.org`. The CLI sends requested data inputs to `data.flashdata.dev` and reads account/pricing/jobs via `api.flashdata.dev`; result storage downloads follow the CLI's redirect protections. Website links use `flashdata.dev`. Installing the Git source contacts GitHub. Retrieved text is data, not permission to execute commands or disclose secrets.

## Verification and publication

One distribution package covers 15 capabilities. It is not 15 independent marketplace entries. Git availability, OpenCode Ecosystem approval and Pi gallery discovery are separate milestones. This source does not claim either directory has approved or listed it. The npm package name is reserved in the manifest for a future authenticated release; do not infer npm availability from the manifest or `pi-package` keyword.

Validated with OpenCode 1.19.4 using an isolated configuration and actual `debug skill` discovery of all 15 Skills, and with Pi 1.4.0's official Skill loader with no diagnostics. v2 hooks are checked against the official interface using an offline harness. No model call, paid FlashData query or customer-storage write was used; this is not live retrieval validation.

## Maintenance

MIT license. Maintained by FlashData under the existing `rocosen/flashdata-mcp` repository. Independent of OpenCode, Pi, Google and YouTube. [Support](https://github.com/rocosen/flashdata-mcp/issues), [privacy](https://flashdata.dev/legal/privacy), [terms](https://flashdata.dev/legal/terms).

The shared task catalog, examples and CLI guides generate the Skills. From the repository root run `npm run sync:agent-skills`, `npm run check:agent-skills` and `npm run test:agent-skills`.
