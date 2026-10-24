"""Run locally from the repository root: python -m integrations.anthropic.research."""

import asyncio
import json
import os

from anthropic import AsyncAnthropic, DefaultAsyncHttpxClient

from integrations.python_tools import SYSTEM_PROMPT, ResearchTools


async def research(client, bridge, model, question, *, max_turns=8):
    tools = await bridge.catalog()
    messages = [{"role": "user", "content": question}]
    for _ in range(max_turns):
        response = await client.messages.create(
            model=model,
            system=SYSTEM_PROMPT,
            tools=tools,
            messages=messages,
            max_tokens=1800,
        )
        messages.append({"role": "assistant", "content": response.content})
        if response.stop_reason == "end_turn":
            return "\n".join(b.text for b in response.content if b.type == "text")
        if response.stop_reason != "tool_use":
            return "Model response incomplete or stopped. No partial tool requests were executed."
        results = []
        for block in response.content:
            if block.type != "tool_use":
                continue
            result = await bridge.execute(block.id, block.name, block.input)
            results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(result, ensure_ascii=False),
                    "is_error": "error" in result,
                }
            )
        # All results immediately follow the assistant message, ahead of any user text.
        messages.append({"role": "user", "content": results})
    return "Turn limit reached. Inspect existing jobs before starting another session."


async def main():
    required = ("ANTHROPIC_API_KEY", "ANTHROPIC_MODEL", "FLASHDATA_API_KEY")
    if any(not os.environ.get(name) for name in required):
        print("Set ANTHROPIC_API_KEY, ANTHROPIC_MODEL and FLASHDATA_API_KEY securely.")
        return 2
    question = input("Research question (no secrets): ")
    if (
        input("Running this agent incurs model fees. Continue? [y/N] ").strip().lower()
        != "y"
    ):
        return 0
    try:
        async with AsyncAnthropic(
            api_key=os.environ["ANTHROPIC_API_KEY"],
            max_retries=0,
            timeout=120,
            http_client=DefaultAsyncHttpxClient(
                follow_redirects=False, trust_env=False
            ),
        ) as client:
            print(
                await research(
                    client,
                    ResearchTools(os.environ["FLASHDATA_API_KEY"]),
                    os.environ["ANTHROPIC_MODEL"],
                    question,
                )
            )
    except Exception:  # noqa: BLE001 - Do not expose credential-bearing transport errors.
        print(
            "Session stopped. Check model usage and FlashData Jobs before retrying; no automatic retry."
        )
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
