from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema

from result.models import Result
from result.serializers import ResultSerializer, ResultDtoSerializer
from user.decorators import is_part_of_group
from user.constants import UserGroup

# Create your views here.


@swagger_auto_schema(methods=["GET"], tags=["Statistics"])
@api_view(["GET"])
@is_part_of_group(UserGroup.admin)
def result(request, id: int):
    result = Result.objects.filter(id=id).first()
    if not result:
        return Response(status=status.HTTP_204_NO_CONTENT)

    result.choices = result.choice_set.all()  # type: ignore

    serializer = ResultDtoSerializer(result)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


@swagger_auto_schema(methods=["GET"], tags=["Statistics"])
@api_view(["GET"])
@is_part_of_group(UserGroup.admin)
def result_from_user(request, userId: int):
    results = Result.objects.filter(userId=userId)
    if not results:
        return Response(status=status.HTTP_204_NO_CONTENT)
    data = []

    for result in results:
        result.choices = result.choice_set.all()  # type: ignore

        serializer = ResultDtoSerializer(result)
        data.append(serializer.data)

    return Response(
        data,
        status=status.HTTP_200_OK,
    )


@swagger_auto_schema(methods=["GET"], tags=["Statistics"])
@api_view(["GET"])
@is_part_of_group(UserGroup.participant)
def my_results(request):
    if request.user:
        results = Result.objects.filter(userId=request.user)
        if not results:
            return Response(status=status.HTTP_204_NO_CONTENT)
        data = []

        for result in results:
            result.choices = result.choice_set.all()  # type: ignore

            serializer = ResultDtoSerializer(result)
            data.append(serializer.data)

        return Response(
            data,
            status=status.HTTP_200_OK,
        )
    return Response({"message": "Aucun utilisateur trouvé."}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(method="GET", tags=["Statistics"])
@api_view(["GET"])
@is_part_of_group(UserGroup.admin)
def results(request):
    results = Result.objects.all()
    if not results:
        return Response(status=status.HTTP_204_NO_CONTENT)
    data = []

    for result in results:
        result.choices = result.choice_set.all()  # type: ignore

        serializer = ResultDtoSerializer(result)
        data.append(serializer.data)

    return Response(
        data,
        status=status.HTTP_200_OK,
    )


@swagger_auto_schema(
    method="POST", tags=["Statistics"], request_body=ResultSerializer
)
@api_view(["POST"])
@is_part_of_group(UserGroup.admin)
def post(request):
    serializer = ResultSerializer(data=request.data)
    serializer.validate(attrs=request.data)

    if serializer.is_valid():
        result = serializer.save()

        return JsonResponse(
            model_to_dict(result),
            status=status.HTTP_201_CREATED,
        )
