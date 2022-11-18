from django.db import models

from datetime import datetime

# Create your models here.


class Phrase(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    statement = models.CharField(max_length=300)
    audio = models.CharField(max_length=300, null=True, blank=True)
    quizId = models.ForeignKey('quiz.Quiz', on_delete=models.DO_NOTHING)
    date_creation = models.DateTimeField(default=datetime.now, editable=False)
    date_modification = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
