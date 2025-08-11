from django.views import View
from django.http import JsonResponse
import os
import json
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, authentication, parsers

from .serializers import UserSerializer, RegisterSerializer, UpdateProfileSerializer

User = get_user_model()

@method_decorator(csrf_protect, name='dispatch')
class SuperUserCreateView(View):
    def post(self, request):
        if request.content_type != 'application/json':
            return JsonResponse({'error': 'Invalid content type'}, status=400)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        if data.get("secret") != os.getenv("SUPERUSER_SECRET_KEY"):
            return JsonResponse({"error": "Unauthorized"}, status=403)

        required_fields = ['username', 'email', 'name', 'password']
        if not all(data.get(field) for field in required_fields):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        if User.objects.filter(username=data['username']).exists():
            return JsonResponse({'error': 'Username already taken'}, status=400)

        user = User.objects.create_superuser(
            username=data['username'],
            email=data['email'],
            name=data['name'],
            password=data['password'],
        )
        return JsonResponse({'message': 'Superuser created successfully'}, status=201)


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFTokenView(APIView):
    authentication_classes = []  # allow anonymous
    permission_classes = []
    def get(self, request):
        return Response({"detail": "CSRF cookie set"})


# -- Register (manual: name,email,username,password) --
@method_decorator(csrf_protect, name='dispatch')
class RegisterView(APIView):
    authentication_classes = []   # anonymous allowed
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # auto-login (optional)
            login(request, user)
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -- Login (username + password) --
@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    authentication_classes = []   # anonymous allowed (CSRF required)
    permission_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({"detail":"Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        login(request, user)  # creates session cookie
        return Response(UserSerializer(user).data)


# -- Logout --
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        logout(request)
        return Response({"detail":"Logged out"})


# -- whoami: returns current logged-in user --
class WhoAmIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        return Response(UserSerializer(request.user).data)


# -- Complete / update profile (phone, address, profile_pic) --
@method_decorator(csrf_protect, name='dispatch')
class UpdateProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def patch(self, request):
        serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -- require profile completion endpoint: enforce phone+address required after registration --
class CompleteProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        phone = request.data.get("phone")
        address = request.data.get("address")
        if not phone or not address:
            return Response({"detail":"phone and address required"}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        user.phone = phone
        user.address = address
        if 'profile_pic' in request.FILES:
            user.profile_pic = request.FILES['profile_pic']
        user.save()
        return Response(UserSerializer(user).data)


# -- Delete own user --
class DeleteUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        # session cookie removed automatically on subsequent requests
        return Response({"detail":"User deleted"})


# -- Admin-only: delete any user by id (optional) --
class AdminDeleteUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, user_id):
        try:
            u = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail":"Not found"}, status=status.HTTP_404_NOT_FOUND)
        if u.is_superuser:
            return Response({"detail":"Cannot delete superuser"}, status=status.HTTP_403_FORBIDDEN)
        u.delete()
        return Response({"detail":"User deleted"})