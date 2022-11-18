from django.urls import path

from question.views import question, questions, questions_from_quiz, put, create, delete

urlpatterns = [
    path("questions", questions, name="questions"),
    path("question/<int:id>", question, name="question"),
    path("create", create, name="create"),
    path("delete/<int:id>", delete, name="delete"),
    path("put/<int:id>", put, name="put"),
    path("from-quiz", questions_from_quiz, name="questions_from_quiz")
]
