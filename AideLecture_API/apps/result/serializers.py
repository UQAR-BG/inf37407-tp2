from rest_framework import serializers

from quiz.models import Quiz
from question.models import Question, Answer
from django.contrib.auth.models import User
from result.models import Result, Choice


class ChoiceSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        errors = {}

        if not attrs.get("questionId"):
            errors.setdefault(
                "questionId", "Le choix de réponse doit être associé à une question.")
        else:
            questionId = attrs.get("questionId")
            question = Question.objects.filter(id=questionId).first()
            if not question:
                errors.setdefault(
                    "questionId", f"La question #{questionId} n'existe pas.")

        if not attrs.get("answerId"):
            errors.setdefault(
                "questionId", "Le choix de réponse doit être associé à une réponse.")
        else:
            answerId = attrs.get("answerId")
            answer = Answer.objects.filter(id=answerId).first()
            if not answer:
                errors.setdefault(
                    "answerId", f"La réponse #{answerId} n'existe pas.")

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

        for choice in attrs.get("choices"):
            choice_serializer = ChoiceSerializer(data=choice)
            choice_serializer.validate(attrs=choice)

        if not attrs.get("score"):
            errors.setdefault(
                "score", "Un score doit être fourni avec la tentative.")
        else:
            score = attrs.get("score")
            choices = attrs.get("choices")
            if score < 0 or score > len(choices):
                errors.setdefault(
                    "score", f"La valeur du score doit se situer entre 0 et {len(choices)}.")

        if not attrs.get("quizId"):
            errors.setdefault(
                "quizId", "La tentative doit être associée à un quiz.")
        else:
            quizId = attrs.get("quizId")
            quiz = Quiz.objects.filter(id=quizId).first()
            if not quiz:
                errors.setdefault(
                    "quizId", f"Le quiz #{quizId} n'existe pas.")

        if not attrs.get("userId"):
            errors.setdefault(
                "userId", "La tentative doit être associée à un participant.")
        else:
            userId = attrs.get("userId")
            user = User.objects.filter(id=userId).first()
            if not user:
                errors.setdefault(
                    "userId", f"Le participant #{userId} n'existe pas.")

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
