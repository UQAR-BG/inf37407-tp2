from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from django.core.exceptions import ValidationError
from django.core.validators import validate_email

from django.contrib.auth.models import User, Group
from rest_framework.authtoken.models import Token

from user.constants import UserGroup

# Create your models here.


class RegisterSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        errors = {}

        if not attrs.get("username"):
            errors.setdefault(
                "username", "Le nom d'utilisateur ne peut pas être vide.")

        if not attrs.get("first_name"):
            errors.setdefault(
                "first_name", "Le prénom ne peut pas être vide.")

        if not attrs.get("last_name"):
            errors.setdefault(
                "last_name", "Le nom ne peut pas être vide.")

        if attrs.get("email"):
            try:
                validate_email(attrs.get("email"))
            except ValidationError:
                errors.setdefault(
                    "email", "Veuillez fournir une adresse courriel valide.")
        else:
            errors.setdefault(
                "email", "Veuillez fournir une adresse courriel valide.")

        if not attrs.get("password"):
            errors.setdefault(
                "password", "Le mot de passe ne peut pas être vide.")

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        username = validated_data.get("username")
        email = validated_data.get("email")
        first_name = validated_data.get("first_name")
        last_name = validated_data.get("last_name")
        password = validated_data.get("password")

        user = User(username=username, email=email, first_name=first_name, last_name=last_name,
                    password=make_password(password))
        user.save()

        participants = Group.objects.get(name=UserGroup.participant.value)
        participants.user_set.add(user)  # type: ignore

        return user

    class Meta:
        model = User
        fields = ("username", "first_name",
                  "last_name", "email", "password")


class ParticipantUpdateSerializer(serializers.ModelSerializer):
    updated_password = serializers.CharField(allow_blank=True, allow_null=True)

    def update(self, instance, validated_data):
        first_name = validated_data.get("first_name") or ""
        last_name = validated_data.get("last_name") or ""
        password = validated_data.get("updated_password") or ""

        if first_name:
            instance.first_name = first_name
            instance.save()
        if last_name:
            instance.last_name = last_name
            instance.save()
        if password:
            instance.password = make_password(password)
            instance.save()

        return instance

    class Meta:
        model = User
        fields = ("first_name", "last_name", "updated_password")


class UserDtoSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField('get_roles')

    def get_roles(self, user):
        if user.groups:
            if user.groups.filter(name=UserGroup.admin.value):
                return UserGroup.admin.name
            if user.groups.filter(name=UserGroup.participant.value):
                return UserGroup.participant.name
        return ""

    class Meta:
        model = User
        fields = ("id", "username", "first_name",
                  "last_name", "email", "is_active", "role")

###
# Tout le crédit de cette classe doit être porté au compte de M. Yacine Yaddaden.
# Source: https://github.com/yyaddaden/django-intro-demo/blob/main/django_project/apps/fourth_django_app/serializers.py
# Date: 17/11/2022
###


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "password")


class LoginDtoSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField('get_token')
    role = serializers.SerializerMethodField('get_roles')

    def get_roles(self, user):
        if user.groups:
            if user.groups.filter(name=UserGroup.admin.value):
                return UserGroup.admin.name
            if user.groups.filter(name=UserGroup.participant.value):
                return UserGroup.participant.name
        return ""

    def get_token(self, user):
        token = Token.objects.filter(user=user).first()  # type: ignore
        if not token:
            token = Token.objects.create(user=user)
            return "Token {}".format(token.key)
        return "Token {}".format(token.key)

    class Meta:
        model = User
        fields = ("id", "username", "first_name",
                  "last_name", "email", "is_active", "token", "role")
