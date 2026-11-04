# YouTube Metadata: response examples


The CLI returns `{"ok":true,"tool":"...","result":...}`. Check `ok` and the API/job status before consuming data. Use Python **3.10 or newer**; only the standard library is needed. Save this as `process-result.py` beside `result.json` and run `python3 process-result.py` (Windows: `py -3 process-result.py`). The script reads the saved CLI response; it makes no API call. Missing optional fields in JSON summaries are represented as `null`:

```python
import json
from pathlib import Path

response = json.loads(Path("result.json").read_text(encoding="utf-8"))
if not response.get("ok"):
    raise SystemExit("The request failed; inspect the response before retrying.")
result = response["result"]
if "job" in result:
    status = result["job"]["status"]
    if status != "completed":
        raise SystemExit(f"Job status: {status}. Inspect this job; do not resubmit.")
    result = result["output"]
if result.get("status") not in (None, "done"):
    raise SystemExit("No completed data yet. Read the existing job before processing.")
if not result.get("results"):
    raise SystemExit("No result record was returned.")
data = result["results"][0]

import math

chapters = [{
    "title": chapter.get("title"), "start": chapter["start_time"],
    "end": chapter.get("end_time"),
    "url": (f"https://www.youtube.com/watch?v={data['videoId']}"
            f"&t={math.floor(chapter['start_time'])}s"),
} for chapter in data.get("chapters") or []]
print(json.dumps(chapters, ensure_ascii=False, indent=2))
```

Selected fields from a **representative fixture**, not a live response or a guarantee that every field/result will be present. This is the content inside the CLI's `result` property:

```json
{
  "source": "youtube_metadata",
  "status": "done",
  "results": [
    {
      "videoId": "dQw4w9WgXcQ",
      "title": "Example video",
      "channel": "Example",
      "channelId": "channel-one",
      "channelUrl": "https://www.youtube.com/@Example",
      "viewCount": 100,
      "duration": 90,
      "chapters": [
        {
          "title": "Introduction",
          "start_time": 0,
          "end_time": 30
        }
      ],
      "description": "Example description"
    }
  ],
  "created_at": "2026-10-12T00:00:00Z",
  "http_status": 200,
  "request_id": "fixture-request"
}
```

Fields and chapters may be absent. Metadata does not include a transcript; transcript retrieval is a separate paid call.


## Protocol reference

Input is limited to 256 KiB and each API response to 4 MiB. The CLI writes the complete JSON response.

MCP responses longer than 16,000 UTF-16 code units use `result_id`, `chunk` and `next_offset`. Read the remaining chunks with `get_result` in the same running server, concatenate them in order, then parse JSON. The process retains at most four results for ten minutes. The one-shot CLI has no `get_result` command because it returns the whole response.

Optional environment settings are `FLASHDATA_REQUEST_TIMEOUT_MS` (1000–120000, default 65000), `FLASHDATA_DATA_API_URL` and `FLASHDATA_MANAGEMENT_API_URL`. Custom URLs must be trusted HTTPS origins; loopback HTTP is accepted for local tests. The package does not load `.env` files automatically.
