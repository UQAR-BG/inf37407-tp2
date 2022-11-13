from django.db import models

from datetime import datetime

# Create your models here.


class Word(models.Model):
    id = models.AutoField(primary_key=True)
    statement = models.CharField(max_length=50)
    image = models.CharField(max_length=200, null=True, blank=True)
    isQuestionWord = models.BooleanField(default=False)
    questionWordId = models.ForeignKey(
        'questionWords.QuestionWord', on_delete=models.CASCADE, null=True, blank=True)
    phraseId = models.ForeignKey(
        'phrase.Phrase', on_delete=models.CASCADE, null=True, blank=True)
    questionId = models.ForeignKey(
        'question.Question', on_delete=models.CASCADE, null=True, blank=True)
    date_creation = models.DateTimeField(default=datetime.now, editable=False)
    date_modification = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.statement
