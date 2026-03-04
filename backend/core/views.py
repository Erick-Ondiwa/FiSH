from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend

from core.models import (
    County,
    SubCounty,
    FishSpecies,
    FishAgeGroup,
    FarmingMethod,
)

from core.serializers import (
    CountySerializer,
    SubCountySerializer,
    FishSpeciesSerializer,
    FishAgeGroupSerializer,
    FarmingMethodSerializer,
)

class CountyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for Counties.
    Used to populate location dropdowns.
    """
    queryset = County.objects.all().order_by("name")
    serializer_class = CountySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class SubCountyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for SubCounties.
    Supports filtering by county:
    /api/core/subcounties/?county=1
    """
    queryset = SubCounty.objects.select_related("county").all().order_by("name")
    serializer_class = SubCountySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["county"]


class FishSpeciesViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for Fish Species.
    """
    queryset = FishSpecies.objects.all().order_by("name")
    serializer_class = FishSpeciesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class FishAgeGroupViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for Fish Age Groups.
    """
    queryset = FishAgeGroup.objects.all().order_by("id")
    serializer_class = FishAgeGroupSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class FarmingMethodViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for Farming Methods.
    """
    queryset = FarmingMethod.objects.all().order_by("name")
    serializer_class = FarmingMethodSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
