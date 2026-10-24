# Fifteen FlashData workflows

One independent capability package maps these 15 tasks. Fourteen query capabilities use MCP; media delivery runs separately through the protected local CLI. The linked service guides also cover standalone CLIs; this Python package uses MCP for the fourteen queries. This is not 15 independent directory entries. Inputs below are examples, not authorization to spend Credits. Review the current source schema and pricing before submitting.

## google_search

Search Google for ranked web pages, titles, URLs and snippets. Build localized SERP snapshots for research and comparison. CLI and MCP via the paid FlashData API.

Example task: Search Google for battery recycling research in the US, in English. Make one request for 10 results and return a table of position, title, source URL and snippet.

```json
{
  "query": "battery recycling research",
  "gl": "us",
  "hl": "en",
  "num": 10
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/google-search/README.md) · [Official source contract](https://flashdata.dev/docs/sources/google_search?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_search-task).

## google_news

Search Google News for articles, publishers, date labels and source links. Turn a topic into a traceable news briefing. CLI and MCP via the paid FlashData API.

Example task: Find Google News coverage of battery recycling. Make one request for 10 articles, group them by publisher, and preserve each original date label and article link.

```json
{
  "query": "battery recycling",
  "gl": "us",
  "hl": "en",
  "num": 10
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/google-news/README.md) · [Official source contract](https://flashdata.dev/docs/sources/google_news?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_news-task).

## google_images

Find Google Images results with image URLs, dimensions and original source pages. Build an attributable image research inventory. CLI and MCP via the paid FlashData API.

Example task: Find 20 Google Images results for solar panel diagrams. Keep images with a returned width of at least 1000 pixels, and list each image URL, source page and dimensions.

```json
{
  "query": "solar panel diagram",
  "num": 20
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/google-images/README.md) · [Official source contract](https://flashdata.dev/docs/sources/google_images?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_images-task).

## google_shopping

Search Google Shopping for products, merchants and price labels. Collect comparable offer snapshots with product IDs and source links. CLI and MCP via the paid FlashData API.

Example task: Search Google Shopping once for wireless headphones in the US. Return 10 requested offers with product identifiers, merchant names, original price labels and source URLs.

```json
{
  "query": "wireless headphones",
  "gl": "us",
  "hl": "en",
  "num": 10
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/google-shopping/README.md) · [Official source contract](https://flashdata.dev/docs/sources/google_shopping?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_shopping-task).

## google_videos

Search Google Videos across websites. Retrieve video titles, links, sources and available durations for a cross-site video inventory. CLI and MCP via the paid FlashData API.

Example task: Search Google Videos once for battery recycling process demonstrations. Request 10 results and group the returned titles, URLs and available durations by website.

```json
{
  "query": "battery recycling process",
  "num": 10
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/google-video-search/README.md) · [Official source contract](https://flashdata.dev/docs/sources/google_videos?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_videos-task).

## google_places

Search for local businesses and places with addresses, available ratings and review counts. Build location-specific research shortlists. CLI and MCP via the paid FlashData API.

Example task: Search once for coffee shops in Singapore. Request 20 places, then make a shortlist from returned ratings of at least 4.2 and at least 20 reviews, keeping the addresses.

```json
{
  "query": "coffee shops in Singapore",
  "num": 20
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/google-places/README.md) · [Official source contract](https://flashdata.dev/docs/sources/google_places?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_places-task).

## youtube_search

Search YouTube videos by keyword with date, duration, feature and sorting filters. Return video IDs, channels and available statistics. CLI and MCP via the paid FlashData API.

Example task: Find 10 YouTube videos about battery recycling with one standard search. Return the video IDs, watch URLs, channels and available durations.

```json
{
  "query": "battery recycling",
  "max_results": 10
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/youtube-search/README.md) · [Official source contract](https://flashdata.dev/docs/sources/youtube_search?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search-task).

## youtube_search_extended

Search larger YouTube video result sets, with up to 700 requested results. Map recurring channels and topics from structured video records. CLI and MCP via the paid FlashData API.

Example task: Run one extended YouTube search for battery recycling with 100 requested results. Count the returned videos by channel and state the actual sample size.

```json
{
  "query": "battery recycling",
  "max_results": 100
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/youtube-extended-search/README.md) · [Official source contract](https://flashdata.dev/docs/sources/youtube_search_extended?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search_extended-task).

## youtube_metadata

Read YouTube video details, descriptions, statistics and available chapters. Inspect formats or prepare timestamped chapter navigation. CLI and MCP via the paid FlashData API.

Example task: Read metadata for YouTube video dQw4w9WgXcQ once, including chapters but excluding formats. Turn any returned chapter boundaries into timestamped navigation links.

```json
{
  "video_id": "dQw4w9WgXcQ",
  "include_formats": false,
  "include_chapters": true
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/youtube-metadata/README.md) · [Official source contract](https://flashdata.dev/docs/sources/youtube_metadata?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_metadata-task).

## youtube_transcript

Retrieve available YouTube transcript text with start and end timestamps. Build cited summaries, searchable notes and transcript exports. CLI and MCP via the paid FlashData API.

Example task: Retrieve the existing English automatic transcript for YouTube video dQw4w9WgXcQ once. Produce notes with timestamped citations; report a missing track without transcribing or switching tracks.

```json
{
  "video_id": "dQw4w9WgXcQ",
  "language": "en",
  "auto": true
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/youtube-transcript/README.md) · [Official source contract](https://flashdata.dev/docs/sources/youtube_transcript?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_transcript-task).

## youtube_captions

Retrieve YouTube uploader captions with timed segments. Prepare subtitle exports and inspect the language and caption-track type. CLI and MCP via the paid FlashData API.

Example task: Retrieve the English uploader captions for YouTube video dQw4w9WgXcQ once, with auto=false. Convert the returned timed segments to SRT locally; report a missing track without substituting another.

```json
{
  "video_id": "dQw4w9WgXcQ",
  "language": "en",
  "auto": false
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/youtube-captions/README.md) · [Official source contract](https://flashdata.dev/docs/sources/youtube_captions?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_captions-task).

## youtube_trainability

Inspect a YouTube video’s Creative Commons license classification. Record the returned license-label signal for a separate rights review. CLI and MCP via the paid FlashData API.

Example task: Inspect the license-label classification for YouTube video dQw4w9WgXcQ with one request. Record the raw permitted field beside the video ID, without treating it as training authorization.

```json
{
  "video_id": "dQw4w9WgXcQ"
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/youtube-trainability/README.md) · [Official source contract](https://flashdata.dev/docs/sources/youtube_trainability?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_trainability-task).

## youtube_channel

Read a YouTube channel profile and recent videos by handle. Capture channel identifiers and a bounded recent-upload inventory. CLI and MCP via the paid FlashData API.

Example task: Read the @jawed channel profile and request 10 recent videos once. Save the channel ID and returned video IDs, titles and available view counts as a dated snapshot.

```json
{
  "handle": "@jawed",
  "video_limit": 10
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/youtube-channel/README.md) · [Official source contract](https://flashdata.dev/docs/sources/youtube_channel?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_channel-task).

## youtube_suggestions

Get YouTube search suggestions for a query prefix, language and region. Build keyword idea sheets from actual autocomplete phrases. CLI and MCP via the paid FlashData API.

Example task: Get YouTube autocomplete suggestions for battery recycling in English and the US with one request. Return unique phrases while preserving the query and locale; do not estimate search volume.

```json
{
  "query": "battery recycling",
  "language": "en",
  "region": "US"
}
```

Read the current MCP schema and source price, show this request to the user and handle Pydantic AI deferred approval. After an approved call, retain source links and identifiers. If a job is returned, read that existing job and any result chunks; do not resubmit to poll.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/youtube-autocomplete/README.md) · [Official source contract](https://flashdata.dev/docs/sources/youtube_suggestions?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_suggestions-task).

## youtube_download

Deliver YouTube video, audio or clips to your own S3 or other supported cloud storage. Track asynchronous delivery and its output manifest. Protected local CLI via the paid FlashData API; this capability does not expose a download tool.

Example task: Prepare a 10-second MP4 delivery of YouTube video jNQXAC9IVRw to my own S3 bucket. First confirm the destination, credentials, rights and byte-based cost approval. After I approve, submit once, retain the job ID, and inspect the completed delivery manifest. Never retry the paid submission automatically.

```json
{
  "video_id": "jNQXAC9IVRw",
  "mode": "async",
  "download_type": "audio_video",
  "video_quality": "<=720",
  "output_format": "mp4",
  "start_at": "00:00:00",
  "end_at": "00:00:10",
  "storage": {
    "storage_type": "s3",
    "storage_url": "your-media-bucket",
    "access_key": "YOUR_ACCESS_KEY",
    "secret_key": "YOUR_SECRET_KEY",
    "region": "us-east-1",
    "object_prefix": "flashdata-clips"
  }
}
```

Run the fixed published `@flashdata-dev/youtube-cloud-storage@0.1.1` CLI in your own terminal with Node.js 22.18+. Use its protected request-file or stdin workflow, not agent chat. The values above are nonfunctional placeholders. Review the per-TB rate and authorize storage/byte costs before submission. Retain the returned job ID, read status, and save the final storage manifest locally. Never automatically repeat a timed-out paid submission.

[Detailed input/output and processing guide](https://github.com/rocosen/flashdata-mcp/blob/8e7f5cb6641f76e78a3db73ba0fe8c992aa5d5c9/npm/docs/youtube-cloud-storage/README.md) · [Official source contract](https://flashdata.dev/docs/sources/youtube_download?utm_source=pydantic-ai&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_download-task).
