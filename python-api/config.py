import json
import dataclasses
import os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
FIREBASE_CONFIG = os.getenv("FIREBASE_CONFIG")


@dataclasses.dataclass(frozen=True)
class AppConfig:
    openai_api_key: str
    firebase: dict

    @classmethod
    def from_env(cls) -> "AppConfig":
        openai_api_key = OPENAI_API_KEY
        firebase_conf = FIREBASE_CONFIG
        if openai_api_key is None:
            raise ValueError("OPENAI_API_KEY is required")
        if firebase_conf is None:
            raise ValueError("FIREBASE_CONFIG is required")
        return cls(
            openai_api_key=openai_api_key,
            firebase=json.loads(firebase_conf),
        )
