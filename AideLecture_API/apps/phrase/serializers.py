from rest_framework import serializers
from datetime import datetime

from phrase.models import Phrase
from words.models import Word
from words.serializers import WordSerializer, WordDtoSerializer


class PhraseSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True)

    def validate(self, attrs):
        errors = {}

        if not attrs.get("name"):
            errors.setdefault("name", "L'énoncé du mot ne peut pas être vide.")

        if not attrs.get("statement"):
            errors.setdefault(
                "statement", "L'explication du mot ne peut pas être vide.")

        if attrs.get("audio") and not attrs.get("audio").endswith(('.mp3', '.MP3')):
            errors.setdefault(
                "audio", "Vous devez fournir un fichier audio valide.")

        if not attrs.get("quizId"):
            errors.setdefault(
                "quizId", "Le texte doit être associé à un quiz.")

        for word in attrs.get("words"):
            word_serializer = WordSerializer(data=word)
            word_serializer.validate(attrs=word)

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        name = validated_data.get("name")
        statement = validated_data.get("statement")
        audio = validated_data.get("audio") or ""
        quiz = validated_data.get("quizId")

        phrase = Phrase(
            name=name, statement=statement, audio=audio, quizId=quiz)

        phrase.save()
        for word in validated_data.get("words"):
            new_word = Word(**word)
            new_word.phraseId = phrase  # type: ignore
            new_word.save()

        return phrase

    def update(self, instance, validated_data):
        instance.date_modification = datetime.now()
        instance = super().update(instance, validated_data)

        Word.objects.filter(phraseId=instance.id).delete()

        for word in validated_data.get("words"):
            new_word = Word(**word)
            new_word.phraseId = instance
            new_word.save()

        return instance

    class Meta:
        model = Phrase
        fields = ("name", "statement", "audio", "words", "quizId")


class PhraseDtoSerializer(serializers.ModelSerializer):
    words = WordDtoSerializer(many=True)

    class Meta:
        model = Phrase
        fields = ("id", "name", "statement", "audio",
                  "quizId", "is_active", "words")
