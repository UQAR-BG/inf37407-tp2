from django.urls import path

from .views import quiz, specific_quiz

urlpatterns = [
    path("quiz", quiz, name="quiz"),  # type: ignore
    path("quiz/<int:id>", specific_quiz, name="specific_quiz"),  # type: ignore
]
