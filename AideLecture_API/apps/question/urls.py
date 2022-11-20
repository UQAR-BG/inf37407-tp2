from django.urls import path

from question.views import question, questions, questions_from_quiz, put, create, delete, add_answer, put_answer, delete_answer

urlpatterns = [
    path("questions", questions, name="questions"),
    path("question/<int:id>", question, name="question"),
    path("create", create, name="create"),
    path("delete/<int:id>", delete, name="delete"),
    path("put/<int:id>", put, name="put"),
    path("add_answer", add_answer, name="add_answer"),
    path("delete_answer/<int:id>", delete_answer, name="delete_answer"),
    path("put_answer/<int:id>", put_answer, name="put_answer"),
    path("from-quiz", questions_from_quiz, name="questions_from_quiz")
]
