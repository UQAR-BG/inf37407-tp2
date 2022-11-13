from django.urls import path

from .views import question, specific_question, questions_from_quiz

urlpatterns = [
    path("question", question, name="question"),
    path("question/<int:id>", specific_question, name="specific_question"),
    path("from-quiz", questions_from_quiz, name="questions_from_quiz")
]
