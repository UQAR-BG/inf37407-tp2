from rest_framework import serializers
from datetime import datetime

from questionWords.models import QuestionWord
from words.models import Word
from words.serializers import WordSerializer


class QuestionWordSerializer(serializers.ModelSerializer):
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

        questionWord = QuestionWord(
            name=name, statement=statement, audio=audio)

        questionWord.save()
        for word in validated_data.get("words"):
            new_word = Word(**word)
            new_word.question_word = questionWord
            new_word.save()

        return questionWord

    def update(self, instance, validated_data):
        instance.date_modification = datetime.now()
        instance = super().update(instance, validated_data)

        Word.objects.select_related("question_word").all().delete()

        for word in validated_data.get("words"):
            new_word = Word(**word)
            new_word.question_word = instance
            new_word.save()

        return instance

    class Meta:
        model = QuestionWord
        fields = ("name", "statement", "audio", "words")
