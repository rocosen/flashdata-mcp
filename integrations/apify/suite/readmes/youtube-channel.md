# YouTube Channel Scraper — $0.50/1K Requests

**$0.50 per 1,000 requests with no monthly FlashData subscription. From $0.20/1,000 on FlashData Business ($1,999/month, including 40,000 Credits). Apify usage is billed separately.**

Look up a YouTube channel by handle and collect its profile with a recent-video sample. Review what a creator has been publishing and inspect the available video statistics without building a full channel archive.

Start with one channel handle and your FlashData API key. Results are saved to an Apify dataset and a complete JSON OUTPUT record. API requests use your own FlashData account and Credits. Apify compute and storage are billed separately through Apify.

## Features

- **Channel profile:** retrieve the channel information available in the full response.
- **Recent videos:** request 1–100 video records with available titles, durations, view counts and upload dates.
- **Exportable rows:** each recent video keeps its channel context for JSON or CSV export.
- **Direct API workflow:** enter your key and inputs, then start the request without setting up a browser or proxy.

Use it for creator research, comparing recent publishing topics or selecting videos for a separate metadata or caption lookup.

## Input

| Parameter | Required | Description |
| --- | --- | --- |
| `handle` | Yes | YouTube channel handle, e.g. @Google. Use a handle, not a channel ID or URL.  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `video_limit` | No | Maximum recent videos (1–100); not the full channel history. Range: 1–100. Default: `20`. |

Replace the example handle with a real channel handle. The leading @ is optional. Full YouTube URLs and channel IDs are not accepted; use one channel per run.

### Example input and first run

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_channel` access and available Credits.
2. Enter a channel `handle`, such as `@Google`, and your key. Set `video_limit` to the number of recent videos you want.
3. Click **Start**, then open **YouTube Channel results** for videos or **Complete response and status** for the channel profile.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "handle": "@example",
  "video_limit": 20
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

One request is **one channel-handle lookup** with a recent-video sample of up to 100 requested items. The API rate is per channel request, not per returned video; actual counts can be lower.

Rates checked November 17, 2026. See [FlashData pricing](https://flashdata.dev/pricing/youtube-data) and your account for current rates. This standard-rate table excludes Extended Search. For example, 10,000 PAYG requests consume $5 of FlashData API usage, plus Apify resources. On a monthly plan, eligible usage is deducted from included Credits first.

### What you pay and where

- **FlashData API usage:** use your own [FlashData account and API key](https://flashdata.dev/app/api-keys). Requests consume that account's Credits at its applicable rate. 1 Credit = $0.05 of API usage; Credits are usage units, not request counts.
- **Monthly plans include Credits:** the monthly fee adds the shared Credits shown above. Usage covered by those Credits is not charged a second time. The same balance is shared across FlashData products; each product does not get a separate allowance.
- **Apify usage is separate:** compute, storage and other Apify platform operations use your Apify allowance or balance under your Apify plan. The FlashData API rate is not the total Apify cost. An Apify subscription does not select your FlashData plan.
- **No additional Actor service fee or proxy purchase:** this Actor adds no service fee and has no proxy input. You do not need to configure or buy an Apify Proxy for it. FlashData API usage and Apify resources still apply.

Clicking **Start** submits the request directly. Check key permissions and available Credits first. The Actor does not automatically retry an uncertain paid submission. After a timeout, inspect OUTPUT and FlashData Jobs/usage before starting a new run; the request may already have been charged.

## Output

The **YouTube Channel results** dataset contains one recent video per row. This example is illustrative, not a live result:

```json
{
  "channelHandle": "@example",
  "videoId": "abcdefghijk",
  "title": "Example recent channel upload",
  "viewCount": 1234,
  "uploadDate": "2026-01-15",
  "request_id": "req_example"
}
```

The table includes available `channelId`, `channelHandle`, `videoId`, `title`, `duration`, `viewCount` and `uploadDate`. Open **Complete response and status** for the full channel profile, returned videos and usage information.

## Send Results to Your Workflow

Store the profile and recent-video sample for creator research. Compare later samples in your own workflow; the Actor does not maintain a full history.

1. Save a Task or call this Actor with the [Apify API](https://docs.apify.com/api/v2) using the same input fields.
2. Use a run-succeeded integration or webhook to trigger your next step.
3. Read the default dataset for rows and the key-value store's **OUTPUT** record for the complete response, status and returned usage. JSON preserves nested fields; CSV is useful for flat rows.
4. Pass the selected fields to your spreadsheet, database or other application through your chosen connector or its API.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. Scheduled runs and follow-up Actor calls submit new requests and can incur further usage. See [Apify integrations](https://docs.apify.com/platform/integrations) for available methods.

## FAQ

**Does this collect the entire channel history?**

No. It requests a recent-video sample of up to 100 items. The default is 20, and the actual count can be lower.

**Where are the channel profile fields?**

The dataset table is organized around recent videos. The complete channel profile is in Complete response and status, alongside the returned video list.

**Does a missing subscriber or view count mean zero?**

No. Counts may be unavailable or omitted by the provider. Missing values should remain unknown rather than being treated as zero.

**Does it collect business emails, captions or video files?**

No. It returns channel and recent-video metadata. Those other operations are outside this Actor's scope.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Contact

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_channel) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
