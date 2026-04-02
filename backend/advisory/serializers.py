from rest_framework import serializers
from .models import Conversation, Message
from django.contrib.auth import get_user_model
from .models import (
    AdvisorySection,
    AdvisoryGuide,
    AdvisoryStep,
    Supplier,
    UserOnboardingProgress,
    FishSourcing,
    StockingGuideline,
    FishQualityChecklist,
)
User = get_user_model()

class AdvisorySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvisorySection
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "icon",
            "order",
            'type',
            'module_key',
        )

class AdvisoryStepSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = AdvisoryStep
        fields = [
            "id",
            "step_number",
            "title",
            "description",
            "image_url",
            "video_url",
            "is_mandatory",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None


class AdvisoryGuideSerializer(serializers.ModelSerializer):
    section = serializers.SerializerMethodField()
    steps = AdvisoryStepSerializer(many=True)

    # 🔹 Dynamic additions
    stocking = serializers.SerializerMethodField()
    sourcing = serializers.SerializerMethodField()
    quality_check = serializers.SerializerMethodField()

    class Meta:
        model = AdvisoryGuide
        fields = [
            "id",
            "section",
            "introduction",
            "steps",
            "stocking",
            "sourcing",
            "quality_check",
        ]

    def get_section(self, obj):
        return {
            "title": obj.section.name,
            "slug": obj.section.slug,
        }

    # ---------------------------------------------------
    # Dynamic Attachments
    # ---------------------------------------------------

    def get_stocking(self, obj):

        profile = self.context.get("profile")

        guideline = StockingGuideline.objects.filter(
            fish_species=profile.fish_species,
            farming_method=profile.farming_method,
            age_group=profile.age_group,
            is_active=True
        ).first()

        if guideline:
            return StockingGuidelineSerializer(guideline).data

        return None

    def get_sourcing(self, obj):

        profile = self.context.get("profile")

        sourcing = FishSourcing.objects.filter(
            county=profile.county,
            fish_species=profile.fish_species,
            age_group=profile.age_group,
            is_active=True
        ).first()

        if sourcing:
            return FishSourcingSerializer(sourcing).data

        return None

    def get_quality_check(self, obj):

        profile = self.context.get("profile")

        checklist = FishQualityChecklist.objects.filter(
            fish_species=profile.fish_species,
            age_group=profile.age_group,
            is_active=True
        ).first()

        if checklist:
            return FishQualityChecklistSerializer(checklist).data

        return None

class SupplierSerializer(serializers.ModelSerializer):
    """
    Serializes supplier data for frontend consumption.
    Includes readable related fields and species list.
    """

    county = serializers.CharField(source="county.name", read_only=True)
    subcounty = serializers.CharField(source="subcounty.name", read_only=True)

    fish_species = serializers.SerializerMethodField()

    class Meta:
        model = Supplier
        fields = [
            "id",
            "name",
            "supplier_type",
            "county",
            "subcounty",
            "fish_species",
            "contact_phone",
            "email",
        ]

    # ---------------------------------------------------
    # Custom Fields
    # ---------------------------------------------------

    def get_fish_species(self, obj):
        """
        Returns list of species names
        """
        return [species.name for species in obj.fish_species.all()]

# Supplier chat
class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class MessageSerializer(serializers.ModelSerializer):
    sender = UserMiniSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "content", "is_read", "created_at"]


class ConversationSerializer(serializers.ModelSerializer):
    participants = UserMiniSerializer(many=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "participants", "messages"]

class UserOnboardingProgressSerializer(serializers.ModelSerializer):
    completion_percentage = serializers.SerializerMethodField()

    class Meta:
        model = UserOnboardingProgress
        fields = (
            "farm_setup_completed",
            "fish_sourcing_completed",
            "completion_percentage",
        )

    def get_completion_percentage(self, obj):
        return obj.overall_completion_percentage()
    
# StockingGuide serializer

class StockingGuidelineSerializer(serializers.ModelSerializer):
    fish_species = serializers.CharField(source="fish_species.name")
    farming_method = serializers.CharField(source="farming_method.name")
    age_group = serializers.CharField(source="age_group.name")
    county = serializers.CharField(source="county.name", allow_null=True)

    class Meta:
        model = StockingGuideline
        fields = [
            "id",
            "fish_species",
            "farming_method",
            "age_group",
            "county",
            "recommended_density",
            "min_stock",
            "max_stock",
            "water_volume_requirement",
            "acclimatization_procedure",
            "stocking_tips",
        ]
# FishSourcing Serializer

class FishSourcingSerializer(serializers.ModelSerializer):
    fish_species = serializers.CharField(source="fish_species.name")
    age_group = serializers.CharField(source="age_group.name")
    county = serializers.CharField(source="county.name")

    class Meta:
        model = FishSourcing
        fields = [
            "id",
            "fish_species",
            "age_group",
            "county",
            "sourcing_guidelines",
            "recommended_sources",
            "transportation_tips",
            "average_price_min",
            "average_price_max",
        ]


class FishQualityChecklistSerializer(serializers.ModelSerializer):
    fish_species = serializers.CharField(source="fish_species.name")
    age_group = serializers.CharField(source="age_group.name")

    class Meta:
        model = FishQualityChecklist
        fields = [
            "id",
            "fish_species",
            "age_group",
            "physical_appearance",
            "behavior",
            "size_uniformity",
            "health_indicators",
            "rejection_signs",
            "additional_notes",
        ]