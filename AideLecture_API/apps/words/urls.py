from django.urls import path

from .views import word, specific_word

urlpatterns = [
    path("word", word, name="word"),  # type: ignore
    path("word/<int:id>", specific_word,
         name="specific_word"),  # type: ignore
]
