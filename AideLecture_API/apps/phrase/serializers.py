import uuid

from rest_framework import serializers
from datetime import datetime

from phrase.models import Phrase
from words.models import Word
from words.serializers import BasicWordSerializer, WordDtoSerializer
from commons.utils import AudioFileGenerator


class PhraseSerializer(serializers.ModelSerializer):
    words = BasicWordSerializer(many=True)

    def validate(self, attrs):
        errors = {}

        if not attrs.get("name"):
            errors.setdefault("name", "Le nom du texte ne peut pas être vide.")
        elif len(attrs.get("name")) > 50:
            errors.setdefault(
                "name", "Le nom du texte ne peut pas dépasser 50 caractères.")

        if not attrs.get("statement"):
            errors.setdefault(
                "statement", "L'explication du texte ne peut pas être vide.")
        elif len(attrs.get("statement")) > 300:
            errors.setdefault(
                "statement", "L'explication du texte ne peut pas dépasser 300 caractères.")

        if not attrs.get("quizId"):
            errors.setdefault(
                "quizId", "Le texte doit être associé à un quiz.")

        for word in attrs.get("words"):
            word_serializer = BasicWordSerializer(data=word)
            word_serializer.validate(attrs=word)

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        name = validated_data.get("name")
        statement = validated_data.get("statement")
        quiz = validated_data.get("quizId")

        phrase = Phrase(name=name, statement=statement, quizId=quiz)
        phrase.save()

        file_generator = AudioFileGenerator()
        file_generator.generate_audio_file(
            f'audio/phrases/phrase_{phrase.id}', f'{uuid.uuid4()}.mp3', phrase.statement)

        phrase.audio = file_generator.get_filename()

        phrase.save()
        for word in validated_data.get("words"):
            new_word = Word(**word)
            new_word.phraseId = phrase  # type: ignore
            new_word.save()

        return phrase

    def update(self, instance, validated_data):
        instance.date_modification = datetime.now()

        file_generator = AudioFileGenerator()
        file_generator.generate_audio_file(
            f'audio/phrases/phrase_{instance.id}', f'{uuid.uuid4()}.mp3', validated_data.get(
                'statement'))

        instance.audio = file_generator.get_filename()
        instance = super().update(instance, validated_data)

        Word.objects.filter(phraseId=instance.id).delete()

        for word in validated_data.get("words"):
            new_word = Word(**word)
            new_word.phraseId = instance
            new_word.save()

        return instance

    class Meta:
        model = Phrase
        fields = ("name", "statement", "words", "quizId")


class PhraseDtoSerializer(serializers.ModelSerializer):
    words = WordDtoSerializer(many=True)

    class Meta:
        model = Phrase
        fields = ("id", "name", "statement", "audio",
                  "quizId", "is_active", "words")
