from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

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
            return Response(status=status.HTTP_404_NOT_FOUND)

        return JsonResponse(
            model_to_dict(quiz),
            status=status.HTTP_200_OK
        )
    elif request.method == "PATCH":
        quiz = Quiz.objects.filter(id=id).first()
        if not quiz:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = QuizSerializer(quiz, data=request.data)
        serializer.validate(attrs=request.data)

        if serializer.is_valid():
            quiz = serializer.save()

            return JsonResponse(
                model_to_dict(quiz),
                status=status.HTTP_200_OK
            )
    elif request.method == "DELETE":
        quiz = Quiz.objects.filter(id=id).first()
        if not quiz:
            return Response(status=status.HTTP_404_NOT_FOUND)

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
        serializer = QuizSerializer(data=request.data)
        serializer.validate(attrs=request.data)

        if serializer.is_valid():
            quiz = serializer.save()

            return JsonResponse(
                model_to_dict(quiz),
                status=status.HTTP_201_CREATED,
            )
