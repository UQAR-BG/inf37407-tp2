from django.urls import path

from .views import question_word, specific_question_word

urlpatterns = [
    path("word", question_word, name="question_word"),  # type: ignore
    path("word/<int:id>", specific_question_word,
         name="specific_question_word"),  # type: ignore
]
