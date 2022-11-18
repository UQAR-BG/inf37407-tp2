from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema

from words.models import Word
from words.serializers import WordSerializer
from user.decorators import is_part_of_group
from user.constants import UserGroup

# Create your views here.


@swagger_auto_schema(method="GET", tags=["Word"])
@api_view(["GET"])
def word(request, id: int):
    word = Word.objects.filter(id=id).first()

    if not word:
        return Response(status=status.HTTP_404_NOT_FOUND)

    return JsonResponse(
        model_to_dict(word),
        status=status.HTTP_200_OK
    )


@swagger_auto_schema(method="PUT", tags=["Word"], request_body=WordSerializer)
@api_view(["PUT"])
@is_part_of_group(UserGroup.admin)
def put(request, id: int):
    word = Word.objects.filter(id=id).first()

    if not word:
        return Response(status=status.HTTP_404_NOT_FOUND)

    word = WordSerializer(word, request.data).save()

    return JsonResponse(
        model_to_dict(word),
        status=status.HTTP_200_OK
    )


@swagger_auto_schema(method="DELETE", tags=["Word"])
@api_view(["DELETE"])
@is_part_of_group(UserGroup.admin)
def delete(request, id: int):
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


@swagger_auto_schema(
    method="POST", tags=["Word"], request_body=WordSerializer
)
@api_view(["POST"])
@is_part_of_group(UserGroup.admin)
def create(request):
    word = WordSerializer(request.data).save()

    return JsonResponse(
        model_to_dict(word),
        status=status.HTTP_201_CREATED,
    )


@swagger_auto_schema(method="GET", tags=["Word"])
@api_view(["GET"])
def words(request):
    words = Word.objects.all().values()

    if not words:
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(
        list(words),
        status=status.HTTP_200_OK,
    )
