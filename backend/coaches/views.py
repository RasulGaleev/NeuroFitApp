import openai
from openai import OpenAI
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.main import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)


class GenerateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        messages = request.data["messages"]
        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
            )
            content = completion.choices[0].message.content
            return Response({"answer": content})

        except openai.OpenAIError as e:
            return Response({"error": f"Ошибка OpenAI: {str(e)}"}, status=500)
