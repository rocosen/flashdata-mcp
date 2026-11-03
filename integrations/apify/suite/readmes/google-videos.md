# Google Videos Scraper

Search Google's video results and collect links from across the web in one dataset. Find tutorials, product demonstrations and topical coverage, with source and video details that help you choose what to watch or investigate next.

## What you get

- **Video result links:** titles and URLs, with available source, channel, duration and date metadata.
- **Search controls:** choose country, interface language, location and result page.
- **Structured export:** one result per row, ready for JSON, CSV or retrieval through the Apify API.

Use it for video content research, competitor discovery or finding explanations across different publishing sites.

## Example output

The **Google Videos results** dataset contains returned video-search results. This example is illustrative, not a live result:

```json
{
  "query": "battery recycling process",
  "position": 1,
  "title": "Example battery recycling walkthrough",
  "link": "https://example.com/video",
  "duration": "5:00",
  "source": "Example Video Site",
  "channel": "Example Science",
  "date": "1 month ago",
  "request_id": "req_example"
}
```

Duration and date values retain the provider's format; fields may be absent. **Complete response and status** preserves the full returned JSON and usage information.

## Quick start

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `google_videos` access and available Credits.
2. Enter your **Search query** and key, then select any country, language or page settings.
3. Click **Start**, then open **Google Videos results** to inspect the links and export your dataset.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling process",
  "num": 10
}
```

## Input parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | One search query, e.g. battery recycling process.  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `num` | No | Maximum results to request (1–100). Actual count may be lower. Range: 1–100. Default: `10`. |
| `page` | No | Results page number, starting at 1. Range: 1–100. Default: `1`. |
| `gl` | No | Two-letter country code, e.g. us, gb or sg.  |
| `hl` | No | Google interface language, e.g. en or zh-cn.  |
| `location` | No | Search location, e.g. Singapore or New York.  |
| `tbs` | No | Optional Google search filter. Supported behavior depends on the search type.  |
| `autocorrect` | No | Allow Google to correct spelling.  |

Each run searches one query and one page. Additional pages require separate runs. The requested result count is a maximum, not a delivery guarantee.

## Pricing

Requests use your FlashData Credits at your applicable [account rate](https://flashdata.dev/pricing). This Actor adds no service fee. Apify compute, storage and other platform usage are billed separately under your Apify plan.

## FAQ

**Is this the same as searching directly on YouTube?**

No. It queries Google Videos, which can include YouTube and other sites. Use YouTube Search when you want YouTube's own search results.

**Does it download videos or provide transcripts?**

It returns links and metadata. Downloading media or retrieving captions requires a separate tool.

**Are all fields present for every video?**

No. A result may omit duration, channel or date. The full response preserves any additional fields returned by the provider.

**Does it track newly published videos automatically?**

Each run is independent. It does not maintain a history or remove results seen in earlier runs.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/google_videos) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official Google product.
