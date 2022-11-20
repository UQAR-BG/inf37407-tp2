from rest_framework import serializers
from datetime import datetime

from words.models import Word


class BasicWordSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        errors = {}

        if not attrs.get("statement"):
            errors.setdefault("words", []).append(
                {"statement": "Le mot ne peut pas être vide."})
        elif len(attrs.get("statement")) > 50:
            errors.setdefault(
                "statement", "Le mot ne peut pas dépasser 50 caractères.")

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        word = Word(**validated_data)
        word.save()

        return word

    def update(self, instance, validated_data):
        updated_word = super().update(instance, validated_data)
        updated_word.date_modification = datetime.now()
        return updated_word

    class Meta:
        model = Word
        fields = ("statement", "isQuestionWord", "questionWordId")


class FullWordSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    def validate(self, attrs):
        errors = {}

        if not attrs.get("statement"):
            errors.setdefault("words", []).append(
                {"statement": "Le mot ne peut pas être vide."})
        elif len(attrs.get("statement")) > 50:
            errors.setdefault(
                "statement", "Le mot ne peut pas dépasser 50 caractères.")

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        word = Word(**validated_data)
        word.save()

        return word

    def update(self, instance, validated_data):
        updated_word = super().update(instance, validated_data)
        updated_word.date_modification = datetime.now()
        return updated_word

    class Meta:
        model = Word
        fields = ("statement", "image", "isQuestionWord", "questionWordId")


class WordDtoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ("id", "statement", "image", "isQuestionWord",
                  "questionWordId", "phraseId", "questionId")
