from typing import cast
import pydantic
import openai
from openai import OpenAI
from firebase_admin import firestore

from fastapi import FastAPI
import firebase_admin
from firebase_admin import credentials
from config import AppConfig
# setup cors to allow request from any origin
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
# Allow requests from anywhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from all origins
    allow_credentials=True,  # Allow sending cookies with requests
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

config = AppConfig.from_env()
creds = credentials.Certificate(config.firebase)
firebase_admin.initialize_app(
    creds,
)

@app.get("/")
def index():
    return {"message": "Hello, World!"}



class Input(pydantic.BaseModel):
    text: str = pydantic.Field(description="The text to be processed")
    store: bool = pydantic.Field(
        default=False, description="Whether to store the result in the database"
    )


class Output(pydantic.BaseModel):
    name: str = pydantic.Field(description="The name of the medication. Fix typos if needed, for example, Prednsione should be corrected to Prednisone.")
    strength: str = pydantic.Field(description="The strength of the medication. e.g. 10mg")
    location: str = pydantic.Field(description="Where the medication is located")
    quantity: int = pydantic.Field(
        description="How much of the medication is available. If a range is given, the lower bound is used."
    )


@app.get("/ping")
def health():
    return {"ping": "pong"}

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

    if input_.store:
        db = firestore.client()
        db.collection("inventory").document().set(
            output.model_dump()
        )

    return output
