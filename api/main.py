from typing import cast
import os
import pydantic
import openai
from openai import OpenAI

from fastapi import FastAPI

app = FastAPI()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class Input(pydantic.BaseModel):
    text: str = pydantic.Field(description="The text to be processed")

class Output(pydantic.BaseModel):
    medication: str = pydantic.Field(description="The name of the medication")
    quantity: int = pydantic.Field(description="How much of the medication is available. If a range is given, the lower bound is used.")
    location: str = pydantic.Field(description="Where the medication is located")
    unit: str | None = pydantic.Field(description="The unit of the quantity, if applicable")

@app.get("/healthcheck")
def read_root():
    return {"Hello": "World"}


# And endpoint to take in free-text and returns structured output
@app.post("/structured-medication")
def structured_medication(input_: Input) -> Output:
    # Call the OpenAI API
    client = OpenAI(api_key=OPENAI_API_KEY)
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that takes in a free-text about updates to medication inventory and returns structured output.",
            },
            {
                "role": "user",
                "content": f"Here is an update on our medication inventory: {input_.text}",
            },
        ],
        tools=[
            openai.pydantic_function_tool(Output)
        ],
    )

    tool_calls = completion.choices[0].message.tool_calls
    assert tool_calls is not None, "We called with a tool, so we should get tool calls back"
    output = cast(Output, tool_calls[0].function.parsed_arguments)
    return output
