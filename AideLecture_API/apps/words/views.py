from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from drf_yasg.utils import swagger_auto_schema

from words.models import Word
from words.serializers import WordSerializer

# Create your views here.


@swagger_auto_schema(methods=["GET", "DELETE"], tags=["Word"])
@swagger_auto_schema(method="PATCH", tags=["Word"], request_body=WordSerializer)
@api_view(["GET", "PATCH", "DELETE"])
def specific_word(request, id: int):
    if request.method == "GET":
        word = Word.objects.filter(id=id).first()

        if not word:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return JsonResponse(
            model_to_dict(word),
            status=status.HTTP_200_OK
        )
    elif request.method == "PATCH":
        word = Word.objects.filter(id=id).first()

        if not word:
            return Response(status=status.HTTP_404_NOT_FOUND)

        word = WordSerializer(word, request.data).save()

        return JsonResponse(
            model_to_dict(word),
            status=status.HTTP_200_OK
        )
    elif request.method == "DELETE":
        word = Word.objects.filter(id=id).first()

        if not word:
            return Response(status=status.HTTP_404_NOT_FOUND)

        word.delete()

        return Response(
            {
                "deletedId": id
            },
            status=status.HTTP_200_OK,
        )


@swagger_auto_schema(method="GET", tags=["Word"])
@swagger_auto_schema(
    method="post", tags=["Word"], request_body=WordSerializer
)
@api_view(["GET", "POST"])
def word(request):
    if request.method == "GET":
        words = Word.objects.all().values()

        if not words:
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            list(words),
            status=status.HTTP_200_OK,
        )
    if request.method == "POST":
        word = WordSerializer(request.data).save()

        return JsonResponse(
            model_to_dict(word),
            status=status.HTTP_201_CREATED,
        )
