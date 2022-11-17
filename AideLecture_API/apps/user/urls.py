from django.urls import path

from user.views import register, login, logout, list_users, user, whoami, update_participant, delete_participant

urlpatterns = [
    path("register", register, name="register"),
    path("login", login, name="login"),
    path("logout", logout, name="logout"),
    path("users", list_users, name="list_users"),
    path("user/<int:id>", user, name="get_user"),
    path("whoami", whoami, name="who_am_i"),
    path("update/<int:id>", update_participant, name="update_participant"),
    path("delete/<int:id>", delete_participant, name="delete_participant")
]
