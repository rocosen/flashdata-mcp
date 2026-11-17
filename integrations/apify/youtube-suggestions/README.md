# YouTube Autocomplete Scraper — Keyword Suggestions

**$0.50 per 1,000 requests with no monthly FlashData subscription. From $0.20/1,000 on FlashData Business ($1,999/month, including 40,000 Credits). Apify usage is billed separately.**

Collect the phrases YouTube suggests for a search prefix. Explore topic wording, related questions and potential content ideas, with language and region settings for the audience you are researching.

Start with one query and your FlashData API key. Results are saved to an Apify dataset and a complete JSON OUTPUT record. API requests use your own FlashData account and Credits. Apify compute and storage are billed separately through Apify.

## Features

- **Search suggestions:** one phrase per dataset row, with the original query.
- **Language and region controls:** default to English and the US, or select another supported setting.
- **Simple export:** keep the returned order and download suggestions as JSON or CSV.
- **Direct API workflow:** enter your key and inputs, then start the request without setting up a browser or proxy.

Use it to build a shortlist of query ideas before running video searches or planning titles and topics.

## Input

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | Autocomplete prefix, e.g. battery recycling.  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `language` | No | Suggestion language code, e.g. en, de or es. Default: `"en"`. |
| `region` | No | Two-letter country code, e.g. US, GB or SG. Default: `"US"`. |

Each run handles one query prefix, language and region. Use separate runs to compare different prefixes or markets. The number of suggestions depends on the provider response.

### Example input and first run

1. Get a [FlashData API key](https://flashdata.dev/app/api-keys) with `youtube_suggestions` access and available Credits.
2. Enter a keyword or partial query and your key. Choose a language and two-letter region code if needed.
3. Click **Start**, then open **YouTube Autocomplete results** to review and export the suggestions.

```json
{
  "flashdataApiKey": "YOUR_FLASHDATA_API_KEY",
  "query": "battery recycling",
  "language": "en",
  "region": "US"
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

One request is **one query prefix, language and region**. The API rate is per request, not per suggestion. The provider can return fewer phrases or an empty list.

Rates checked November 17, 2026. See [FlashData pricing](https://flashdata.dev/pricing/youtube-data) and your account for current rates. This standard-rate table excludes Extended Search. For example, 10,000 PAYG requests consume $5 of FlashData API usage, plus Apify resources. On a monthly plan, eligible usage is deducted from included Credits first.

### What you pay and where

- **FlashData API usage:** use your own [FlashData account and API key](https://flashdata.dev/app/api-keys). Requests consume that account's Credits at its applicable rate. 1 Credit = $0.05 of API usage; Credits are usage units, not request counts.
- **Monthly plans include Credits:** the monthly fee adds the shared Credits shown above. Usage covered by those Credits is not charged a second time. The same balance is shared across FlashData products; each product does not get a separate allowance.
- **Apify usage is separate:** compute, storage and other Apify platform operations use your Apify allowance or balance under your Apify plan. The FlashData API rate is not the total Apify cost. An Apify subscription does not select your FlashData plan.
- **No additional Actor service fee or proxy purchase:** this Actor adds no service fee and has no proxy input. You do not need to configure or buy an Apify Proxy for it. FlashData API usage and Apify resources still apply.

Clicking **Start** submits the request directly. Check key permissions and available Credits first. The Actor does not automatically retry an uncertain paid submission. After a timeout, inspect OUTPUT and FlashData Jobs/usage before starting a new run; the request may already have been charged.

## Output

The **YouTube Autocomplete results** dataset contains one suggestion per row. This example is illustrative, not a live result:

```json
{
  "query": "battery recycling",
  "position": 1,
  "suggestion": "battery recycling explained",
  "request_id": "req_example"
}
```

`position` is the suggestion's order in this response, starting at 1. It is not a search-volume or popularity score. **Complete response and status** contains the full response and usage information.

## Send Results to Your Workflow

Save phrases by prefix, language and region, then send selected phrases to a YouTube search Actor. Searches are separate requests and are not submitted automatically.

1. Save a Task or call this Actor with the [Apify API](https://docs.apify.com/api/v2) using the same input fields.
2. Use a run-succeeded integration or webhook to trigger your next step.
3. Read the default dataset for rows and the key-value store's **OUTPUT** record for the complete response, status and returned usage. JSON preserves nested fields; CSV is useful for flat rows.
4. Pass the selected fields to your spreadsheet, database or other application through your chosen connector or its API.

Connections are configured in Apify or your own workflow; this Actor has no destination connector input. Scheduled runs and follow-up Actor calls submit new requests and can incur further usage. See [Apify integrations](https://docs.apify.com/platform/integrations) for available methods.

## FAQ

**Does it return search volume or keyword difficulty?**

No. Autocomplete provides phrases, not measured search volume, competition or predicted traffic.

**Does it return videos for these phrases?**

No. Use a YouTube search Actor with a selected suggestion to retrieve video results.

**Does it expand every suggestion or add a–z modifiers automatically?**

No. It sends the prefix you provide once. Additional prefixes require separate runs.

**Why is the dataset empty?**

Some prefixes have no suggestions for the selected language or region. An empty suggestion list is a valid result; check Complete response and status to distinguish it from an error.

**What if a run fails?**

Check key permissions and Credits for authentication errors. After a timeout or interruption, inspect **Complete response and status** and FlashData Jobs/usage before starting again: the request may already have been charged. A new run can create another charge.

## Contact

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_suggestions) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
