from django.urls import path, include
from rest_framework.routers import DefaultRouter

from core.views import (
    CountyViewSet,
    SubCountyViewSet,
    FishSpeciesViewSet,
    FishAgeGroupViewSet,
    FarmingMethodViewSet,
)

app_name = "core"

router = DefaultRouter()
router.register(r"counties", CountyViewSet, basename="county")
router.register(r"subcounties", SubCountyViewSet, basename="subcounty")
router.register(r"fish-species", FishSpeciesViewSet, basename="fish-species")
router.register(r"age-groups", FishAgeGroupViewSet, basename="age-group")
router.register(r"farming-methods", FarmingMethodViewSet, basename="farming-method")

urlpatterns = [
    path("", include(router.urls)),
]
