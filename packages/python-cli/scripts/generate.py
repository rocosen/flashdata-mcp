"""Build independent CLI distributions from one maintained runtime."""

import json
import shlex
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CAPABILITIES = json.loads((ROOT / "capabilities.json").read_text())
DESCRIPTIONS = {
    "google_search": "Search Google from the command line and get ranked titles, links, snippets and positions as JSON.",
    "google_news": "Search Google News from the command line and get headlines, publishers, article links and available dates as JSON.",
    "google_images": "Search Google Images from the command line and get image URLs, dimensions and source-page links as JSON.",
    "google_shopping": "Search Google Shopping from the command line and get product offers, merchants and displayed prices as JSON.",
    "google_videos": "Search Google Videos across websites and get video links, titles, snippets and available metadata as JSON.",
    "google_places": "Find local businesses and places with addresses, ratings, coordinates and available contact details as JSON.",
    "youtube_search": "Search YouTube from the command line and get video details as JSON, with filters and up to 20 requested results.",
    "youtube_search_extended": "Search YouTube with filters and up to 700 requested results, returning structured video details as JSON.",
    "youtube_metadata": "Get YouTube video metadata, statistics and available chapters or format details as JSON from the command line.",
    "youtube_transcript": "Retrieve existing YouTube transcripts as timestamped segments and full text in JSON; automatic captions by default.",
    "youtube_captions": "Retrieve existing YouTube captions as timestamped segments and full text in JSON; uploader captions by default.",
    "youtube_trainability": "Read YouTube Creative Commons license-label metadata as JSON by video ID; this does not grant training rights.",
    "youtube_channel": "Get YouTube channel details and recent videos as JSON by handle, with up to 100 requested videos.",
    "youtube_suggestions": "Get YouTube autocomplete search suggestions as JSON for a prefix, language and region.",
    "youtube_download": "Download YouTube video, audio or clips to your cloud storage, with command-line job tracking and JSON file details.",
}


