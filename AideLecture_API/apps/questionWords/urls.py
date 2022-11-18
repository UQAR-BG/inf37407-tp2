from django.urls import path

from questionWords.views import question_word, question_words, put, create, delete

urlpatterns = [
    path("question_words", question_words, name="question_words"),
    path("put/<int:id>", put, name="put"),
    path("create", create, name="create"),
    path("delete/<int:id>", delete, name="delete"),
    path("question_word/<int:id>", question_word, name="question_word"),
]
