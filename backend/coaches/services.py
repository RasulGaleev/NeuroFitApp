from django.conf import settings
from openai import OpenAIError


def generate_answer(messages: list, model="gpt-4o-mini", temperature=0.4) -> str:
    try:
        completion = settings.OPENAI_CLIENT.chat.completions.create(
            model=model,
            temperature=temperature,
            messages=messages,
        )
        return completion.choices[0].message.content

    except OpenAIError as e:
        raise RuntimeError(f"Ошибка OpenAI: {str(e)}")
