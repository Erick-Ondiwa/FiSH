from django.urls import path
from .views import PondView, PondDetailView, WaterQualityView

app_name = "farm"

urlpatterns = [
    # LIST + CREATE
    path("pond/", PondView.as_view(), name="pond"),

    # UPDATE (and optionally GET single)
    path("pond/<int:pk>/", PondDetailView.as_view(), name="pond-detail"),

    # WATER QUALITY
    path("water-quality/", WaterQualityView.as_view(), name="water-quality"),
]