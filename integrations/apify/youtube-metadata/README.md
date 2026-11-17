# YouTube Video Metadata Scraper — $0.50/1K Requests

**$0.50 per 1,000 requests with no monthly FlashData subscription. From $0.20/1,000 on FlashData Business ($1,999/month, including 40,000 Credits). Apify usage is billed separately.**

Look up a YouTube video and collect its details in structured JSON. Review the title, channel, duration and viewing statistics, with options to include available chapters and media format information.

Start with one video ID and your FlashData API key. Results are saved to an Apify dataset and a complete JSON OUTPUT record. API requests use your own FlashData account and Credits. Apify compute and storage are billed separately through Apify.

## Features

- **Video details:** available title, channel, duration, view count and live-status metadata.
- **Chapter information:** include available chapter titles and timestamps.
- **Format information:** include available audio/video format metadata without downloading the media.
- **Direct API workflow:** enter your key and inputs, then start the request without setting up a browser or proxy.

Use it to inspect a video before further processing, organize a video catalog or locate sections using available chapter timestamps.

## Input

| Parameter | Required | Description |
| --- | --- | --- |
| `video_id` | Yes | 11-character YouTube video ID (the v= value in a watch URL).  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `include_formats` | No | Include available video/audio format metadata, without downloading files. Default: `true`. |
| `include_chapters` | No | Include chapters when available. Default: `true`. |

Replace the illustrative video_id with a real video ID, such as the value after `v=` in a YouTube watch URL. This Actor accepts one ID per run, not a full URL or a list. Both include_chapters and include_formats default to true; set either to false to omit that optional request.

### Example input and first run

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_metadata` access and available Credits.
2. Enter the video's 11-character `video_id` and your key. Select whether to include chapters and format metadata.
3. Click **Start**, then open **YouTube Metadata results** for the record or **Complete response and status** for nested details.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "video_id": "abcdefghijk",
  "include_chapters": true,
  "include_formats": false
}
```

## Pricing

All prices below are in USD.

**Pay as you go: $0.50/1,000 requests, with no monthly FlashData subscription.** Lower API rates apply to FlashData monthly plans; these are FlashData plans, independent of your Apify subscription.

| FlashData plan | Monthly fee | Included Credits | API rate per 1,000 requests |
| --- | --- | --- | --- |
| Pay as you go | $0 | 0 | $0.50 |
| Micro | $49 | 1,000 | $0.40 |
| Starter | $199 | 4,000 | $0.35 |
| Pro | $499 | 10,000 | $0.30 |
| Scale | $999 | 20,000 | $0.25 |
| Business | $1,999 | 40,000 | $0.20 |

One request is **one video metadata lookup**. Chapter and format flags select optional information for that lookup; this does not download the media.

Rates checked November 17, 2026. See [FlashData pricing](https://flashdata.dev/pricing/youtube-data) and your account for current rates. This standard-rate table excludes Extended Search. For example, 10,000 PAYG requests consume $5 of FlashData API usage, plus Apify resources. On a monthly plan, eligible usage is deducted from included Credits first.

### What you pay and where

- **FlashData API usage:** use your own [FlashData account and API key](https://flashdata.dev/app/api-keys). Requests consume that account's Credits at its applicable rate. 1 Credit = $0.05 of API usage; Credits are usage units, not request counts.
- **Monthly plans include Credits:** the monthly fee adds the shared Credits shown above. Usage covered by those Credits is not charged a second time. The same balance is shared across FlashData products; each product does not get a separate allowance.
- **Apify usage is separate:** compute, storage and other Apify platform operations use your Apify allowance or balance under your Apify plan. The FlashData API rate is not the total Apify cost. An Apify subscription does not select your FlashData plan.
- **No additional Actor service fee or proxy purchase:** this Actor adds no service fee and has no proxy input. You do not need to configure or buy an Apify Proxy for it. FlashData API usage and Apify resources still apply.

Clicking **Start** submits the request directly. Check key permissions and available Credits first. The Actor does not automatically retry an uncertain paid submission. After a timeout, inspect OUTPUT and FlashData Jobs/usage before starting a new run; the request may already have been charged.

## Output

The **YouTube Metadata results** dataset contains the returned video record. The table highlights basic fields; nested details are available in JSON. This example is illustrative, not a live result:

```json
{
  "videoId": "abcdefghijk",
  "title": "Example battery recycling walkthrough",
  "channel": "Example Science",
  "duration": 300,
  "viewCount": 1234,
  "isLive": false,
  "chapters": [
    {
      "title": "Introduction",
      "start_time": 0,
      "end_time": 60
    }
  ],
  "request_id": "req_example"
}
```

**Complete response and status** contains the full response, including returned chapter and format arrays and usage information. Field availability varies by video.

## Send Results to Your Workflow

Add video records to a media catalog, or use available chapter timestamps to locate relevant sections. Keep nested chapter and format arrays from OUTPUT.

1. Save a Task or call this Actor with the [Apify API](https://docs.apify.com/api/v2) using the same input fields.
2. Use a run-succeeded integration or webhook to trigger your next step.
3. Read the default dataset for rows and the key-value store's **OUTPUT** record for the complete response, status and returned usage. JSON preserves nested fields; CSV is useful for flat rows.
4. Pass the selected fields to your spreadsheet, database or other application through your chosen connector or its API.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. Scheduled runs and follow-up Actor calls submit new requests and can incur further usage. See [Apify integrations](https://docs.apify.com/platform/integrations) for available methods.

## FAQ

**Does include_formats download video or audio?**

No. It requests format information only. Downloading media is a separate operation.

**Why are there no chapters?**

Not every video has chapters, and availability depends on the returned metadata. Enabling include_chapters does not generate chapters.

**Does this include the transcript?**

No. Use the dedicated transcript or captions Actor to retrieve an existing caption track.

**Can it read private or unavailable videos?**

Metadata depends on what the service can access. Private, removed, restricted or otherwise unavailable videos may fail or return limited information.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Contact

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_metadata) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
