from rest_framework import serializers
from datetime import datetime

from quiz.models import Quiz


class QuizSerializer(serializers.ModelSerializer):

    def validate(self, attrs):
        errors = {}

        if not attrs.get("name"):
            errors.setdefault("name", "Le nom du quiz ne peut pas être vide.")

        if attrs.get("name") and len(attrs.get("name")) > 100:
            errors.setdefault(
                "name", "Le nom du quiz ne peut pas dépasser 100 caractères.")

        if not attrs.get("description"):
            errors.setdefault(
                "description", "La description du quiz ne peut pas être vide.")

        if attrs.get("description") and len(attrs.get("description")) > 1000:
            errors.setdefault(
                "name", "La description du quiz ne peut pas dépasser 1000 caractères.")

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

    class Meta:
        model = Quiz
        fields = ("name", "description")


class QuizDtoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ("id", "name", "description", "date_creation",
                  "date_modification", "is_active")
