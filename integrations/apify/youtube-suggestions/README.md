# YouTube Autocomplete Scraper

Collect the phrases YouTube suggests for a search prefix. Explore topic wording, related questions and potential content ideas, with language and region settings for the audience you are researching.

## What you get

- **Search suggestions:** one phrase per dataset row, with the original query.
- **Language and region controls:** default to English and the US, or select another supported setting.
- **Simple export:** keep the returned order and download suggestions as JSON or CSV.

Use it to build a shortlist of query ideas before running video searches or planning titles and topics.

## Example output

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

## Quick start

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

## Input parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `query` | Yes | Autocomplete prefix, e.g. battery recycling.  |
| `flashdataApiKey` | Yes | Your FlashData API key, stored as encrypted input.  |
| `language` | No | Suggestion language code, e.g. en, de or es. Default: `"en"`. |
| `region` | No | Two-letter country code, e.g. US, GB or SG. Default: `"US"`. |

Each run handles one query prefix, language and region. Use separate runs to compare different prefixes or markets. The number of suggestions depends on the provider response.

## Pricing

Requests use your FlashData Credits at your applicable [account rate](https://flashdata.dev/pricing). This Actor adds no service fee. Apify compute, storage and other platform usage are billed separately under your Apify plan.

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

## Support

Open an issue on this Actor or email [support@flashdata.dev](mailto:support@flashdata.dev) with the run URL or request ID. Do not include API keys.

[API documentation](https://flashdata.dev/docs/sources/youtube_suggestions) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy)

This is an independent FlashData integration, not an official YouTube product.
