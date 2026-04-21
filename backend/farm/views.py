# farm/views.py

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Pond, WaterQuality
from .serializers import PondSerializer, WaterQualitySerializer


# =========================================================
# 🟢 POND: GET (single) + CREATE
# =========================================================
class PondView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Get current user's pond
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
        Create pond (ONLY ONE PER USER)
        """
        if Pond.objects.filter(owner=request.user).exists():
            return Response(
                {"detail": "Pond already exists. Use update instead."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PondSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save(owner=request.user)  # ✅ attach to user
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================================================
# 🟢 POND DETAIL: GET + UPDATE
# =========================================================
class PondDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, request):
        pond = Pond.objects.filter(owner=request.user).first()

        if not pond:
            return None

        return pond

    def get(self, request):
        pond = self.get_object(request)

        if not pond:
            return Response(
                {"detail": "No pond found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = PondSerializer(
            pond,
            context={"request": request}
        )
        return Response(serializer.data)

    def put(self, request):
        pond = self.get_object(request)

        if not pond:
            return Response(
                {"detail": "No pond found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = PondSerializer(
            pond,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()  # owner unchanged
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================================================
# 🌊 WATER QUALITY: GET + CREATE
# =========================================================
class WaterQualityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_pond(self, request):
        return Pond.objects.filter(owner=request.user).first()

    # -----------------------------
    # GET WATER HISTORY
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
    # CREATE WATER RECORD
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
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save(pond=pond)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # =========================================================
# # 🟢 POND DETAIL: GET + UPDATE
# # =========================================================
# class PondDetailView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get_object(self, request, pk):
#         return get_object_or_404(
#             Pond,
#             id=pk,
#             farm__owner=request.user  # ✅ secure ownership
#         )

#     def get(self, request, pk):
#         pond = self.get_object(request, pk)

#         serializer = PondSerializer(
#             pond,
#             context={"request": request}
#         )
#         return Response(serializer.data)

#     def put(self, request, pk):
#         pond = self.get_object(request, pk)

#         serializer = PondSerializer(
#             pond,
#             data=request.data,
#             partial=True,
#             context={"request": request}
#         )

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # =========================================================
# # 🌊 WATER QUALITY: PER POND (NOT GLOBAL)
# # =========================================================
# class WaterQualityView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get_pond(self, request, pond_id):
#         return get_object_or_404(
#             Pond,
#             id=pond_id,
#             farm__owner=request.user
#         )

#     # -----------------------------
#     # GET WATER QUALITY HISTORY
#     # -----------------------------
#     def get(self, request, pond_id):
#         pond = self.get_pond(request, pond_id)

#         records = WaterQuality.objects.filter(
#             pond=pond
#         ).order_by("-recorded_at")[:20]

#         serializer = WaterQualitySerializer(records, many=True)
#         return Response(serializer.data)

#     # -----------------------------
#     # CREATE WATER QUALITY RECORD
#     # -----------------------------
#     def post(self, request, pond_id):
#         pond = self.get_pond(request, pond_id)

#         serializer = WaterQualitySerializer(
#             data=request.data,
#             context={"request": request}
#         )

#         if serializer.is_valid():
#             serializer.save(pond=pond)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)