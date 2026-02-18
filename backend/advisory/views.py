from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from advisory.services.advisory_service import AdvisoryService
   
from advisory.serializers.dashboard_serializers import DashboardSerializer

from advisory.models import FishDisease
from advisory.models import Supplier
from advisory.serializers.advisory_serializers import DiseaseSerializer, SupplierSerializer, FishSourcingSerializer

from advisory.models import FishSourcing

class SpeciesAdvisoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, species_id):
        user = request.user

        if not hasattr(user, "farmer_profile"):
            return Response(
                {"detail": "Farmer profile not found"},
                status=400
            )

        profile = user.farmer_profile

        bundle = AdvisoryService.get_species_bundle(
            profile=profile,
            species_id=species_id
        )

        return Response(bundle)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = AdvisoryService.get_dashboard_context(request.user)
        return Response(data)

class DiseaseListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DiseaseSerializer

    def get_queryset(self):
        user = self.request.user

        if not hasattr(user, "farmer_profile"):
            return FishDisease.objects.none()

        profile = user.farmer_profile

        return FishDisease.objects.filter(
            fish_species__in=profile.fish_species.all()
        )


class SourcingListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FishSourcingSerializer

    def get_queryset(self):
        user = self.request.user

        if not hasattr(user, "farmer_profile"):
            return FishSourcing.objects.none()

        profile = user.farmer_profile
        species_id = self.request.query_params.get("species")

        queryset = FishSourcing.objects.filter(
            county=profile.county,
            age_group=profile.age_group
        )

        if species_id:
            queryset = queryset.filter(fish_species_id=species_id)

        return queryset


class SupplierListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SupplierSerializer

    def get_queryset(self):
        user = self.request.user

        if not hasattr(user, "farmer_profile"):
            return Supplier.objects.none()

        profile = user.farmer_profile
        species_id = self.request.query_params.get("species")

        queryset = Supplier.objects.filter(
            county=profile.county,
            is_verified=True
        )

        if species_id:
            queryset = queryset.filter(fish_species__id=species_id)

        return queryset.distinct()

