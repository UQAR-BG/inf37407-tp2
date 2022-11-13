from django.db import models

from datetime import datetime

# Create your models here.


class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    statement = models.CharField(max_length=300)
    image = models.CharField(max_length=200, null=True, blank=True)
    audio = models.CharField(max_length=200, null=True, blank=True)
    isRightAnswer = models.BooleanField(default=False)
    questionId = models.ForeignKey(
        'question.Question', on_delete=models.CASCADE)
    date_creation = models.DateTimeField(default=datetime.now, editable=False)
    date_modification = models.DateTimeField(null=True, blank=True)


class Question(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    statement = models.CharField(max_length=300)
    questionAudio = models.CharField(max_length=300, null=True, blank=True)
    quizId = models.ForeignKey('quiz.Quiz', on_delete=models.DO_NOTHING)
    rightAnswerId = models.IntegerField(null=True, blank=True, editable=True)
    date_creation = models.DateTimeField(default=datetime.now, editable=False)
    date_modification = models.DateTimeField(null=True, blank=True)
