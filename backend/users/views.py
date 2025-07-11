from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from .models import User
from .serializers import UserSerializer, UserRegisterSerializer


# Set CSRF cookie
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFTokenView(APIView):
    def get(self, request):
        return JsonResponse({'message': 'CSRF cookie set'})


# Login View (POST with username and password)
class LoginView(APIView):
    def post(self, request):
        print('Request data:', request.data)
        username = request.data.get('username')
        password = request.data.get('password')
        print('Username:', username)
        print('Password:', password)
        user = authenticate(request, username=username, password=password)
        print('Authenticated user:', user)
        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data)
        else:
            return Response({'error': 'Invalid credentials'},
                            status=status.HTTP_400_BAD_REQUEST)


# Registration View
class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Protected User List View
class UserListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        users = User.objects.all()
        return Response(UserSerializer(users, many=True).data)
