from django.http import JsonResponse
from django.forms.models import model_to_dict

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from question.models import Question
from question.serializers import QuestionSerializer

# Create your views here.


@swagger_auto_schema(methods=["GET", "DELETE"], tags=["Question"])
@swagger_auto_schema(method="PATCH", tags=["Question"], request_body=QuestionSerializer)
@api_view(["GET", "PATCH", "DELETE"])
def specific_question(request, id: int):
    if request.method == "GET":
        question = Question.objects.filter(id=id).first()
        if not question:
            return Response(status=status.HTTP_404_NOT_FOUND)

        words = question.word_set.all()  # type: ignore
        wordsData = []
        for word in words:
            wordsData.append({
                "id": word.id,
                "statement": word.statement,
                "image": word.image,
                "isQuestionWord": word.isQuestionWord,
                "questionWordId": word.questionWordId_id,
                "phraseId": word.phraseId_id
            })
        answers = question.answer_set.all()  # type: ignore
        answersData = []
        for answer in answers:
            answersData.append({
                "id": answer.id,
                "statement": answer.statement,
                "image": answer.image,
                "audio": answer.audio,
                "isRightAnswer": answer.isRightAnswer
            })

        return Response(
            {
                "id": question.id,
                "name": question.name,
                "statement": question.statement,
                "audio": question.questionAudio,
                "quizId": question.quizId.id,
                "words": wordsData,
                "answers": answersData
            },
            status=status.HTTP_200_OK
        )
    elif request.method == "PATCH":
        question = Question.objects.filter(id=id).first()
        if not question:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = QuestionSerializer(question, data=request.data)
        serializer.validate(attrs=request.data)

        if serializer.is_valid():
            question = serializer.save()

            return JsonResponse(
                model_to_dict(question),
                status=status.HTTP_200_OK
            )
    elif request.method == "DELETE":
        question = Question.objects.filter(id=id).first()
        if not question:
            return Response(status=status.HTTP_404_NOT_FOUND)

        question.delete()

        return Response(
            {
                "deletedId": id
            },
            status=status.HTTP_200_OK,
        )


@swagger_auto_schema(method="GET", tags=["Question"])
@swagger_auto_schema(
    method="post", tags=["Question"], request_body=QuestionSerializer
)
@api_view(["GET", "POST"])
def question(request):
    if request.method == "GET":
        questions = Question.objects.all()
        if not questions:
            return Response(status=status.HTTP_204_NO_CONTENT)
        data = []

        for question in questions:
            words = question.word_set.all()  # type: ignore
            wordsData = []
            for word in words:
                wordsData.append({
                    "id": word.id,
                    "statement": word.statement,
                    "image": word.image,
                    "isQuestionWord": word.isQuestionWord,
                    "questionWordId": word.questionWordId_id,
                    "questionId": word.questionId_id
                })
            answers = question.answer_set.all()  # type: ignore
            answersData = []
            for answer in answers:
                answersData.append({
                    "id": answer.id,
                    "statement": answer.statement,
                    "image": answer.image,
                    "audio": answer.audio,
                    "isRightAnswer": answer.isRightAnswer
                })
            data.append({
                "id": question.id,
                "name": question.name,
                "statement": question.statement,
                "questionAudio": question.questionAudio,
                "quizId": question.quizId.id,
                "words": wordsData,
                "answers": answersData
            })

        return Response(
            data,
            status=status.HTTP_200_OK,
        )
    if request.method == "POST":
        serializer = QuestionSerializer(data=request.data)
        serializer.validate(attrs=request.data)

        if serializer.is_valid():
            question = serializer.save()

            return JsonResponse(
                model_to_dict(question),
                status=status.HTTP_201_CREATED,
            )


quiz_id_param = openapi.Parameter(
    'quizId', openapi.IN_QUERY, description="L'identifiant du quiz associé à la question.", type=openapi.TYPE_INTEGER)


@swagger_auto_schema(method="GET", tags=["Question"], manual_parameters=[quiz_id_param])
@api_view(["GET"])
def questions_from_quiz(request):
    if request.GET.get("quizId"):
        quizId = request.GET.get("quizId")
        questions = Question.objects.filter(quizId=quizId)
        if not questions:
            return Response(status=status.HTTP_204_NO_CONTENT)
        data = []

        for question in questions:
            words = question.word_set.all()  # type: ignore
            wordsData = []
            for word in words:
                wordsData.append({
                    "id": word.id,
                    "statement": word.statement,
                    "image": word.image,
                    "isQuestionWord": word.isQuestionWord,
                    "questionWordId": word.questionWordId_id,
                    "questionId": word.questionId_id
                })
            answers = question.answer_set.all()  # type: ignore
            answersData = []
            for answer in answers:
                answersData.append({
                    "id": answer.id,
                    "statement": answer.statement,
                    "image": answer.image,
                    "audio": answer.audio,
                    "isRightAnswer": answer.isRightAnswer
                })
            data.append({
                "id": question.id,
                "name": question.name,
                "statement": question.statement,
                "questionAudio": question.questionAudio,
                "quizId": question.quizId.id,
                "words": wordsData,
                "answers": answersData
            })

        return Response(
            data,
            status=status.HTTP_200_OK,
        )
