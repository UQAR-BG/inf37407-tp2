import uuid

from rest_framework import serializers
from datetime import datetime

from question.models import Question, Answer
from words.models import Word
from words.serializers import BasicWordSerializer, WordDtoSerializer
from commons.utils import AudioFileGenerator


class BasicAnswerSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        errors = {}

        if not attrs.get("statement"):
            errors.setdefault("words", []).append(
                {"statement": "L'énoncé de la réponse ne peut pas être vide."})
        elif len(attrs.get("statement")) > 300:
            errors.setdefault(
                "statement", "L'énoncé de la réponse ne peut pas dépasser 300 caractères.")

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        answer = Answer(**validated_data)
        answer.save()

        return answer

    class Meta:
        model = Answer
        fields = ("statement", "isRightAnswer")


class FullAnswerSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    def validate(self, attrs):
        errors = {}

        if not attrs.get("statement"):
            errors.setdefault("words", []).append(
                {"statement": "L'énoncé de la réponse ne peut pas être vide."})
        elif len(attrs.get("statement")) > 300:
            errors.setdefault(
                "statement", "L'énoncé de la réponse ne peut pas dépasser 300 caractères.")

        if attrs.get("image") and not attrs.get("image").endswith(('.png', '.PNG', '.jpg', '.JPG', '.jpeg', '.JPEG', '.gif', '.GIF')):
            errors.setdefault(
                "image", "Vous devez fournir un fichier d'image valide.")

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        question = validated_data.get("questionId")
        if not question:
            raise serializers.ValidationError(
                {"questionId": "La question n'existe pas."})

        answer = Answer(**validated_data)
        answer.questionId = question  # type: ignore
        answer.save()

        file_generator = AudioFileGenerator()
        file_generator.generate_audio_file(
            f'audio/answers', f'{uuid.uuid4()}.mp3', answer.statement)

        answer.audio = file_generator.get_filename()
        answer.save()

        if answer.isRightAnswer:
            question.rightAnswerId = answer.id
            question.save()

        return answer

    def update(self, instance, validated_data):
        updated_answer = super().update(instance, validated_data)
        updated_answer.date_modification = datetime.now()

        file_generator = AudioFileGenerator()
        file_generator.generate_audio_file(
            f'audio/answers', f'{uuid.uuid4()}.mp3', updated_answer.statement)

        updated_answer.audio = file_generator.get_filename()

        if updated_answer.isRightAnswer:
            question = updated_answer.questionId
            question.rightAnswerId = updated_answer.id
            question.save()

        return updated_answer

    class Meta:
        model = Answer
        fields = ("statement", "image", "isRightAnswer", "questionId")


class QuestionSerializer(serializers.ModelSerializer):
    words = BasicWordSerializer(many=True)
    answers = BasicAnswerSerializer(many=True)

    def validate(self, attrs):
        errors = {}

        if not attrs.get("name"):
            errors.setdefault(
                "name", "Le nom de la question ne peut pas être vide.")
        elif len(attrs.get("name")) > 150:
            errors.setdefault(
                "name", "Le nom de la question ne peut pas dépasser 150 caractères.")

        if not attrs.get("statement"):
            errors.setdefault(
                "statement", "L'énoncé de la question ne peut pas être vide.")
        elif len(attrs.get("statement")) > 300:
            errors.setdefault(
                "statement", "L'énoncé de la question ne peut pas dépasser 300 caractères.")

        if not attrs.get("quizId"):
            errors.setdefault(
                "quizId", "La question doit être associé à un quiz.")

        if not attrs.get("words"):
            errors.setdefault(
                "words", "Le champ words est obligatoire.")
        else:
            for word in attrs.get("words"):
                word_serializer = BasicWordSerializer(data=word)
                word_serializer.validate(attrs=word)

        if not attrs.get("answers"):
            errors.setdefault(
                "answers", "Le champ answers est obligatoire.")
        else:
            for answer in attrs.get("answers"):
                answer_serializer = BasicAnswerSerializer(data=answer)
                answer_serializer.validate(attrs=answer)

        if len(errors) > 0:
            raise serializers.ValidationError(errors)

        return attrs

    def create(self, validated_data):
        name = validated_data.get("name")
        statement = validated_data.get("statement")
        quiz = validated_data.get("quizId")

        question = Question(name=name, statement=statement, quizId=quiz)
        question.save()

        file_generator = AudioFileGenerator()
        file_generator.generate_audio_file(
            f'audio/questions/question_{question.id}', f'{uuid.uuid4()}.mp3', question.statement)

        question.questionAudio = file_generator.get_filename()

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

            file_generator = AudioFileGenerator()
            file_generator.generate_audio_file(
                f'audio/answers', f'{uuid.uuid4()}.mp3', new_answer.statement)

            new_answer.audio = file_generator.get_filename()
            new_answer.save()

            if new_answer.isRightAnswer:
                rightAnswerId = new_answer.id

        question.rightAnswerId = rightAnswerId
        question.save()

        return question

    def update(self, instance, validated_data):
        instance.date_modification = datetime.now()
        file_generator = AudioFileGenerator()
        file_generator.generate_audio_file(
            f'audio/questions/question_{instance.id}', f'{uuid.uuid4()}.mp3', validated_data.get(
                'statement'))

        instance.questionAudio = file_generator.get_filename()

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

            file_generator = AudioFileGenerator()
            file_generator.generate_audio_file(
                f'audio/answers', f'{uuid.uuid4()}.mp3', new_answer.statement)

            new_answer.audio = file_generator.get_filename()
            new_answer.save()

            if new_answer.isRightAnswer:
                rightAnswerId = new_answer.id

        instance.rightAnswerId = rightAnswerId
        return instance

    class Meta:
        model = Question
        fields = ("name", "statement", "words", "quizId", "answers")


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
