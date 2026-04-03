from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Prefetch

from .models import (
    FarmUnit,
    StockingRecord,
    FeedingLog,
    WaterQualityLog,
    GrowthLog,
    DiseaseIncident,
)

from .serializers import (
    FarmUnitSerializer,
    StockingRecordSerializer,
    FeedingLogSerializer,
    WaterQualityLogSerializer,
    GrowthLogSerializer,
    DiseaseIncidentSerializer,
    FarmUnitDashboardSerializer,
)

# -------------------------------------------------------
# Permissions
# -------------------------------------------------------

class IsOwner(permissions.BasePermission):
    """
    Ensures user only accesses their farm data.
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


# -------------------------------------------------------
# Farm Unit ViewSet
# -------------------------------------------------------

class FarmUnitViewSet(viewsets.ModelViewSet):
    """
    CRUD for farm units (ponds, cages, tanks)
    """

    serializer_class = FarmUnitSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return FarmUnit.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# -------------------------------------------------------
# Stocking ViewSet
# -------------------------------------------------------

class StockingRecordViewSet(viewsets.ModelViewSet):
    """
    Manage stocking records
    """

    serializer_class = StockingRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StockingRecord.objects.filter(
            farm_unit__owner=self.request.user
        )

# -------------------------------------------------------
# Feeding Logs
# -------------------------------------------------------

class FeedingLogViewSet(viewsets.ModelViewSet):
    """
    Feeding activity tracking
    """

    serializer_class = FeedingLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FeedingLog.objects.filter(
            farm_unit__owner=self.request.user
        ).order_by("-feeding_time")


# -------------------------------------------------------
# Water Quality Logs
# -------------------------------------------------------

class WaterQualityLogViewSet(viewsets.ModelViewSet):
    """
    Environmental monitoring
    """

    serializer_class = WaterQualityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WaterQualityLog.objects.filter(
            farm_unit__owner=self.request.user
        ).order_by("-recorded_at")


# -------------------------------------------------------
# Growth Logs
# -------------------------------------------------------

class GrowthLogViewSet(viewsets.ModelViewSet):
    """
    Growth monitoring
    """

    serializer_class = GrowthLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return GrowthLog.objects.filter(
            farm_unit__owner=self.request.user
        ).order_by("-recorded_at")


# -------------------------------------------------------
# Disease Incidents
# -------------------------------------------------------

class DiseaseIncidentViewSet(viewsets.ModelViewSet):
    """
    Disease reporting and tracking
    """

    serializer_class = DiseaseIncidentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DiseaseIncident.objects.filter(
            farm_unit__owner=self.request.user
        ).order_by("-reported_at")

# -------------------------------------------------------
# Dashboard API (IMPORTANT)
# -------------------------------------------------------

class FarmDashboardView(APIView):
    """
    Returns summarized farm data for dashboard.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        farm_units = FarmUnit.objects.filter(owner=request.user).prefetch_related(
            "growth_logs",
            "water_logs"
        )

        serializer = FarmUnitDashboardSerializer(farm_units, many=True)

        return Response({
            "farm_units": serializer.data
        })

# -------------------------------------------------------
# Alerts API (Optional but Powerful)
# -------------------------------------------------------

class FarmAlertsView(APIView):
    """
    Generates basic alerts (can later integrate AI).
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        alerts = []

        water_logs = WaterQualityLog.objects.filter(
            farm_unit__owner=request.user
        ).order_by("-recorded_at")[:10]

        for log in water_logs:
            if log.ph < 6.5 or log.ph > 8.5:
                alerts.append({
                    "type": "water",
                    "message": f"Abnormal pH ({log.ph}) in {log.farm_unit.name}"
                })

            if log.dissolved_oxygen < 5:
                alerts.append({
                    "type": "oxygen",
                    "message": f"Low oxygen ({log.dissolved_oxygen} mg/L)"
                })

        return Response({"alerts": alerts})