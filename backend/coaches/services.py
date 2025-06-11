from django.conf import settings
from openai import OpenAIError


def generate_answer(messages: list, temperature=0.7) -> str:
    try:
        completion = settings.OPENAI_CLIENT.chat.completions.create(
            model=settings.OPENAI_MODEL,
            temperature=temperature,
            messages=messages,
        )
        return completion.choices[0].message.content

    except OpenAIError as e:
        raise RuntimeError(f"Ошибка OpenAI: {str(e)}")
