# farm/views.py
from rest_framework import permissions, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Pond, WaterQuality
from .serializers import PondSerializer, WaterQualitySerializer

# =========================================================
# 🟢 POND: GET (single) + POST
# =========================================================
from django.shortcuts import get_object_or_404


class PondView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Get current user's pond (single object)
        """
        pond = Pond.objects.filter(owner=request.user).first()

        if not pond:
            return Response(
                {"detail": "No pond found. Create one."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = PondSerializer(
            pond,
            context={"request": request}
        )
        return Response(serializer.data)

    def post(self, request):
        """
        Create pond (only one per user)
        """
        if hasattr(request.user, "pond"):
            return Response(
                {"detail": "Pond already exists. Use update instead."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PondSerializer(
            data=request.data,
            context={"request": request}   # ✅ FIX
        )

        if serializer.is_valid():
            serializer.save(owner=request.user)  # ✅ ownership handled here
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PondDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, request, pk):
        return get_object_or_404(Pond, id=pk, owner=request.user)

    def get(self, request, pk):
        pond = self.get_object(request, pk)

        serializer = PondSerializer(
            pond,
            context={"request": request} 
        )
        return Response(serializer.data)

    def put(self, request, pk):
        pond = self.get_object(request, pk)

        serializer = PondSerializer(
            pond,
            data=request.data,
            partial=True,
            context={"request": request}   # ✅ FIX
        )

        if serializer.is_valid():
            serializer.save()  # owner unchanged
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================================================
# WATER QUALITY: POST + GET HISTORY
# =========================================================

class WaterQualityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_pond(self, request):
        return Pond.objects.filter(owner=request.user).first()

    # -----------------------------
    # GET WATER QUALITY HISTORY
    # -----------------------------
    def get(self, request):
        pond = self.get_pond(request)

        if not pond:
            return Response(
                {"detail": "No pond found"},
                status=status.HTTP_404_NOT_FOUND
            )

        records = WaterQuality.objects.filter(
            pond=pond
        ).order_by("-recorded_at")[:20]

        serializer = WaterQualitySerializer(records, many=True)
        return Response(serializer.data)

    # -----------------------------
    # CREATE WATER QUALITY RECORD
    # -----------------------------
    def post(self, request):
        pond = self.get_pond(request)

        if not pond:
            return Response(
                {"detail": "Create pond first"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = WaterQualitySerializer(
            data=request.data,
            context={"request": request}  # (optional but safe)
        )

        if serializer.is_valid():
            serializer.save(pond=pond)  # ✅ single source of truth
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)