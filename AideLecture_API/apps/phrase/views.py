from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from phrase.models import Phrase
from phrase.serializers import PhraseSerializer

# Create your views here.


@swagger_auto_schema(methods=["GET", "DELETE"], tags=["Phrase"])
@swagger_auto_schema(method="PATCH", tags=["Phrase"], request_body=PhraseSerializer)
@api_view(["GET", "PATCH", "DELETE"])
def specific_phrase(request, id: int):
    if request.method == "GET":
        phrase = Phrase.objects.filter(id=id).first()
        if not phrase:
            return Response(status=status.HTTP_404_NOT_FOUND)

        words = phrase.word_set.all()  # type: ignore
        wordsData = []
        for word in words:
            wordsData.append({
                "id": word.id,
                "statement": word.statement,
                "image": word.image,
                "isQuestionWord": word.isQuestionWord,
                "questionWordId": word.questionWordId_id,
                "phraseId": word.phraseId_id
            })

        return Response(
            {
                "id": phrase.id,
                "name": phrase.name,
                "statement": phrase.statement,
                "audio": phrase.audio,
                "quizId": phrase.quizId.id,
                "words": wordsData
            },
            status=status.HTTP_200_OK
        )
    elif request.method == "PATCH":
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
    elif request.method == "DELETE":
        phrase = Phrase.objects.filter(id=id).first()
        if not phrase:
            return Response(status=status.HTTP_404_NOT_FOUND)

        phrase.delete()

        return Response(
            {
                "deletedId": id
            },
            status=status.HTTP_200_OK,
        )


@swagger_auto_schema(method="GET", tags=["Phrase"])
@swagger_auto_schema(
    method="post", tags=["Phrase"], request_body=PhraseSerializer
)
@api_view(["GET", "POST"])
def phrase(request):
    if request.method == "GET":
        phrases = Phrase.objects.all()
        if not phrases:
            return Response(status=status.HTTP_204_NO_CONTENT)
        data = []

        for phrase in phrases:
            words = phrase.word_set.all()  # type: ignore
            wordsData = []
            for word in words:
                wordsData.append({
                    "id": word.id,
                    "statement": word.statement,
                    "image": word.image,
                    "isQuestionWord": word.isQuestionWord,
                    "questionWordId": word.questionWordId_id,
                    "phraseId": word.phraseId_id
                })
            data.append({
                "id": phrase.id,
                "name": phrase.name,
                "statement": phrase.statement,
                "audio": phrase.audio,
                "quizId": phrase.quizId.id,
                "words": wordsData
            })

        return Response(
            data,
            status=status.HTTP_200_OK,
        )
    if request.method == "POST":
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


@swagger_auto_schema(method="GET", tags=["Phrase"], manual_parameters=[quiz_id_param])
@api_view(["GET"])
def phrases_from_quiz(request):
    if request.GET.get("quizId"):
        quizId = request.GET.get("quizId")
        phrases = Phrase.objects.filter(quizId=quizId)
        if not phrases:
            return Response(status=status.HTTP_204_NO_CONTENT)
        data = []

        for phrase in phrases:
            words = phrase.word_set.all()  # type: ignore
            wordsData = []
            for word in words:
                wordsData.append({
                    "id": word.id,
                    "statement": word.statement,
                    "image": word.image,
                    "isQuestionWord": word.isQuestionWord,
                    "questionWordId": word.questionWordId_id,
                    "phraseId": word.phraseId_id
                })
            data.append({
                "id": phrase.id,
                "name": phrase.name,
                "statement": phrase.statement,
                "audio": phrase.audio,
                "quizId": phrase.quizId.id,
                "words": wordsData
            })

        return Response(
            data,
            status=status.HTTP_200_OK,
        )
