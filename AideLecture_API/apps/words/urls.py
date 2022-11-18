from django.urls import path

from words.views import word, words, put, create, delete

urlpatterns = [
    path("words", words, name="words"),
    path("put/<int:id>", put, name="put"),
    path("create", create, name="create"),
    path("delete/<int:id>", delete, name="delete"),
    path("word/<int:id>", word, name="word"),
]
