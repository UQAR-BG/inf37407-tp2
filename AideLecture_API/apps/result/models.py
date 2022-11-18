from django.db import models
from django.contrib.auth.models import User

from datetime import datetime

# Create your models here.


class Choice(models.Model):
    id = models.AutoField(primary_key=True)
    resultId = models.ForeignKey(
        'result.Result', on_delete=models.CASCADE, blank=True, null=True)
    questionId = models.ForeignKey(
        'question.Question', on_delete=models.DO_NOTHING)
    answerId = models.ForeignKey(
        'question.Answer', on_delete=models.DO_NOTHING)


class Result(models.Model):
    id = models.AutoField(primary_key=True)
    score = models.IntegerField(default=0)
    quizId = models.ForeignKey('quiz.Quiz', on_delete=models.DO_NOTHING)
    userId = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    datetime = models.DateTimeField(default=datetime.now, editable=False)
