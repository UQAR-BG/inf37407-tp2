from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from drf_yasg.utils import swagger_auto_schema

from questionWords.models import QuestionWord
from questionWords.serializers import QuestionWordSerializer, QuestionWordDtoSerializer

# Create your views here.


@swagger_auto_schema(methods=["GET", "DELETE"], tags=["Question word"])
@swagger_auto_schema(method="PATCH", tags=["Question word"], request_body=QuestionWordSerializer)
@api_view(["GET", "PATCH", "DELETE"])
def specific_question_word(request, id: int):
    if request.method == "GET":
        questionWord = QuestionWord.objects.filter(id=id).first()
        if not questionWord:
            return Response(status=status.HTTP_404_NOT_FOUND)

        questionWord.words = questionWord.word_set.all()  # type: ignore
        serializer = QuestionWordDtoSerializer(questionWord)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    elif request.method == "PATCH":
        questionWord = QuestionWord.objects.filter(id=id).first()
        if not questionWord:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = QuestionWordSerializer(questionWord, data=request.data)
        serializer.validate(attrs=request.data)

        if serializer.is_valid():
            questionWord = serializer.save()

            return JsonResponse(
                model_to_dict(questionWord),
                status=status.HTTP_200_OK
            )
    elif request.method == "DELETE":
        word = QuestionWord.objects.filter(id=id).first()
        if not word:
            return Response(status=status.HTTP_404_NOT_FOUND)

        word.delete()

        return Response(
            {
                "deletedId": id
            },
            status=status.HTTP_200_OK,
        )


@swagger_auto_schema(method="GET", tags=["Question word"])
@swagger_auto_schema(
    method="post", tags=["Question word"], request_body=QuestionWordSerializer
)
@api_view(["GET", "POST"])
def question_word(request):
    if request.method == "GET":
        questionWords = QuestionWord.objects.all()
        if not questionWords:
            return Response(status=status.HTTP_204_NO_CONTENT)
        data = []

        for questionWord in questionWords:
            questionWord.words = questionWord.word_set.all()      # type: ignore

            serializer = QuestionWordDtoSerializer(questionWord)
            data.append(serializer.data)

        return Response(
            data,
            status=status.HTTP_200_OK,
        )
    if request.method == "POST":
        serializer = QuestionWordSerializer(data=request.data)
        serializer.validate(attrs=request.data)

        if serializer.is_valid():
            word = serializer.save()

            return JsonResponse(
                model_to_dict(word),
                status=status.HTTP_201_CREATED,
            )
