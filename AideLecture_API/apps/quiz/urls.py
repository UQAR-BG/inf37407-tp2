from django.urls import path, re_path

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from .views import quiz, specific_quiz

schema_view = get_schema_view(
    openapi.Info(
        title="Aide à l'apprentissage de la lecture API",
        default_version='v1',
        description="Aide à l'apprentissage de la lecture API",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="bastien.goulet@uqar.ca"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("quiz", quiz, name="quiz"),  # type: ignore
    path("quiz/<int:id>", specific_quiz, name="specific_quiz"),  # type: ignore
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger',
            cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc',
            cache_timeout=0), name='schema-redoc'),
]
