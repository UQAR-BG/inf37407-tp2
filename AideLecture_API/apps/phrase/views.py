from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from phrase.models import Phrase
from phrase.serializers import PhraseSerializer, PhraseDtoSerializer
from user.decorators import is_part_of_group
from user.constants import UserGroup

# Create your views here.


@swagger_auto_schema(method="GET", tags=["Phrase"])
@api_view(["GET"])
def phrase(request, id: int):
    phrase = Phrase.objects.filter(id=id).first()
    if not phrase:
        return Response(status=status.HTTP_404_NOT_FOUND)

    phrase.words = phrase.word_set.filter(  # type: ignore
        questionId__isnull=True)
    serializer = PhraseDtoSerializer(phrase)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


@swagger_auto_schema(method="PUT", tags=["Phrase"], request_body=PhraseSerializer)
@api_view(["PUT"])
@is_part_of_group(UserGroup.admin)
def put(request, id: int):
    phrase = Phrase.objects.filter(id=id).first()
    if not phrase:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = PhraseSerializer(phrase, data=request.data)
    serializer.validate(attrs=request.data)

    if serializer.is_valid():
        phrase = serializer.save()

        return JsonResponse(
            model_to_dict(phrase),
            status=status.HTTP_200_OK
        )


@swagger_auto_schema(method="DELETE", tags=["Phrase"])
@api_view(["DELETE"])
@is_part_of_group(UserGroup.admin)
def delete(request, id: int):
    phrase = Phrase.objects.filter(id=id, is_active=True).first()
    if not phrase:
        return Response(status=status.HTTP_404_NOT_FOUND)

    phrase.is_active = False
    phrase.save()

    return Response(
        {
            "deletedId": id
        },
        status=status.HTTP_200_OK,
    )


is_active_param = openapi.Parameter(
    'is_active', openapi.IN_QUERY, description="Retourne les textes actifs si true. Retourne tous les textes sinon.", type=openapi.TYPE_BOOLEAN)


@swagger_auto_schema(method="GET", tags=["Phrase"], manual_parameters=[is_active_param])
@api_view(["GET"])
def phrases(request):
    if request.GET.get("is_active") and request.GET.get("is_active") == 'true':
        phrases = Phrase.objects.filter(is_active=True)
    else:
        phrases = Phrase.objects.all()

    if not phrases:
        return Response(status=status.HTTP_204_NO_CONTENT)
    data = []

    for phrase in phrases:
        phrase.words = phrase.word_set.filter(  # type: ignore
            questionId__isnull=True)

        serializer = PhraseDtoSerializer(phrase)
        data.append(serializer.data)

    return Response(
        data,
        status=status.HTTP_200_OK,
    )


@swagger_auto_schema(
    method="POST", tags=["Phrase"], request_body=PhraseSerializer
)
@api_view(["POST"])
@is_part_of_group(UserGroup.admin)
def create(request):
    serializer = PhraseSerializer(data=request.data)
    serializer.validate(attrs=request.data)

    if serializer.is_valid():
        phrase = serializer.save()

        return JsonResponse(
            model_to_dict(phrase),
            status=status.HTTP_201_CREATED,
        )


quiz_id_param = openapi.Parameter(
    'quizId', openapi.IN_QUERY, description="L'identifiant du quiz associé au texte.", type=openapi.TYPE_INTEGER)


@swagger_auto_schema(method="GET", tags=["Phrase"], manual_parameters=[quiz_id_param, is_active_param])
@api_view(["GET"])
def phrases_from_quiz(request):
    if request.GET.get("quizId"):
        quizId = request.GET.get("quizId")

        if request.GET.get("is_active") and request.GET.get("is_active") == 'true':
            phrases = Phrase.objects.filter(quizId=quizId, is_active=True)
        else:
            phrases = Phrase.objects.filter(quizId=quizId)

        if not phrases:
            return Response(status=status.HTTP_204_NO_CONTENT)
        data = []

        for phrase in phrases:
            phrase.words = phrase.word_set.filter(  # type: ignore
                questionId__isnull=True)

            serializer = PhraseDtoSerializer(phrase)
            data.append(serializer.data)

        return Response(
            data,
            status=status.HTTP_200_OK,
        )
