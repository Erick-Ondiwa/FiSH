from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    FarmUnitViewSet,
    StockingRecordViewSet,
    FeedingLogViewSet,
    WaterQualityLogViewSet,
    GrowthLogViewSet,
    DiseaseIncidentViewSet,
    FarmDashboardView,
    FarmAlertsView,
)

app_name = "farm"

router = DefaultRouter()

# -------------------------------------------------------
# Core Resources
# -------------------------------------------------  ------
router.register(r"units", FarmUnitViewSet, basename="farm-units")
router.register(r"stocking", StockingRecordViewSet, basename="stocking")
router.register(r"feeding", FeedingLogViewSet, basename="feeding")
router.register(r"water", WaterQualityLogViewSet, basename="water")
router.register(r"growth", GrowthLogViewSet, basename="growth")
router.register(r"diseases", DiseaseIncidentViewSet, basename="diseases")

urlpatterns = [

    # -------------------------------------------------------
    # Router Endpoints
    # -------------------------------------------------------
    path("", include(router.urls)),

    # -------------------------------------------------------
    # Dashboard
    # GET /api/farm/dashboard/
    # -------------------------------------------------------
    path(
        "dashboard/",
        FarmDashboardView.as_view(),
        name="dashboard",
    ),

    # -------------------------------------------------------
    # Alerts
    # GET /api/farm/alerts/
    # -------------------------------------------------------
    path(
        "alerts/",
        FarmAlertsView.as_view(),
        name="alerts",
    ),
]