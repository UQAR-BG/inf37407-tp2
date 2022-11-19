import uuid

from rest_framework import serializers
from datetime import datetime

from questionWords.models import QuestionWord
from words.models import Word
from words.serializers import WordSerializer, WordDtoSerializer
from commons.utils import AudioFileGenerator


class QuestionWordSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True)

    def validate(self, attrs):
        errors = {}

        if not attrs.get("name"):
            errors.setdefault("name", "Le nom du mot ne peut pas être vide.")
        elif len(attrs.get("name")) > 50:
            errors.setdefault(
                "name", "Le nom du mot ne peut pas dépasser 50 caractères.")

        if not attrs.get("statement"):
            errors.setdefault(
                "statement", "L'explication du mot ne peut pas être vide.")
        elif len(attrs.get("statement")) > 300:
            errors.setdefault(
                "statement", "L'explication du mot ne peut pas dépasser 300 caractères.")

        for word in attrs.get("words"):
            word_serializer = WordSerializer(data=word)
            word_serializer.validate(attrs=word)

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        name = validated_data.get("name")
        statement = validated_data.get("statement")

        questionWord = QuestionWord(name=name, statement=statement)

        file_generator = AudioFileGenerator()
        file_generator.generate_audio_file(
            f'audio/question_words/question_word_{questionWord.id}', f'{uuid.uuid4()}.mp3', questionWord.statement)

        questionWord.audio = file_generator.get_filename()

        questionWord.save()
        for word in validated_data.get("words"):
            new_word = Word(**word)
            new_word.questionWordId = questionWord  # type: ignore
            new_word.save()

        return questionWord

    def update(self, instance, validated_data):
        instance.date_modification = datetime.now()

        file_generator = AudioFileGenerator()
        file_generator.generate_audio_file(
            f'audio/question_words/question_word_{instance.id}', f'{uuid.uuid4()}.mp3', validated_data.get(
                'statement'))

        instance.audio = file_generator.get_filename()

        instance = super().update(instance, validated_data)

        Word.objects.filter(questionWordId=instance.id).delete()

        for word in validated_data.get("words"):
            new_word = Word(**word)
            new_word.questionWordId = instance
            new_word.save()

        return instance

    class Meta:
        model = QuestionWord
        fields = ("name", "statement", "words")


class QuestionWordDtoSerializer(serializers.ModelSerializer):
    words = WordDtoSerializer(many=True)

    class Meta:
        model = QuestionWord
        fields = ("id", "name", "statement", "audio", "is_active", "words")