def generate():
    from flashdata_cli import __version__
    from flashdata_cli.cli import CONTRACTS

    manifest = []
    for capability in CAPABILITIES:
        source = capability["source"]
        suffix = (
            source.replace("_", "-") if source != "youtube_download" else "youtube-cloud-storage"
        )
        name = "flashdata-" + suffix
        module = name.replace("-", "_") + "_cli"
        package = ROOT / "packages" / name
        package.mkdir(parents=True, exist_ok=True)
        shutil.copytree(
            ROOT / "src/flashdata_cli",
            package / module,
            dirs_exist_ok=True,
            ignore=shutil.ignore_patterns("__pycache__"),
        )
        (package / module / "_capability.py").write_text(
            f"SOURCE = {source!r}\nCOMMAND = {name!r}\n"
        )
        shutil.copy2(ROOT / "LICENSE", package / "LICENSE")
        schema = CONTRACTS[source].model_json_schema()
        (package / "input.schema.json").write_text(json.dumps(schema, indent=2) + "\n")
        sample = dict(capability["sample"])
        primary = next(k for k in ("query", "video_id", "handle") if k in sample)
        value = sample.pop(primary)
        command = f"uvx {name}@{__version__} --{primary.replace('_', '-')} {shlex.quote(value)}"
        if sample:
            command += " --options-json " + shlex.quote(json.dumps(sample))
        download = source == "youtube_download"
        if download:
            command = f"uvx {name}@{__version__} --operation result --job-id job_YOUR_SAVED_ID"
        options = []
        for key, value in schema["properties"].items():
            if key == primary:
                continue
            info = value.get("description", "Source-specific option; see --schema.")
            if "default" in value:
                info += f" Default: `{json.dumps(value['default'])}`."
            options.append(f"| `{key}` | {info} |")
        option_table = (
            ("| Option | Meaning |\n| --- | --- |\n" + "\n".join(options))
            if options
            else "No additional source options."
        )
        limitations = capability["limits"].replace("SDK", "CLI")
        if source == "youtube_search":
            limitations += " This CLI defaults to 10 requested results (maximum 20)."
        if source == "youtube_download":
            limitations = limitations.replace(
                "Storage is server configuration.", "Storage comes from an environment variable."
            )
        download_guide = (
            f"""
## Submit once and keep the job ID

The default operation is `status`. Status and result accept only a saved job ID,
and never submit a paid query. A pending/running response does not mean delivery is complete.

For a new delivery, supply your own authorized video and storage configuration:

```sh
uvx {name}@{__version__} --operation submit --allow-submit \\
  --video-id YOUR_VIDEO_ID \\
  --options-json '{{"download_type":"audio","output_format":"m4a"}}' \\
  --output delivery-receipt.json
```

Set `FLASHDATA_DOWNLOAD_STORAGE` through your secret manager, containing the documented
storage JSON. Never paste it into command arguments or source code. The supported providers
are s3, s3_compatible, gcs, azure, oss, bos, cos and tos. Use your own bucket/container,
optional object_prefix, and the provider-specific credentials. S3-compatible endpoints must
use HTTPS. [Storage fields and examples](https://flashdata.dev/docs/sources/youtube_download).

Keep the returned `id`. Read that same job with `--operation status --job-id ID` or
`--operation result --job-id ID`. Omit submission inputs when resuming. There is no automatic
polling or resubmission. Only the lifecycle receipt and delivery JSON are exported; media is
written by FlashData to your storage. Result JSON expires after 24 hours. Delivery manifests
can contain signed private URLs; protect the output file. Storage credentials from job params
are excluded from CLI output. Completed result reads may fetch signed JSON from the
FlashData result origin; the API key is never sent to that object URL.
"""
            if download
            else ""
        )
        google_options = (
            "Google count and locale options remain omitted unless supplied."
            if source.startswith("google_")
            else ""
        )
        input_guide = (
            "For a new delivery, use `--video-id` with `--operation submit --allow-submit`. "
            "For status or results, use only `--job-id` and omit submission fields."
            if download
            else f"Use `--{primary.replace('_', '-')}` for the primary input."
        )
        billing = (
            "Downloads are billed by delivered volume; your cloud-storage and transfer costs "
            "are separate. A submission receipt is not the final usage charge."
            if download
            else ""
        )
        output_note = "For downloads, exit 0 can describe an unfinished job." if download else ""
        readme = f"""# {capability["name"]} CLI

{DESCRIPTIONS[source]}

Uses the [FlashData {capability["name"]} API](https://flashdata.dev/docs/sources/{source}).

## Installation

Requires Python 3.10 or newer:

```sh
python -m pip install {name}=={__version__}
```

Or run it without a persistent install using [uvx](https://docs.astral.sh/uv/guides/tools/),
as in the examples below. The installed command is `{name}`.

## Quick start

Create a [FlashData API key](https://flashdata.dev/app/api-keys) with `{source}` access,
then set `FLASHDATA_API_KEY` in your environment or secret manager. API calls use your
FlashData Credits.

```sh
export FLASHDATA_API_KEY='YOUR_API_KEY'
{command} --output result.json
```

Omit `--output` to write JSON to stdout. An output file must not already exist; the CLI
checks this before making a request. API keys are read from the environment, not command flags.

## Inputs

{input_guide} Pass additional fields through
`--options-json`. Options are validated against this package's source schema. {google_options}

{option_table}

Inspect all fields, nested filters and defaults locally:

```sh
uvx {name}@{__version__} --schema
```

`--schema`, `--help` and `--version` do not require an API key or make an API call.

## Output and limits

The JSON response preserves the API envelope and available fields: {capability["outputs"]}.

{limitations}
{download_guide}
## Pricing and errors

This MIT-licensed CLI is free to install. API calls use your own
[FlashData Credits](https://flashdata.dev/pricing). {billing}

Requests are not automatically retried. A timeout can occur after a request is accepted;
check your FlashData query history before resubmitting. Each HTTP request has a 120-second
network timeout, a 15-second connect timeout and a 20-MiB response limit.

Errors go to stderr. Exit codes: `0` for exported output, `2` for local input/configuration
errors, and `1` for request/output errors. {output_note}
A partial output file is retained on failure; check the request before retrying because of
an output error. HTTP `401` indicates an API key issue, `402` insufficient Credits, and
`429` a rate or quota limit.

[API reference](https://flashdata.dev/docs/sources/{source}) ·
[Privacy policy](https://flashdata.dev/legal/privacy) ·
[Source code](https://github.com/rocosen/flashdata-mcp/tree/main/packages/python-cli)
"""
        (package / "README.md").write_text(
            "\n".join(line.rstrip() for line in readme.splitlines()) + "\n"
        )
        summary = DESCRIPTIONS[source]
        metadata = f'''[build-system]
requires = ["hatchling>=1.27,<2"]
build-backend = "hatchling.build"

[project]
name = "{name}"
version = "{__version__}"
description = {json.dumps(summary)}
readme = "README.md"
requires-python = ">=3.10"
license = "MIT"
license-files = ["LICENSE"]
authors = [{{name = "FlashData", email = "support@flashdata.dev"}}]
keywords = {json.dumps([source.replace("_", "-"), "cli", "json", "uvx", "flashdata"])}
classifiers = ["Intended Audience :: Developers", "Programming Language :: Python :: 3", "Environment :: Console"]
dependencies = ["httpx>=0.28.1,<1", "pydantic>=2.7.4,<3", "jsonschema>=4.23,<5"]

[project.scripts]
{name} = "{module}.cli:main"

[project.urls]
Homepage = "https://flashdata.dev/docs/sources/{source}"
Documentation = "https://flashdata.dev/docs/sources/{source}"
Pricing = "https://flashdata.dev/pricing"
Support = "https://flashdata.dev"
Source = "https://github.com/rocosen/flashdata-mcp/tree/main/packages/python-cli"

[tool.hatch.build.targets.wheel]
packages = ["{module}"]
'''
        (package / "pyproject.toml").write_text(metadata)
        manifest.append(
            {
                "source": source,
                "project": name,
                "command": name,
                "module": module,
                "version": __version__,
                "pypi_url": f"https://pypi.org/project/{name}/",
            }
        )
    (ROOT / "packages.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Generated {len(manifest)} independent distributions.")


if __name__ == "__main__":
    generate()
