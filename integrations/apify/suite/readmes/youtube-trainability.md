# YouTube Creative Commons License Checker

**$0.50 per 1,000 requests with no monthly FlashData subscription. From $0.20/1,000 on FlashData Business ($1,999/month, including 40,000 Credits). Apify usage is billed separately.**

Check whether a YouTube video's available metadata carries a Creative Commons license label. Record the classification for a video catalog or a separate review of the video's published license information.

Start with one video ID and your FlashData API key. Results are saved to an Apify dataset and a complete JSON OUTPUT record. API requests use your own FlashData account and Credits. Apify compute and storage are billed separately through Apify.

## Features

- **Single-video lookup:** supply an 11-character YouTube video ID.
- **Structured classification:** return the video ID and the provider's license-label result.
- **Exportable record:** view the dataset or retrieve JSON through the Apify API.
- **Direct API workflow:** enter your key and inputs, then start the request without setting up a browser or proxy.

Use it to add a license-label signal to records for videos you already know, using one video ID per run.

## Input

| Parameter | Required | Description |
| --- | --- | --- |
| `video_id` | Yes | 11-character YouTube video ID (the v= value in a watch URL).  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |

Replace the illustrative ID with the 11-character value from the video's watch URL. This Actor does not accept a full URL or search for videos by keyword.

### Example input and first run

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_trainability` access and available Credits.
2. Enter a real `video_id` and your key. The key needs access to the API capability named `youtube_trainability`.
3. Click **Start**, then open **YouTube License Metadata results** and interpret the classification using the table below.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "video_id": "abcdefghijk"
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

One request is **one video license-label lookup**. The API rate is per lookup, not a fee for granting content rights.

Rates checked November 17, 2026. See [FlashData pricing](https://flashdata.dev/pricing/youtube-data) and your account for current rates. This standard-rate table excludes Extended Search. For example, 10,000 PAYG requests consume $5 of FlashData API usage, plus Apify resources. On a monthly plan, eligible usage is deducted from included Credits first.

### What you pay and where

- **FlashData API usage:** use your own [FlashData account and API key](https://flashdata.dev/app/api-keys). Requests consume that account's Credits at its applicable rate. 1 Credit = $0.05 of API usage; Credits are usage units, not request counts.
- **Monthly plans include Credits:** the monthly fee adds the shared Credits shown above. Usage covered by those Credits is not charged a second time. The same balance is shared across FlashData products; each product does not get a separate allowance.
- **Apify usage is separate:** compute, storage and other Apify platform operations use your Apify allowance or balance under your Apify plan. The FlashData API rate is not the total Apify cost. An Apify subscription does not select your FlashData plan.
- **No additional Actor service fee or proxy purchase:** this Actor adds no service fee and has no proxy input. You do not need to configure or buy an Apify Proxy for it. FlashData API usage and Apify resources still apply.

Clicking **Start** submits the request directly. Check key permissions and available Credits first. The Actor does not automatically retry an uncertain paid submission. After a timeout, inspect OUTPUT and FlashData Jobs/usage before starting a new run; the request may already have been charged.

## Output

The **YouTube License Metadata results** dataset contains the classification record. This example is illustrative, not a live result:

```json
{
  "videoId": "abcdefghijk",
  "kind": "youtube#videoTrainability",
  "permitted": [
    "none"
  ],
  "request_id": "req_example"
}
```

**Complete response and status** contains the full returned response and usage information. The historical names `youtube_trainability` and `videoTrainability` remain in the API; they describe a license-label check here, not YouTube's creator-controlled training setting.

### Interpreting the result

| Returned value | Meaning |
| --- | --- |
| `permitted: ["all"]` | The Creative Commons label was detected in available metadata. |
| `permitted: ["none"]` | The label was not detected; this also includes missing license metadata. |

Neither value grants permission to reuse or train on the video. Check the source license and the rights relevant to your intended use separately.

## Send Results to Your Workflow

Attach the returned license-label signal to a video record for further review. Keep missing or uncertain metadata distinct from a verified permission decision.

1. Save a Task or call this Actor with the [Apify API](https://docs.apify.com/api/v2) using the same input fields.
2. Use a run-succeeded integration or webhook to trigger your next step.
3. Read the default dataset for rows and the key-value store's **OUTPUT** record for the complete response, status and returned usage. JSON preserves nested fields; CSV is useful for flat rows.
4. Pass the selected fields to your spreadsheet, database or other application through your chosen connector or its API.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. Scheduled runs and follow-up Actor calls submit new requests and can incur further usage. See [Apify integrations](https://docs.apify.com/platform/integrations) for available methods.

## FAQ

**Does this read the creator's third-party AI-training setting?**

No. It inspects license metadata only. The output field names do not imply that the creator has enabled AI training.

**Does none always mean the video uses the Standard YouTube License?**

No. It can also mean that license metadata was absent. The response should not be treated as a verified legal classification.

**Can it find all Creative Commons videos on a topic?**

This Actor checks a supplied video ID. Keyword discovery is a separate search operation.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Contact

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_trainability) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
