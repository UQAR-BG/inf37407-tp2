from django.http import JsonResponse

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FormParser
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from quiz.models import Quiz
from quiz.serializers import QuizSerializer, QuizDtoSerializer
from user.decorators import is_part_of_group
from user.constants import UserGroup

# Create your views here.


@swagger_auto_schema(methods=["GET"], tags=["Quiz"])
@api_view(["GET"])
def quiz(request, id: int):
    quiz = Quiz.objects.filter(id=id).first()
    if not quiz:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = QuizDtoSerializer(quiz)

    return JsonResponse(
        serializer.data,
        status=status.HTTP_200_OK
    )


@swagger_auto_schema(method="PATCH", tags=["Quiz"], request_body=QuizSerializer)
@api_view(["PATCH"])
@parser_classes([FormParser])
@is_part_of_group(UserGroup.admin)
def patch(request, id: int):
    quiz = Quiz.objects.filter(id=id, is_active=True).first()
    if not quiz:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = QuizSerializer(quiz, data=request.data)
    serializer.validate(attrs=request.data)

    if serializer.is_valid():
        quiz = serializer.save()

        serializer = QuizDtoSerializer(quiz)

        return JsonResponse(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


@swagger_auto_schema(method="DELETE", tags=["Quiz"])
@api_view(["DELETE"])
@is_part_of_group(UserGroup.admin)
def delete(request, id: int):
    quiz = Quiz.objects.filter(id=id, is_active=True).first()
    if not quiz:
        return Response(status=status.HTTP_404_NOT_FOUND)

    quiz.is_active = False
    quiz.save()

    return Response(
        {
            "deletedId": id
        },
        status=status.HTTP_200_OK,
    )


is_active_param = openapi.Parameter(
    'is_active', openapi.IN_QUERY, description="Retourne les quiz actifs si true. Retourne tous les quiz sinon.", type=openapi.TYPE_BOOLEAN)


@swagger_auto_schema(method="GET", tags=["Quiz"], manual_parameters=[is_active_param])
@api_view(["GET"])
def quizzes(request):
    if request.GET.get("is_active") and request.GET.get("is_active") == 'true':
        quizzes = Quiz.objects.filter(is_active=True)
    else:
        quizzes = Quiz.objects.all().values()

    if not quizzes:
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = QuizDtoSerializer(quizzes, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


@swagger_auto_schema(
    method="POST", tags=["Quiz"], request_body=QuizSerializer
)
@api_view(["POST"])
@parser_classes([FormParser])
@is_part_of_group(UserGroup.admin)
def create(request):
    serializer = QuizSerializer(data=request.data)
    serializer.validate(attrs=request.data)

    if serializer.is_valid():
        quiz = serializer.save()

        serializer = QuizDtoSerializer(quiz)

        return JsonResponse(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
