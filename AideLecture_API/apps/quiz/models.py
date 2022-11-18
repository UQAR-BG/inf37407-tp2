from django.db import models

from datetime import datetime

# Create your models here.


class Quiz(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    date_creation = models.DateTimeField(default=datetime.now, editable=False)
    date_modification = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name
