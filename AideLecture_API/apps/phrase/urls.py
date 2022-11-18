from django.urls import path

from phrase.views import phrase, phrases, phrases_from_quiz, put, create, delete

urlpatterns = [
    path("phrases", phrases, name="phrases"),
    path("phrase/<int:id>", phrase, name="phrase"),
    path("put/<int:id>", put, name="put"),
    path("create", create, name="create"),
    path("delete/<int:id>", delete, name="delete"),
    path("from-quiz", phrases_from_quiz, name="phrases_from_quiz")
]
