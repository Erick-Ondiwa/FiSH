from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model

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

    def post(self, request):
        """
        Step 1: Create a new user and auto-generate username.
        Also create an empty FarmerProfile linked to the new user
        so subsequent steps can update it.
        """
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # ✅ Automatically create related FarmerProfile
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
