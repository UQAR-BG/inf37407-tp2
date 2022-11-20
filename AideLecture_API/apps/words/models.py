import uuid

from django.db import models

from datetime import datetime

# Create your models here.
#
# Tout le crédit du processus de téléversement de fichiers d'image
# doit être porté au compte de M. Thom Zolghadr.
# Source: https://dev.to/thomz/uploading-images-to-django-rest-framework-from-forms-in-react-3jhj
# Publié le 13 janvier 2022
#


def upload_to(instance, filename):
    return f'images/words/{uuid.uuid4()}_{filename}'


class Word(models.Model):
    id = models.AutoField(primary_key=True)
    statement = models.CharField(max_length=50)
    image = models.ImageField(upload_to=upload_to, blank=True, null=True)
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
