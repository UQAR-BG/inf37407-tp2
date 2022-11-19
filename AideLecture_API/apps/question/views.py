from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from question.models import Question
from question.serializers import QuestionSerializer, QuestionDtoSerializer
from user.decorators import is_part_of_group
from user.constants import UserGroup

# Create your views here.


@swagger_auto_schema(method="GET", tags=["Question"])
@api_view(["GET"])
def question(request, id: int):
    question = Question.objects.filter(id=id).first()
    if not question:
        return Response(status=status.HTTP_404_NOT_FOUND)

    question.words = question.word_set.filter(  # type: ignore
        phraseId__isnull=True)
    question.answers = question.answer_set.all()  # type: ignore

    serializer = QuestionDtoSerializer(question)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


@swagger_auto_schema(method="PUT", tags=["Question"], request_body=QuestionSerializer)
@api_view(["PUT"])
@is_part_of_group(UserGroup.admin)
def put(request, id: int):
    question = Question.objects.filter(id=id).first()
    if not question:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = QuestionSerializer(question, data=request.data)
    serializer.validate(attrs=request.data)

    if serializer.is_valid():
        question = serializer.save()

        question.words = question.word_set.filter(  # type: ignore
            phraseId__isnull=True)
        question.answers = question.answer_set.all()  # type: ignore

        dto = QuestionDtoSerializer(question)

        return JsonResponse(
            dto.data,
            status=status.HTTP_200_OK
        )


@swagger_auto_schema(method="DELETE", tags=["Question"])
@api_view(["DELETE"])
@is_part_of_group(UserGroup.admin)
def delete(request, id: int):
    question = Question.objects.filter(id=id, is_active=True).first()
    if not question:
        return Response(status=status.HTTP_404_NOT_FOUND)

    question.is_active = False
    question.save()

    return Response(
        {
            "deletedId": id
        },
        status=status.HTTP_200_OK,
    )


is_active_param = openapi.Parameter(
    'is_active', openapi.IN_QUERY, description="Retourne les questions actives si true. Retourne toutes les questions sinon.", type=openapi.TYPE_BOOLEAN)


@swagger_auto_schema(method="GET", tags=["Question"], manual_parameters=[is_active_param])
@api_view(["GET"])
def questions(request):
    if request.GET.get("is_active") and request.GET.get("is_active") == 'true':
        questions = Question.objects.filter(is_active=True)
    else:
        questions = Question.objects.all()

    if not questions:
        return Response(status=status.HTTP_204_NO_CONTENT)
    data = []

    for question in questions:
        question.words = question.word_set.filter(  # type: ignore
            phraseId__isnull=True)
        question.answers = question.answer_set.all()  # type: ignore

        serializer = QuestionDtoSerializer(question)
        data.append(serializer.data)

    return Response(
        data,
        status=status.HTTP_200_OK,
    )


@swagger_auto_schema(
    method="POST", tags=["Question"], request_body=QuestionSerializer
)
@api_view(["POST"])
@is_part_of_group(UserGroup.admin)
def create(request):
    serializer = QuestionSerializer(data=request.data)
    serializer.validate(attrs=request.data)

    if serializer.is_valid():
        question = serializer.save()

        question.words = question.word_set.filter(  # type: ignore
            phraseId__isnull=True)
        question.answers = question.answer_set.all()  # type: ignore

        dto = QuestionDtoSerializer(question)

        return JsonResponse(
            dto.data,
            status=status.HTTP_201_CREATED,
        )


quiz_id_param = openapi.Parameter(
    'quizId', openapi.IN_QUERY, description="L'identifiant du quiz associé à la question.", type=openapi.TYPE_INTEGER)


@swagger_auto_schema(method="GET", tags=["Question"], manual_parameters=[quiz_id_param, is_active_param])
@api_view(["GET"])
def questions_from_quiz(request):
    if request.GET.get("quizId"):
        quizId = request.GET.get("quizId")

        if request.GET.get("is_active") and request.GET.get("is_active") == 'true':
            questions = Question.objects.filter(quizId=quizId, is_active=True)
        else:
            questions = Question.objects.filter(quizId=quizId)

        if not questions:
            return Response(status=status.HTTP_204_NO_CONTENT)
        data = []

        for question in questions:
            question.words = question.word_set.filter(  # type: ignore
                phraseId__isnull=True)
            question.answers = question.answer_set.all()  # type: ignore

            serializer = QuestionDtoSerializer(question)
            data.append(serializer.data)

        return Response(
            data,
            status=status.HTTP_200_OK,
        )
