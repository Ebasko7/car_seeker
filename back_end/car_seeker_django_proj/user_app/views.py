from django.shortcuts import render
from django.db import transaction
from django.contrib.auth import authenticate
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
)
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from garage_app.models import Garage
from bounty_list_app.models import Bounty_list
from datetime import datetime, timedelta


class Sign_up(APIView):
    def post(self, request):
        with transaction.atomic():
            request.data["username"] = request.data["email"]
            app_user = User.objects.create_user(**request.data)
            Garage.objects.create(owner=app_user)
            Bounty_list.objects.create(user=app_user)
            token = Token.objects.create(user=app_user)

            return Response(
                {"username": app_user.email, "token": token.key},
                status=HTTP_201_CREATED,
            )


class Log_in(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        app_user = authenticate(username=email, password=password)
        if app_user:
            token, created = Token.objects.get_or_create(user=app_user)
            life_time = datetime.now() + timedelta(days=7)
            format_life_time = life_time.strftime("%a, %d %b %Y %H:%M:%S GMT")
            response = Response({"user": app_user.email})
            response.set_cookie(
                key="token",
                value=token.key,
                httponly=True,
                secure=True,
                samesite="Lax",
                expires=format_life_time,
            )
            return response
        else:
            return Response("No user matching credentials", status=HTTP_400_BAD_REQUEST)


class TokenReq(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


class Info(TokenReq):
    def get(self, request):
        return Response({"email": request.user.email})


class Log_out(TokenReq):
    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=HTTP_204_NO_CONTENT)


class Master_Sign_Up(APIView):

    def post(self, request):
        admin_user = User.objects.create_user(**request.data)
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        token = Token.objects.create(user=admin_user)
        return Response(
            {"admin_user": admin_user.email, "token": token.key},
            status=HTTP_201_CREATED,
        )
