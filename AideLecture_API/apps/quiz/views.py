from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from django.utils.timezone import get_current_timezone
from datetime import datetime

from drf_yasg.utils import swagger_auto_schema

from quiz.models import Quiz
from quiz.serializers import QuizSerializer

# Create your views here.


@swagger_auto_schema(methods=["GET", "DELETE"], tags=["Quiz"])
@swagger_auto_schema(method="PATCH", tags=["Quiz"], request_body=QuizSerializer)
@api_view(["GET", "PATCH", "DELETE"])
def specific_quiz(request, id: int):
    if request.method == "GET":
        quiz = Quiz.objects.filter(id=id).first()

        if not quiz:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return JsonResponse(
            model_to_dict(quiz),
            status=status.HTTP_200_OK
        )
    elif request.method == "PATCH":
        quiz = Quiz.objects.filter(id=id).first()

        if not quiz:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        quiz.name = request.data.get("name") or quiz.name
        quiz.description = request.data.get("description") or quiz.description
        quiz.date_modification = datetime.now()
        quiz.save()

        return JsonResponse(
            model_to_dict(quiz),
            status=status.HTTP_200_OK
        )
    elif request.method == "DELETE":
        quiz = Quiz.objects.filter(id=id).first()

        if not quiz:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        quiz.delete()

        return Response(
            {
                "deletedId": id
            },
            status=status.HTTP_200_OK,
        )


@swagger_auto_schema(method="GET", tags=["Quiz"])
@swagger_auto_schema(
    method="post", tags=["Quiz"], request_body=QuizSerializer
)
@api_view(["GET", "POST"])
def quiz(request):
    if request.method == "GET":
        quizzes = Quiz.objects.all().values()

        if not quizzes:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            list(quizzes),
            status=status.HTTP_200_OK,
        )
    if request.method == "POST":
        name = request.data.get("name")
        description = request.data.get("description")

        quiz = Quiz(name=name, description=description)
        quiz.save()

        return JsonResponse(
            model_to_dict(quiz),
            status=status.HTTP_201_CREATED,
        )
