from django.urls import path

from .views import phrase, specific_phrase, phrases_from_quiz

urlpatterns = [
    path("phrase", phrase, name="phrase"),
    path("phrase/<int:id>", specific_phrase, name="specific_phrase"),
    path("from-quiz", phrases_from_quiz, name="phrases_from_quiz")
]
