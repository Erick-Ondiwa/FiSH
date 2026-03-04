from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from accounts.models import FarmerProfile

from .models import (
    AdvisorySection,
    AdvisoryGuide,
    AdvisoryStep,
    UserOnboardingProgress,
)

from .serializers import (
    AdvisorySectionSerializer,
    AdvisoryGuideSerializer,
    UserOnboardingProgressSerializer,
)

# user = get_user_model()
class AdvisorySectionListView(APIView):
    """
    Returns sidebar sections:
    - Getting Started
    - Farming Place Setup
    - Sourcing Fish
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        sections = AdvisorySection.objects.filter(
            is_active=True
        ).order_by("order")

        serializer = AdvisorySectionSerializer(
            sections,
            many=True
        )

        return Response(serializer.data)

class AdvisoryGuideDetailView(APIView):
    """
    Returns context-aware guide based on:
    - Section slug
    - User profile configuration
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, slug):

        user = request.user
        try:
            profile = user.farmer_profile
        except FarmerProfile.DoesNotExist:
            return Response(
                profile,
                {"detail": "Farmer profile not found."},
                status=status.HTTP_400_BAD_REQUEST
            )
        section = get_object_or_404(
            AdvisorySection,
            slug=slug,
            is_active=True
        )

        guide = self._get_best_match_guide(section, profile)

        if not guide:
            return Response(
                {"detail": "No advisory guide available for your configuration."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AdvisoryGuideSerializer(
            guide,
            context={"request": request}
        )

        return Response(serializer.data)
    def _get_best_match_guide(self, section, profile):

        base_filter = {
            "section": section,
            "is_active": True,
        }

        if profile.farming_method:
            base_filter["farming_method"] = profile.farming_method

        if profile.fish_species:
            base_filter["fish_species"] = profile.fish_species

        if profile.age_group:
            base_filter["age_group"] = profile.age_group

        # Level 1: county + subcounty
        guide = AdvisoryGuide.objects.select_related(
            "section"
        ).prefetch_related(
            Prefetch("steps", queryset=AdvisoryStep.objects.order_by("step_number"))
        ).filter(
            county=profile.county,
            subcounty=profile.subcounty,
            **base_filter
        ).distinct().first()

        if guide:
            return guide

        # Level 2: county only
        guide = AdvisoryGuide.objects.filter(
            county=profile.county,
            subcounty__isnull=True,
            **base_filter
        ).distinct().first()

        if guide:
            return guide

        # Level 3: no region
        return AdvisoryGuide.objects.filter(
            county__isnull=True,
            subcounty__isnull=True,
            **base_filter
        ).distinct().first()
class UserOnboardingStatusView(APIView):
    """
    Default dashboard home.
    Shows onboarding completion progress.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):

        progress, _ = UserOnboardingProgress.objects.get_or_create(
            user=request.user
        )

        serializer = UserOnboardingProgressSerializer(progress)

        return Response(serializer.data)
