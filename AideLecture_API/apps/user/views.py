from django.http import JsonResponse

from django.contrib.auth.models import User, Group
from django.contrib.auth.hashers import make_password, check_password
import requests

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token

from drf_yasg.utils import swagger_auto_schema

from user.serializers import LoginSerializer, RegisterSerializer, UserDtoSerializer, ParticipantUpdateSerializer
from user.decorators import is_part_of_group
from user.constants import UserGroup

# Create your views here.

###
# Tout le crédit des méthodes register, login et logout doit être porté au compte de M. Yacine Yaddaden.
# Source: https://github.com/yyaddaden/django-intro-demo/blob/main/django_project/apps/fourth_django_app/serializers.py
# Date: 17/11/2022
###


@swagger_auto_schema(
    method="POST", tags=["Authentication"], request_body=RegisterSerializer
)
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    if request.method == "POST":
        serializer = RegisterSerializer(data=request.data)
        serializer.validate(attrs=request.data)

        if serializer.is_valid():
            serializer.save()

            login = LoginSerializer(request.data)
            url = 'http://localhost:8000/api/user/login'
            login_response = requests.post(url, headers={}, data=login.data)

            return JsonResponse(
                login_response.json(),
                status=status.HTTP_201_CREATED,
            )


@swagger_auto_schema(
    method="POST", tags=["Authentication"], request_body=LoginSerializer
)
@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data["username"]
    password = request.data["password"]

    user = User.objects.filter(username=username).first()

    if not user:
        return Response(
            {"message": "L'utilisateur n'existe pas !"},
            status=status.HTTP_404_NOT_FOUND,
        )

    auth_success = check_password(password, user.password)

    if not auth_success:
        return Response(
            {"message": "Mot de passe incorrect !"},
            status=status.HTTP_404_NOT_FOUND,
        )

    token = Token.objects.filter(user=user).first()

    if not token:
        token = Token.objects.create(user=user)
        return Response(
            {"token": "Token {}".format(token.key)}, status=status.HTTP_200_OK
        )
    return Response(
        {"token": "Token {}".format(token.key)},
        status=status.HTTP_200_OK,
    )


@swagger_auto_schema(method="GET", tags=["Authentication"])
@api_view(["GET"])
def logout(request):
    token_key = request.META["HTTP_AUTHORIZATION"].split(" ")[1]

    invalidated_token = Token.objects.filter(key=token_key).first()
    if invalidated_token:
        invalidated_token.delete()

    return Response(
        {"message": "Deconnexion effectuée avec succès !"}, status=status.HTTP_200_OK
    )


@swagger_auto_schema(method="GET", tags=["User"])
@api_view(["GET"])
@is_part_of_group(UserGroup.admin)
def list_users(request):
    if request.method == "GET":
        users = User.objects.filter(is_active=True)
        if not users:
            return Response(status=status.HTTP_204_NO_CONTENT)

        dto = UserDtoSerializer(users, many=True)

        return Response(
            dto.data,
            status=status.HTTP_200_OK,
        )


@swagger_auto_schema(method="GET", tags=["User"])
@api_view(["GET"])
@is_part_of_group(UserGroup.admin)
def user(request, id: int):
    if request.method == "GET":
        user = User.objects.filter(id=id).first()
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        dto = UserDtoSerializer(user)

        return Response(
            dto.data,
            status=status.HTTP_200_OK,
        )


@swagger_auto_schema(method="GET", tags=["User"])
@api_view(["GET"])
def whoami(request):
    if request.method == "GET":
        if not request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        dto = UserDtoSerializer(request.user)

        return Response(
            dto.data,
            status=status.HTTP_200_OK,
        )


@swagger_auto_schema(method="PATCH", tags=["User"], request_body=ParticipantUpdateSerializer)
@api_view(["PATCH"])
def update_participant(request, id: int):
    if request.method == "PATCH":
        user = User.objects.filter(id=id).first()
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user.username != request.user.username and not request.user.groups.filter(name=UserGroup.admin.value):
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = ParticipantUpdateSerializer(user, data=request.data)
        serializer.validate(attrs=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return JsonResponse(
                UserDtoSerializer(user).data,
                status=status.HTTP_200_OK,
            )


@swagger_auto_schema(method="DELETE", tags=["User"])
@api_view(["DELETE"])
@is_part_of_group(UserGroup.admin)
def delete_participant(request, id: int):
    if request.method == "DELETE":
        user = User.objects.filter(id=id).first()
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if user.groups.filter(name=UserGroup.admin.value):
            return Response(status=status.HTTP_403_FORBIDDEN)

        user.is_active = False
        user.save()

        user_token = Token.objects.filter(user_id=id).first()
        if user_token:
            user_token.delete()

        return Response(
            {"message": "L'utilisateur a été supprimé avec succès !"},
            status=status.HTTP_200_OK,
        )
