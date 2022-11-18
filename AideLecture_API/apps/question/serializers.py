from rest_framework import serializers
from datetime import datetime

from question.models import Question, Answer
from words.models import Word
from words.serializers import WordSerializer, WordDtoSerializer


class AnswerSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        errors = {}

        if not attrs.get("statement"):
            errors.setdefault("words", []).append(
                {"statement": "L'énoncé du mot ne peut pas être vide."})

        if attrs.get("audio") and not attrs.get("audio").endswith(('.mp3', '.MP3')):
            errors.setdefault(
                "audio", "Vous devez fournir un fichier audio valide.")

        if attrs.get("image") and not attrs.get("image").endswith(('.png', '.PNG', '.jpg', '.JPG', '.jpeg', '.JPEG', '.gif', '.GIF')):
            errors.setdefault(
                "image", "Vous devez fournir un fichier d'image valide.")

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        answer = Answer(**validated_data)
        answer.save()

        return answer

    def update(self, instance, validated_data):
        updated_answer = super().update(instance, validated_data)
        updated_answer.date_modification = datetime.now()
        return updated_answer

    class Meta:
        model = Answer
        fields = ("statement", "image", "audio", "isRightAnswer")


class QuestionSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True)
    answers = AnswerSerializer(many=True)

    def validate(self, attrs):
        errors = {}

        if not attrs.get("name"):
            errors.setdefault("name", "L'énoncé du mot ne peut pas être vide.")

        if not attrs.get("statement"):
            errors.setdefault(
                "statement", "L'explication du mot ne peut pas être vide.")

        if attrs.get("questionAudio") and not attrs.get("questionAudio").endswith(('.mp3', '.MP3')):
            errors.setdefault(
                "questionAudio", "Vous devez fournir un fichier audio valide.")

        if not attrs.get("quizId"):
            errors.setdefault(
                "quizId", "Le texte doit être associé à un quiz.")

        for word in attrs.get("words"):
            word_serializer = WordSerializer(data=word)
            word_serializer.validate(attrs=word)

        for answer in attrs.get("answers"):
            answer_serializer = AnswerSerializer(data=answer)
            answer_serializer.validate(attrs=answer)

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        name = validated_data.get("name")
        statement = validated_data.get("statement")
        audio = validated_data.get("questionAudio") or ""
        quiz = validated_data.get("quizId")

        question = Question(
            name=name, statement=statement, questionAudio=audio, quizId=quiz)

        question.save()
        for word in validated_data.get("words"):
            new_word = Word(**word)
            new_word.questionId = question  # type: ignore
            new_word.save()

        rightAnswerId = 0
        for answer in validated_data.get("answers"):
            new_answer = Answer(**answer)
            new_answer.questionId = question  # type: ignore
            new_answer.save()

            if new_answer.isRightAnswer:
                rightAnswerId = new_answer.id

        question.rightAnswerId = rightAnswerId
        question.save()

        return question

    def update(self, instance, validated_data):
        instance.date_modification = datetime.now()
        instance = super().update(instance, validated_data)

        Word.objects.filter(questionId=instance.id).delete()
        Answer.objects.filter(questionId=instance.id).delete()

        for word in validated_data.get("words"):
            new_word = Word(**word)
            new_word.questionId = instance
            new_word.save()

        rightAnswerId = 0
        for answer in validated_data.get("answers"):
            new_answer = Answer(**answer)
            new_answer.questionId = instance
            new_answer.save()

            if new_answer.isRightAnswer:
                rightAnswerId = new_answer.id

        instance.rightAnswerId = rightAnswerId
        return instance

    class Meta:
        model = Question
        fields = ("name", "statement", "questionAudio",
                  "words", "quizId", "answers")


class AnswerDtoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ("id", "statement", "image", "audio", "isRightAnswer")


class QuestionDtoSerializer(serializers.ModelSerializer):
    words = WordDtoSerializer(many=True)
    answers = AnswerDtoSerializer(many=True)

    class Meta:
        model = Question
        fields = ("id", "name", "statement", "questionAudio",
                  "quizId", "rightAnswerId", "is_active", "words", "answers")
