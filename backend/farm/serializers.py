from rest_framework import serializers

from .models import (
    FarmUnit,
    StockingRecord,
    FeedingLog,
    WaterQualityLog,
    GrowthLog,
    DiseaseIncident,
)

from core.models import FishSpecies, FishAgeGroup, FarmingMethod


# -------------------------------------------------------
# Helper Serializers (Readable Fields)
# -------------------------------------------------------

class FishSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FishSpecies
        fields = ["id", "name"]


class FishAgeGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = FishAgeGroup
        fields = ["id", "name"]


class FarmingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmingMethod
        fields = ["id", "name"]


# -------------------------------------------------------
# Farm Unit Serializer
# -------------------------------------------------------

class FarmUnitSerializer(serializers.ModelSerializer):
    farming_method = FarmingMethodSerializer(read_only=True)
    farming_method_id = serializers.PrimaryKeyRelatedField(
        queryset=FarmingMethod.objects.all(),
        source="farming_method",
        write_only=True,
        required=False
    )

    class Meta:
        model = FarmUnit
        fields = [
            "id",
            "name",
            "unit_type",
            "farming_method",
            "farming_method_id",
            "size",
            "depth",
            "location_description",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)


# -------------------------------------------------------
# Stocking Record Serializer
# -------------------------------------------------------

class StockingRecordSerializer(serializers.ModelSerializer):
    fish_species = FishSpeciesSerializer(read_only=True)
    fish_species_id = serializers.PrimaryKeyRelatedField(
        queryset=FishSpecies.objects.all(),
        source="fish_species",
        write_only=True
    )

    age_group = FishAgeGroupSerializer(read_only=True)
    age_group_id = serializers.PrimaryKeyRelatedField(
        queryset=FishAgeGroup.objects.all(),
        source="age_group",
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = StockingRecord
        fields = [
            "id",
            "farm_unit",
            "fish_species",
            "fish_species_id",
            "age_group",
            "age_group_id",
            "quantity",
            "average_weight",
            "stocking_date",
            "source",
            "notes",
        ]


# -------------------------------------------------------
# Feeding Log Serializer
# -------------------------------------------------------

class FeedingLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = FeedingLog
        fields = [
            "id",
            "farm_unit",
            "feed_type",
            "quantity",
            "feeding_time",
            "notes",
        ]


# -------------------------------------------------------
# Water Quality Serializer
# -------------------------------------------------------

class WaterQualityLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = WaterQualityLog
        fields = [
            "id",
            "farm_unit",
            "temperature",
            "ph",
            "dissolved_oxygen",
            "turbidity",
            "ammonia",
            "recorded_at",
            "notes",
        ]


# -------------------------------------------------------
# Growth Log Serializer
# -------------------------------------------------------

class GrowthLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = GrowthLog
        fields = [
            "id",
            "farm_unit",
            "sample_size",
            "average_weight",
            "recorded_at",
            "notes",
        ]


# -------------------------------------------------------
# Disease Incident Serializer
# -------------------------------------------------------

class DiseaseIncidentSerializer(serializers.ModelSerializer):

    class Meta:
        model = DiseaseIncident
        fields = [
            "id",
            "farm_unit",
            "disease_name",
            "symptoms",
            "severity",
            "action_taken",
            "reported_at",
            "resolved",
        ]


# -------------------------------------------------------
# Dashboard / Summary Serializer (IMPORTANT)
# -------------------------------------------------------

class FarmUnitDashboardSerializer(serializers.ModelSerializer):
    """
    Aggregated view for dashboard.
    """

    latest_growth = serializers.SerializerMethodField()
    latest_water = serializers.SerializerMethodField()

    class Meta:
        model = FarmUnit
        fields = [
            "id",
            "name",
            "unit_type",
            "latest_growth",
            "latest_water",
        ]

    def get_latest_growth(self, obj):
        latest = obj.growth_logs.order_by("-recorded_at").first()
        if not latest:
            return None
        return {
            "average_weight": latest.average_weight,
            "date": latest.recorded_at,
        }

    def get_latest_water(self, obj):
        latest = obj.water_logs.order_by("-recorded_at").first()
        if not latest:
            return None
        return {
            "temperature": latest.temperature,
            "ph": latest.ph,
            "oxygen": latest.dissolved_oxygen,
        }