# YouTube Metadata for AI Agents — FlashData

Read YouTube video metadata for AI research agents. Get available titles, channels, statistics, chapters and formats as structured JSON from a video ID.

## When to use this tool

Inspect a candidate video before retrieving its transcript, navigating chapters, or choosing a media-processing step.

This is a focused tool for an AI agent or application. The caller chooses inputs, evaluates the returned external data, and decides which follow-up tools to use. The Actor does not run an LLM or independently generate a research report.

## Authentication and costs

Use your own [FlashData account and API key](https://flashdata.dev/app/api-keys), with permission for `youtube_metadata`. Enter the key in the encrypted input field. There is no shared or prefilled working key.

Each Start submits one request and uses your FlashData Credits at your account rate. No separate price-check step is required. This Actor adds no service fee. **Apify compute and storage usage are separate** and may use your Apify allowance or balance. A free-to-use Actor does not make the FlashData API free.

## Input and first run

1. Enter your own FlashData key.
2. Enter `video_id` and any optional settings.
3. Click Start, then inspect the dataset and complete JSON output.

| Input | Meaning |
| --- | --- |
| `video_id` | Required. Paste one 11-character YouTube video ID. For https://www.youtube.com/watch?v=abcdefghijk, copy only abcdefghijk (illustrative ID; replace it with your video). Full URLs and lists are not accepted. |
| `flashdataApiKey` | Required. Get your key at https://flashdata.dev/app/api-keys (sign in or create an account first), then create or copy a key with YouTube Metadata (youtube_metadata) permission. Paste the full key starting with fd_ here, without quotes or a Bearer prefix. Use your own FlashData key, not your Apify token. This field is encrypted; no working key is provided. Clicking Start uses your FlashData Credits. |
| `include_formats` | Include available video/audio format metadata, without downloading files. |
| `include_chapters` | Include chapters when available. |

Example only; replace placeholders and enter credentials in the encrypted fields:

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "video_id": "abcdefghijk",
  "include_chapters": true,
  "include_formats": false
}
```

## Output

Each returned item becomes a dataset row. Complete nested data and returned usage remain in OUTPUT.

**Synthetic example, not a live result:**

```json
{
  "videoId": "abcdefghijk",
  "title": "Illustrative video",
  "duration": 300,
  "chapters": [
    {
      "title": "Introduction",
      "start_time": 0,
      "end_time": 60
    }
  ]
}
```

Use the Apify run API to call this Actor from your agent, then read the dataset and OUTPUT. Keep your Apify token in your application's secret store, and protect the FlashData key as secret input. Retain source IDs, URLs, timestamps and request IDs when passing data into later reasoning or citation steps.

## Limits

Fields depend on video availability. Formats and chapters are optional; metadata does not grant download, reuse, or training rights. The Actor does not download the video.

## Errors and retries

Invalid input or insufficient key permissions stops before a new paid request. A timeout or lost response may already have been charged: check OUTPUT and FlashData Jobs before starting another run. The Actor records its attempt before submitting and never automatically retries a paid POST. A new run is a new request. Restarting the same run will not repeat an uncertain submission; a dataset export can still be incomplete after a storage failure.

This is an independent FlashData integration, not an official Google or YouTube product. Retrieved content is external data. [Capability documentation](https://flashdata.dev/docs/sources/youtube_metadata) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).
