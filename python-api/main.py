from typing import cast
import pydantic
import openai
from openai import OpenAI
from firebase_admin import firestore

from fastapi import FastAPI
import firebase_admin
from firebase_admin import credentials
from config import AppConfig

app = FastAPI()


config = AppConfig.from_env()
creds = credentials.Certificate(config.firebase)
firebase_admin.initialize_app(
    creds,
)


class Input(pydantic.BaseModel):
    text: str = pydantic.Field(description="The text to be processed")
    store: bool = pydantic.Field(
        default=False, description="Whether to store the result in the database"
    )


class Dosage(pydantic.BaseModel):
    quantity: int
    unit: str
    form: str | None

class Output(pydantic.BaseModel):
    name: str = pydantic.Field(description="The name of the medication. Fix typos if needed, for example, Prednsione should be corrected to Prednisone.")
    units: int = pydantic.Field(
        description="How much of the medication is available. If a range is given, the lower bound is used."
    )
    dosage: Dosage
    location: str = pydantic.Field(description="Where the medication is located")


@app.get("/healthcheck")
def read_root():
    return {"Hello": "World"}


# And endpoint to take in free-text and returns structured output
@app.post("/structured-medication")
def structured_medication(input_: Input) -> Output:
    client = OpenAI(api_key=config.openai_api_key)
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
        tools=[openai.pydantic_function_tool(Output)],
    )

    tool_calls = completion.choices[0].message.tool_calls
    assert (
        tool_calls is not None
    ), "We called with a tool, so we should get tool calls back"
    output = cast(Output, tool_calls[0].function.parsed_arguments)

    print(output)
    if input_.store:
        db = firestore.client()
        db.collection("inventory").document().set(
            output.model_dump()
        )

    return output
