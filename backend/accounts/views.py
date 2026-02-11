from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token

from rest_framework.permissions import IsAuthenticated

from django.contrib.auth import authenticate, login, get_user_model
from django.middleware.csrf import get_token
from django.http import JsonResponse

from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserLoginSerializer

from .serializers import UserLoginSerializer

from .models import FarmerProfile
from .serializers import (
    UserRegistrationSerializer,
    FarmerProfileSerializer,
    CompleteFarmerRegistrationSerializer
)

User = get_user_model()
# -------------------------------------------------------------
# ✅ STEP 1 — BASIC PERSONAL DETAILS
# -------------------------------------------------------------
class RegisterStepOneAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        """
        Retrieve existing user details (used when going back to step 1)
        """
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserRegistrationSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Step 1: Create a new user and auto-generate username.
        Also create an empty FarmerProfile linked to the new user
        so subsequent steps can update it.
        """
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Automatically create related FarmerProfile
            FarmerProfile.objects.create(user=user)

            return Response({
                "message": "Step 1 completed successfully.",
                "user_id": user.id,
                "username": user.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        """
        Allow partial update of personal details
        (e.g., if the user edits before proceeding).
        """
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserRegistrationSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User details updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------------------------------------
# ✅ STEP 2 — LOCATION DETAILS
# -------------------------------------------------------------
class RegisterStepTwoAPIView(APIView):
    permission_classes = [AllowAny]
    def patch(self, request, pk):
        """
        Step 2: Update the location details of the existing FarmerProfile.
        The pk here refers to the user_id (from Step 1).
        """
        try:
            profile = FarmerProfile.objects.get(user_id=pk)
        except FarmerProfile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = FarmerProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Step 2 completed successfully — location details updated."
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        """
        Optional: If you ever want to create a profile manually (rarely used).
        """
        serializer = FarmerProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response({
                "message": "Profile created successfully.",
                "profile_id": profile.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------------------------------------
# Step 3 — Farming Details
# -------------------------------------------------------------
class RegisterStepThreeAPIView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, pk):
        """
        Update farming details (Save and Continue)
        """
        try:
            profile = FarmerProfile.objects.get(user_id=pk)
        except FarmerProfile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = FarmerProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Farming details updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------------------------------------
# ✅ STEP 4 — CONFIRMATION & REVIEW
# -------------------------------------------------------------
class RegisterStepFourAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        try:
            user = User.objects.get(id=pk)
            profile = FarmerProfile.objects.get(user=user)
        except (User.DoesNotExist, FarmerProfile.DoesNotExist):
            return Response({"error": "User or profile not found."}, status=status.HTTP_404_NOT_FOUND)

        profile.is_registration_complete = True
        profile.save()

        return Response({
            "message": "Registration completed successfully!",
            "user_id": user.id,
            "username": user.username,
            "profile_id": profile.id,
        }, status=status.HTTP_200_OK)

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response = Response(
            {
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "role": user.role,
                },
            },
            status=status.HTTP_200_OK,
        )

        # ✅ Secure cookies
        response.set_cookie(
            key="access",
            value=str(access),
            httponly=True,
            secure=True,
            samesite="Lax",
        )

        response.set_cookie(
            key="refresh",
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite="Lax",
        )

        return response

class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass

        response = Response(
            {"message": "Logout successful"},
            status=status.HTTP_200_OK,
        )

        response.delete_cookie("access")
        response.delete_cookie("refresh")

        return response


def get_csrf_token(request):
    """
    Return CSRF token as JSON.
    """
    return JsonResponse({"csrfToken": get_token(request)})


