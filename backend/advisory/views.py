from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from django.contrib.auth import get_user_model

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.exceptions import ValidationError

User = get_user_model()

from accounts.models import FarmerProfile

from .models import *

from .serializers import *

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

        # ---------------------------------------------------
        # Validate Farmer Profile
        # ---------------------------------------------------
        try:
            profile = user.farmer_profile
        except FarmerProfile.DoesNotExist:
            return Response(
                {"detail": "Farmer profile not found."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------------------------------------------
        # Get Section
        # ---------------------------------------------------
        section = get_object_or_404(
            AdvisorySection,
            slug=slug,
            is_active=True
        )

        # ---------------------------------------------------
        # Get Best Matching Guide
        # ---------------------------------------------------
        guide = self._get_best_match_guide(section, profile)

        if not guide:
            return Response(
                {"detail": "No advisory guide available for your configuration."},
                status=status.HTTP_404_NOT_FOUND
            )

        # ---------------------------------------------------
        # Serialize (IMPORTANT: pass profile)
        # ---------------------------------------------------
        serializer = AdvisoryGuideSerializer(
            guide,
            context={
                "request": request,
                "profile": profile
            }
        )

        return Response(serializer.data)
    def _get_best_match_guide(self, section, profile):

        # Base queryset (optimized once)
        queryset = AdvisoryGuide.objects.select_related(
            "section",
            "county",
            "subcounty",
            "farming_method",
            "fish_species",
            "age_group",
        ).prefetch_related(
            Prefetch("steps", queryset=AdvisoryStep.objects.order_by("step_number"))
        )

        base_filter = {
            "section": section,
            "is_active": True,
        }

        # ---------------------------------------------------
        # Handle profile filters safely
        # ---------------------------------------------------

        if profile.farming_method:
            base_filter["farming_method"] = profile.farming_method

        if profile.age_group:
            base_filter["age_group"] = profile.age_group

        # ⚠️ CRITICAL: fish_species handling
        if hasattr(profile.fish_species, "all"):  # ManyToMany
            species_qs = profile.fish_species.all()
            if species_qs.exists():
                base_filter["fish_species__in"] = species_qs
        elif profile.fish_species:
            base_filter["fish_species"] = profile.fish_species

        # ---------------------------------------------------
        # LEVEL 1: county + subcounty
        # ---------------------------------------------------
        guide = queryset.filter(
            county=profile.county,
            subcounty=profile.subcounty,
            **base_filter
        ).distinct().first()

        if guide:
            return guide

        # ---------------------------------------------------
        # LEVEL 2: county only
        # ---------------------------------------------------
        guide = queryset.filter(
            county=profile.county,
            subcounty__isnull=True,
            **base_filter
        ).distinct().first()

        if guide:
            return guide

        # ---------------------------------------------------
        # LEVEL 3: no region
        # ---------------------------------------------------
        guide = queryset.filter(
            county__isnull=True,
            subcounty__isnull=True,
            **base_filter
        ).distinct().first()

        if guide:
            return guide

        # ---------------------------------------------------
        # LEVEL 4: weakest fallback (ignore farming method)
        # ---------------------------------------------------
        fallback_filter = {
            "section": section,
            "is_active": True,
        }

        if profile.age_group:
            fallback_filter["age_group"] = profile.age_group

        if hasattr(profile.fish_species, "all"):
            species_qs = profile.fish_species.all()
            if species_qs.exists():
                fallback_filter["fish_species__in"] = species_qs

        return queryset.filter(**fallback_filter).distinct().first()


class SupplierListView(ListAPIView):
    """
    Returns verified suppliers filtered by:
    - User's county
    - Optional fish species
    - Optional supplier type (query param)

    Example:
    GET /api/advisory/suppliers/?type=hatchery
    """

    permission_classes = [IsAuthenticated]
    serializer_class = SupplierSerializer

    def get_queryset(self):
        user = self.request.user

        # ------------------------------------------
        # Ensure farmer profile exists
        # ------------------------------------------
        if not hasattr(user, "farmer_profile"):
            return Supplier.objects.none()

        profile = user.farmer_profile

        queryset = Supplier.objects.filter(
            is_verified=True
        ).select_related(
            "county", "subcounty"
        ).prefetch_related(
            "fish_species"
        )

        # ------------------------------------------
        # Filter by county (PRIMARY FILTER)
        # ------------------------------------------
        if profile.county:
            queryset = queryset.filter(county=profile.county)

        # ------------------------------------------
        # Filter by fish species (if available)
        # ------------------------------------------
        # if profile.fish_species.exists():
        #     queryset = queryset.filter(
        #         fish_species__in=profile.fish_species.all()
        #     )

        # ------------------------------------------
        # Optional: Filter by supplier type
        # Example: ?type=hatchery
        # ------------------------------------------
        supplier_type = self.request.query_params.get("type")
        if supplier_type:
            queryset = queryset.filter(supplier_type=supplier_type)

        # ------------------------------------------
        # Remove duplicates (M2M safety)
        # ------------------------------------------
        return queryset.distinct()

# Start or get coonversation
class StartConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        other_user_id = request.data.get("user_id")

        # other_user = User.objects.get(id=other_user_id)

        # Check existing conversation
        convo = Conversation.objects.filter(
            participants=user
        ).filter(
            # participants=other_user
        ).distinct().first()

        if not convo:
            convo = Conversation.objects.create()
            convo.participants.add(user)

        return Response({"conversation_id": convo.id})

from .models import Message
from .serializers import MessageSerializer

# Fetch message
class ConversationMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        messages = Message.objects.filter(
            conversation_id=conversation_id
        ).order_by("created_at")

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

# Send Messsaage
class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, conversation_id):
        message = Message.objects.create(
            conversation_id=conversation_id,
            sender=request.user,
            content=request.data.get("content")
        )

        return Response({
            "id": message.id,
            "content": message.content,
            "created_at": message.created_at
        })


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
    
class StockingGuidelineView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.farmer_profile

        guideline = StockingGuideline.objects.filter(
            fish_species=profile.fish_species,
            farming_method=profile.farming_method,
            age_group=profile.age_group
        ).first()

        serializer = StockingGuidelineSerializer(guideline)
        return Response(serializer.data)
    
class FishSourcingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.farmer_profile

        sourcing = FishSourcing.objects.filter(
            county=profile.county,
            fish_species=profile.fish_species,
            age_group=profile.age_group
        ).first()

        serializer = FishSourcingSerializer(sourcing)
        return Response(serializer.data)

class FishQualityChecklistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.farmer_profile

        checklist = FishQualityChecklist.objects.filter(
            fish_species=profile.fish_species,
            age_group=profile.age_group
        ).first()

        serializer = FishQualityChecklistSerializer(checklist)
        return Response(serializer.data)
