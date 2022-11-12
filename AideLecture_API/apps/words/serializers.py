from rest_framework import serializers
from datetime import datetime

from words.models import Word


class WordSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        errors = {}

        if not attrs.get("statement"):
            errors.setdefault("words", []).append(
                {"statement": "L'énoncé du mot ne peut pas être vide."})

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
        fields = ("statement", "image", "isQuestionWord")
