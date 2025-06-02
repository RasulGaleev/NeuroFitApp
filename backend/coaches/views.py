from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .services import generate_answer
from .utils import get_system_message


class CoachesGenerateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        messages = request.data.get("messages")

        if not messages or not isinstance(messages, list):
            return Response(
                {"error": "Поле 'messages' обязательно и должно быть списком."},
                status=status.HTTP_400_BAD_REQUEST
            )

        system_message = get_system_message(request.user)
        full_messages = [system_message] + messages

        try:
            answer = generate_answer(full_messages)
            return Response({"answer": answer}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
