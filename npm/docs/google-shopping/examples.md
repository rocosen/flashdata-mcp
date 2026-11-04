# Google Shopping: response examples


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

offers = []
for product in data.get("shopping") or []:
    product_id = product.get("productId")
    offers.append({
        "id": product.get("link") if product_id is None else product_id,
        "title": product.get("title"), "merchant": product.get("source"),
        "priceLabel": product.get("price"), "url": product.get("link"),
    })
print(json.dumps(offers, ensure_ascii=False, indent=2))
```

Selected fields from a **representative fixture**, not a live response or a guarantee that every field/result will be present. This is the content inside the CLI's `result` property:

```json
{
  "source": "google_shopping",
  "status": "done",
  "results": [
    {
      "shopping": [
        {
          "title": "wireless headphones",
          "link": "https://example.com/research",
          "snippet": "Search fixture",
          "position": 1,
          "productId": "product-1",
          "price": "$49.00",
          "source": "Example merchant"
        }
      ]
    }
  ],
  "created_at": "2026-10-12T00:00:00Z",
  "http_status": 200,
  "request_id": "fixture-request"
}
```

Currency-formatted price labels are not normalized numeric prices. This does not calculate exchange rates or guarantee stock, checkout prices or complete market coverage.


## Protocol reference

Input is limited to 256 KiB and each API response to 4 MiB. The CLI writes the complete JSON response.

MCP responses longer than 16,000 UTF-16 code units use `result_id`, `chunk` and `next_offset`. Read the remaining chunks with `get_result` in the same running server, concatenate them in order, then parse JSON. The process retains at most four results for ten minutes. The one-shot CLI has no `get_result` command because it returns the whole response.

Optional environment settings are `FLASHDATA_REQUEST_TIMEOUT_MS` (1000–120000, default 65000), `FLASHDATA_DATA_API_URL` and `FLASHDATA_MANAGEMENT_API_URL`. Custom URLs must be trusted HTTPS origins; loopback HTTP is accepted for local tests. The package does not load `.env` files automatically.
