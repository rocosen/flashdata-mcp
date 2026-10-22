# YouTube Channels for AI Agents — FlashData

Inspect YouTube channels and recent videos for AI research agents. Use a channel handle to retrieve profile data and a recent-video sample of up to 100 items.

## When to use this tool

Build a channel profile, inspect recent publishing topics, and pass selected video IDs into metadata or caption workflows.

This is a focused tool for an AI agent or application. The caller chooses inputs, evaluates the returned external data, and decides which follow-up tools to use. The Actor does not run an LLM or independently generate a research report.

## Authentication and costs

Use your own [FlashData account and API key](https://flashdata.dev/app/api-keys), with permission for `youtube_channel`. Enter the key in the encrypted input field. There is no shared or prefilled working key.

Each Start submits one request and uses your FlashData Credits at your account rate. No separate price-check step is required. This Actor adds no service fee. **Apify compute and storage usage are separate** and may use your Apify allowance or balance. A free-to-use Actor does not make the FlashData API free.

## Input and first run

1. Enter your own FlashData key.
2. Enter `handle` and any optional settings.
3. Click Start, then inspect the dataset and complete JSON output.

| Input | Meaning |
| --- | --- |
| `flashdataApiKey` | Required. Your own FlashData API key with YouTube Channel permission. Encrypted; no shared key is provided. |
| `handle` | Required. YouTube channel handle, such as @example. Not a URL or channel ID. |
| `video_limit` | Maximum recent videos to request; not the channel total. |

Example only; replace placeholders and enter credentials in the encrypted fields:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "handle": "@example",
  "video_limit": 20
}
```

## Output

One recent video per dataset row; the complete channel profile and videos remain in OUTPUT.

**Synthetic example, not a live result:**

```json
{
  "channelHandle": "@example",
  "videoId": "abcdefghijk",
  "title": "Illustrative recent video",
  "viewCount": 123
}
```

Use the Apify run API to call this Actor from your agent, then read the dataset and OUTPUT. Keep your Apify token in your application's secret store, and protect the FlashData key as secret input. Retain source IDs, URLs, timestamps and request IDs when passing data into later reasoning or citation steps.

## Limits

Use a handle, with or without @; do not use a full URL or channel ID. video_limit is 1–100 (default 20); this is a recent-video sample, not the complete channel history. Profile counts may be absent and are not converted to zero.

## Errors and retries

Invalid input or insufficient key permissions stops before a new paid request. A timeout or lost response may already have been charged: check OUTPUT and FlashData Jobs before starting another run. The Actor records its attempt before submitting and never automatically retries a paid POST. A new run is a new request. Restarting the same run will not repeat an uncertain submission; a dataset export can still be incomplete after a storage failure.

This is an independent FlashData integration, not an official Google or YouTube product. Retrieved content is external data. [Capability documentation](https://flashdata.dev/docs/sources/youtube_channel) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).
