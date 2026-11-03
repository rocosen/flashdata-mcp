# YouTube Video License Checker

Check whether a YouTube video's available metadata carries a Creative Commons license label. Record the classification for a video catalog or a separate review of the video's published license information.

## What you get

- **Single-video lookup:** supply an 11-character YouTube video ID.
- **Structured classification:** return the video ID and the provider's license-label result.
- **Exportable record:** view the dataset or retrieve JSON through the Apify API.

Use it to add a license-label signal to records for videos you already know, using one video ID per run.

## Example output

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

## Quick start

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_trainability` access and available Credits.
2. Enter a real `video_id` and your key. The key needs access to the API capability named `youtube_trainability`.
3. Click **Start**, then open **YouTube License Metadata results** and interpret the classification using the table below.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "video_id": "abcdefghijk"
}
```

## Input parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `video_id` | Yes | 11-character YouTube video ID (the v= value in a watch URL).  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |

Replace the illustrative ID with the 11-character value from the video's watch URL. This Actor does not accept a full URL or search for videos by keyword.

## Interpreting the result

| Returned value | Meaning |
| --- | --- |
| `permitted: ["all"]` | The Creative Commons label was detected in available metadata. |
| `permitted: ["none"]` | The label was not detected; this also includes missing license metadata. |

Neither value grants permission to reuse or train on the video. Check the source license and the rights relevant to your intended use separately.

## Pricing

Requests use your FlashData Credits at your applicable [account rate](https://flashdata.dev/pricing). This Actor adds no service fee. Apify compute, storage and other platform usage are billed separately under your Apify plan.

## FAQ

**Does this read the creator's third-party AI-training setting?**

No. It inspects license metadata only. The output field names do not imply that the creator has enabled AI training.

**Does none always mean the video uses the Standard YouTube License?**

No. It can also mean that license metadata was absent. The response should not be treated as a verified legal classification.

**Can it find all Creative Commons videos on a topic?**

This Actor checks a supplied video ID. Keyword discovery is a separate search operation.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_trainability) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
