"""Check the built wheel in a fresh environment without service requests."""

import subprocess
import tempfile
from pathlib import Path

package = Path(__file__).resolve().parents[1]
wheels = list((package / "dist").glob("*.whl"))
assert len(wheels) == 1
probe = r"""
import importlib.metadata
import socket

def blocked(*args, **kwargs):
    raise AssertionError("Network disabled during installed-package verification")

socket.getaddrinfo = blocked
socket.socket.connect = blocked

from pydantic_ai import Agent, DeferredToolRequests
from pydantic_ai_flashdata import FlashData, QUERY_SOURCES

assert importlib.metadata.version("pydantic-ai-flashdata") == "0.1.0"
assert len(QUERY_SOURCES) == 14
assert "youtube_download" not in QUERY_SOURCES
agent = Agent.from_spec(
    {"model": "test", "capabilities": [{"FlashData": {"sources": ["google_search"]}}]},
    custom_capability_types=[FlashData],
    output_type=[str, DeferredToolRequests],
)
assert agent is not None
assert "site-packages" in __import__("pydantic_ai_flashdata").__file__
print("Fresh wheel: imports and agent spec registration passed without network")
"""
with tempfile.TemporaryDirectory(prefix="flashdata-pydantic-wheel-") as tmp:
    environment = Path(tmp) / "venv"
    subprocess.run(["uv", "venv", str(environment)], check=True)
    python = environment / ("Scripts/python.exe" if __import__("os").name == "nt" else "bin/python")
    subprocess.run(["uv", "pip", "install", "--python", str(python), str(wheels[0])], check=True)
    subprocess.run([str(python), "-c", probe], cwd=tmp, check=True)
