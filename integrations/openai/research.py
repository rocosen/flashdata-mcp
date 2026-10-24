"""Run locally from the repository root: python -m integrations.openai.research."""

import asyncio
import json
import os

from openai import AsyncOpenAI, DefaultAsyncHttpxClient

from integrations.python_tools import SYSTEM_PROMPT, ResearchTools


async def research(client, bridge, model, question, *, max_turns=8):
    tools = [
        {
            "type": "function",
            "name": t["name"],
            "description": t["description"],
            "parameters": t["input_schema"],
            "strict": False,
        }
        for t in await bridge.catalog()
    ]
    history = [{"role": "user", "content": question}]
    for _ in range(max_turns):
        response = await client.responses.create(
            model=model,
            instructions=SYSTEM_PROMPT,
            input=history,
            tools=tools,
            store=False,
            include=["reasoning.encrypted_content"],
            max_output_tokens=1800,
        )
        # Preserve reasoning and other output items before adding function results.
        history.extend(response.output)
        calls = [item for item in response.output if item.type == "function_call"]
        if response.status != "completed":
            return "Model response incomplete. No partial tool requests were executed."
        if not calls:
            return response.output_text
        for call in calls:
            try:
                arguments = json.loads(call.arguments)
            except (TypeError, ValueError):
                result = {"error": "Arguments must be a JSON object."}
            else:
                result = await bridge.execute(call.call_id, call.name, arguments)
            history.append(
                {
                    "type": "function_call_output",
                    "call_id": call.call_id,
                    "output": json.dumps(result, ensure_ascii=False),
                }
            )
    return "Turn limit reached. Inspect existing jobs before starting another session."


async def main():
    required = ("OPENAI_API_KEY", "OPENAI_MODEL", "FLASHDATA_API_KEY")
    if any(not os.environ.get(name) for name in required):
        print("Set OPENAI_API_KEY, OPENAI_MODEL and FLASHDATA_API_KEY securely.")
        return 2
    question = input("Research question (no secrets): ")
    if (
        input("Running this agent incurs model fees. Continue? [y/N] ").strip().lower()
        != "y"
    ):
        return 0
    try:
        async with AsyncOpenAI(
            api_key=os.environ["OPENAI_API_KEY"],
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
                    os.environ["OPENAI_MODEL"],
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
