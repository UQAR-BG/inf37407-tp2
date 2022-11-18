from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema

from quiz.models import Quiz
from quiz.serializers import QuizSerializer
from user.decorators import is_part_of_group
from user.constants import UserGroup

# Create your views here.


@swagger_auto_schema(methods=["GET"], tags=["Quiz"])
@api_view(["GET"])
def quiz(request, id: int):
    quiz = Quiz.objects.filter(id=id).first()
    if not quiz:
        return Response(status=status.HTTP_404_NOT_FOUND)

    return JsonResponse(
        model_to_dict(quiz),
        status=status.HTTP_200_OK
    )


@swagger_auto_schema(method="PATCH", tags=["Quiz"], request_body=QuizSerializer)
@api_view(["PATCH"])
@is_part_of_group(UserGroup.admin)
def patch(request, id: int):
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


@swagger_auto_schema(method="DELETE", tags=["Quiz"])
@api_view(["DELETE"])
@is_part_of_group(UserGroup.admin)
def delete(request, id: int):
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
@api_view(["GET"])
def quizzes(request):
    quizzes = Quiz.objects.all().values()
    if not quizzes:
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(
        list(quizzes),
        status=status.HTTP_200_OK,
    )


@swagger_auto_schema(
    method="POST", tags=["Quiz"], request_body=QuizSerializer
)
@api_view(["POST"])
@is_part_of_group(UserGroup.admin)
def create(request):
    serializer = QuizSerializer(data=request.data)
    serializer.validate(attrs=request.data)

    if serializer.is_valid():
        quiz = serializer.save()

        return JsonResponse(
            model_to_dict(quiz),
            status=status.HTTP_201_CREATED,
        )
