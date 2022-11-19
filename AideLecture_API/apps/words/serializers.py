from rest_framework import serializers
from datetime import datetime

from words.models import Word
from questionWords.models import QuestionWord


class WordSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        errors = {}

        if not attrs.get("statement"):
            errors.setdefault("words", []).append(
                {"statement": "Le mot ne peut pas être vide."})
        elif len(attrs.get("statement")) > 50:
            errors.setdefault(
                "statement", "Le mot ne peut pas dépasser 50 caractères.")

        if attrs.get("questionWordId"):
            questionWordId = attrs.get("questionWordId")
            questionWord = QuestionWord.objects.filter(
                id=questionWordId).first()
            if not questionWord:
                errors.setdefault(
                    "questionWordId", f"Le mot d'interrogation #{questionWordId} n'existe pas.")

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
