from django.http import HttpResponse
from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from django.utils.timezone import get_current_timezone
from datetime import datetime

from drf_yasg.utils import swagger_auto_schema

# Create your views here.


def phrases(request):
    if request.method == "GET":
        return HttpResponse("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'/><title>Phrases Page</title></head><body>Hello There</body></html>")
