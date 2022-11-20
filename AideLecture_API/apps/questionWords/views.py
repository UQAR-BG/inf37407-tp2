from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from questionWords.models import QuestionWord
from questionWords.serializers import QuestionWordSerializer, QuestionWordDtoSerializer
from user.decorators import is_part_of_group
from user.constants import UserGroup

# Create your views here.


@swagger_auto_schema(method="GET", tags=["Question word"])
@api_view(["GET"])
def question_word(request, id: int):
    questionWord = QuestionWord.objects.filter(id=id).first()
    if not questionWord:
        return Response(status=status.HTTP_404_NOT_FOUND)

    questionWord.words = questionWord.word_set.filter(  # type: ignore
        phraseId__isnull=True, questionId__isnull=True)
    serializer = QuestionWordDtoSerializer(questionWord)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


@swagger_auto_schema(method="PUT", tags=["Question word"], request_body=QuestionWordSerializer)
@api_view(["PUT"])
@is_part_of_group(UserGroup.admin)
def put(request, id: int):
    questionWord = QuestionWord.objects.filter(id=id).first()
    if not questionWord:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = QuestionWordSerializer(questionWord, data=request.data)
    serializer.validate(attrs=request.data)

    if serializer.is_valid():
        questionWord = serializer.save()

        questionWord.words = questionWord.word_set.filter(  # type: ignore
            phraseId__isnull=True, questionId__isnull=True)

        dto = QuestionWordDtoSerializer(questionWord)

        return JsonResponse(
            dto.data,
            status=status.HTTP_200_OK
        )


@swagger_auto_schema(method="DELETE", tags=["Question word"])
@api_view(["DELETE"])
@is_part_of_group(UserGroup.admin)
def delete(request, id: int):
    word = QuestionWord.objects.filter(id=id, is_active=True).first()
    if not word:
        return Response(status=status.HTTP_404_NOT_FOUND)

    word.is_active = False
    word.save()

    return Response(
        {
            "deletedId": id
        },
        status=status.HTTP_200_OK,
    )


is_active_param = openapi.Parameter(
    'is_active', openapi.IN_QUERY, description="Retourne les mots d'interrogation actifs si true. Retourne tous les autres sinon.", type=openapi.TYPE_BOOLEAN)


@swagger_auto_schema(method="GET", tags=["Question word"], manual_parameters=[is_active_param])
@api_view(["GET"])
def question_words(request):
    if request.GET.get("is_active") and request.GET.get("is_active") == 'true':
        questionWords = QuestionWord.objects.filter(is_active=True)
    else:
        questionWords = QuestionWord.objects.all()

    if not questionWords:
        return Response(status=status.HTTP_204_NO_CONTENT)
    data = []

    for questionWord in questionWords:
        questionWord.words = questionWord.word_set.filter(  # type: ignore
            phraseId__isnull=True, questionId__isnull=True)

        serializer = QuestionWordDtoSerializer(questionWord)
        data.append(serializer.data)

    return Response(
        data,
        status=status.HTTP_200_OK,
    )


@swagger_auto_schema(
    method="POST", tags=["Question word"], request_body=QuestionWordSerializer
)
@api_view(["POST"])
@is_part_of_group(UserGroup.admin)
def create(request):
    serializer = QuestionWordSerializer(data=request.data)
    serializer.validate(attrs=request.data)

    if serializer.is_valid():
        word = serializer.save()

        word.words = word.word_set.filter(  # type: ignore
            phraseId__isnull=True, questionId__isnull=True)

        dto = QuestionWordDtoSerializer(word)

        return JsonResponse(
            dto.data,
            status=status.HTTP_201_CREATED,
        )
