from rest_framework import serializers
from datetime import datetime

from result.models import Result, Choice


class ChoiceSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        errors = {}

        if not attrs.get("questionId"):
            errors.setdefault(
                "questionId", "Le choix de réponse doit être associé à une question.")

        if not attrs.get("answerId"):
            errors.setdefault(
                "questionId", "Le choix de réponse doit être associé à une réponse.")

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        choice = Choice(**validated_data)
        choice.save()

        return choice

    class Meta:
        model = Choice
        fields = ("questionId", "answerId")


class ResultSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True)

    def validate(self, attrs):
        errors = {}

        if not attrs.get("score"):
            errors.setdefault(
                "score", "Un score doit être fourni avec la tentative.")

        if not attrs.get("quizId"):
            errors.setdefault(
                "quizId", "La tentative doit être associée à un quiz.")

        if not attrs.get("userId"):
            errors.setdefault(
                "userId", "La tentative doit être associée à un participant.")

        for choice in attrs.get("choices"):
            choice_serializer = ChoiceSerializer(data=choice)
            choice_serializer.validate(attrs=choice)

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        score = validated_data.get("score")
        quiz = validated_data.get("quizId")
        user = validated_data.get("userId")

        result = Result(score=score, quizId=quiz, userId=user)

        result.save()
        for choice in validated_data.get("choices"):
            new_choice = Choice(**choice)
            new_choice.resultId = result  # type: ignore
            new_choice.save()

        return result

    class Meta:
        model = Result
        fields = ("score", "quizId", "userId", "choices")


class ChoiceDtoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ("id", "questionId", "answerId")


class ResultDtoSerializer(serializers.ModelSerializer):
    choices = ChoiceDtoSerializer(many=True)

    class Meta:
        model = Result
        fields = ("id", "score", "quizId", "userId",
                  "datetime", "choices")
