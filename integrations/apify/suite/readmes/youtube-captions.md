# YouTube Subtitles Scraper — Manual & Auto Captions

**$0.50 per 1,000 requests with no monthly FlashData subscription. From $0.20/1,000 on FlashData Business ($1,999/month, including 40,000 Credits). Apify usage is billed separately.**

Retrieve an existing uploader-provided YouTube subtitle track as structured text. Keep the segment timestamps and language information so you can review quotations, search within a video or work with a published caption track.

Start with one video ID and your FlashData API key. Results are saved to an Apify dataset and a complete JSON OUTPUT record. API requests use your own FlashData account and Credits. Apify compute and storage are billed separately through Apify.

## Features

- **Published subtitle tracks:** select an existing caption language for one video.
- **Timestamped text:** start, end and text per row, with video ID, language and automatic-caption status.
- **Full text and exports:** review segment rows as JSON or CSV and retrieve fullText from the complete response.
- **Direct API workflow:** enter your key and inputs, then start the request without setting up a browser or proxy.

Use it to collect subtitles for video research, prepare a transcript archive or review captions in an available language.

## Input

| Parameter | Required | Description |
| --- | --- | --- |
| `video_id` | Yes | 11-character YouTube video ID (the v= value in a watch URL).  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `language` | No | Existing caption language, e.g. en, de or es. No translation. Default: `"en"`. |
| `auto` | No | true selects automatic captions; false selects uploader captions. No fallback. Default: `false`. |

The example video_id is a placeholder. Each run selects one video, one language and one caption type. `auto=true` explicitly selects an automatic track; it does not mean 'try manual first, then automatic'.

### Example input and first run

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_captions` access and available Credits.
2. Enter a real 11-character video ID and your key. Select a language; leave `auto=false` to request uploader-provided captions.
3. Click **Start**, then open **YouTube Uploader Captions results** for segment rows or **Complete response and status** for fullText.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "video_id": "abcdefghijk",
  "language": "en",
  "auto": false
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

One request selects **one video, one subtitle language and one caption type**. The API rate is per request, not per segment or minute. It reads an existing track; it does not create subtitles.

Rates checked November 17, 2026. See [FlashData pricing](https://flashdata.dev/pricing/youtube-data) and your account for current rates. This standard-rate table excludes Extended Search. For example, 10,000 PAYG requests consume $5 of FlashData API usage, plus Apify resources. On a monthly plan, eligible usage is deducted from included Credits first.

### What you pay and where

- **FlashData API usage:** use your own [FlashData account and API key](https://flashdata.dev/app/api-keys). Requests consume that account's Credits at its applicable rate. 1 Credit = $0.05 of API usage; Credits are usage units, not request counts.
- **Monthly plans include Credits:** the monthly fee adds the shared Credits shown above. Usage covered by those Credits is not charged a second time. The same balance is shared across FlashData products; each product does not get a separate allowance.
- **Apify usage is separate:** compute, storage and other Apify platform operations use your Apify allowance or balance under your Apify plan. The FlashData API rate is not the total Apify cost. An Apify subscription does not select your FlashData plan.
- **No additional Actor service fee or proxy purchase:** this Actor adds no service fee and has no proxy input. You do not need to configure or buy an Apify Proxy for it. FlashData API usage and Apify resources still apply.

Clicking **Start** submits the request directly. Check key permissions and available Credits first. The Actor does not automatically retry an uncertain paid submission. After a timeout, inspect OUTPUT and FlashData Jobs/usage before starting a new run; the request may already have been charged.

## Output

The **YouTube Uploader Captions results** dataset contains one subtitle segment per row. This example is illustrative, not a live result:

```json
{
  "videoId": "abcdefghijk",
  "languageCode": "en",
  "isAutoGenerated": false,
  "start": 0,
  "end": 3.2,
  "text": "This is an illustrative uploader subtitle.",
  "request_id": "req_example"
}
```

Start and end are timestamps in seconds. **Complete response and status** includes `fullText`, returned track metadata and usage information.

## Send Results to Your Workflow

Archive fullText with the selected language and caption type, or convert the segment timestamps to a subtitle file in your own workflow.

1. Save a Task or call this Actor with the [Apify API](https://docs.apify.com/api/v2) using the same input fields.
2. Use a run-succeeded integration or webhook to trigger your next step.
3. Read the default dataset for rows and the key-value store's **OUTPUT** record for the complete response, status and returned usage. JSON preserves nested fields; CSV is useful for flat rows.
4. Pass the selected fields to your spreadsheet, database or other application through your chosen connector or its API.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. Scheduled runs and follow-up Actor calls submit new requests and can incur further usage. See [Apify integrations](https://docs.apify.com/platform/integrations) for available methods.

## FAQ

**How is this different from YouTube Transcript Scraper?**

The default here is uploader-provided captions (`auto=false`). The Transcript Actor defaults to automatic captions (`auto=true`). Both read existing tracks; neither generates speech-to-text.

**Will it fall back to automatic captions when subtitles are missing?**

No. A missing selected track can cause an unavailable result. To request automatic captions, explicitly select auto=true in a separate run.

**Can I translate subtitles into another language?**

The language setting selects an existing track. It does not translate subtitles or create a new language track.

**Can I download an SRT or VTT file?**

The Actor returns structured text and timestamps in JSON or CSV. Creating an SRT or VTT file requires a separate conversion step.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Contact

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_captions) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
