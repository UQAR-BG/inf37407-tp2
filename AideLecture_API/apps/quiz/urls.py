from django.urls import path

from quiz.views import quiz, quizzes, patch, create, delete

urlpatterns = [
    path("quizzes", quizzes, name="quizzes"),
    path("quiz/<int:id>", quiz, name="quiz"),
    path("create", create, name="create"),
    path("delete/<int:id>", delete, name="delete"),
    path("patch/<int:id>", patch, name="patch")
]
