from django.urls import path

from result.views import results, result, result_from_user, my_results, post

urlpatterns = [
    path("results", results, name="results"),
    path("result/<int:id>", result, name="result"),
    path("result-from-user/<int:userId>",
         result_from_user, name="result_from_user"),
    path("my-results", my_results, name="my_results"),
    path("post", post, name="post")
]
