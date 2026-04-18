# farm/serializers.py
from rest_framework import serializers
from .models import Pond, WaterQuality

from .models import Pond


class PondSerializer(serializers.ModelSerializer):
    # -----------------------------
    # DERIVED FIELDS (READ-ONLY)
    # -----------------------------
    biomass = serializers.ReadOnlyField()
    initial_biomass = serializers.ReadOnlyField()
    weight_gain = serializers.ReadOnlyField()
    total_weight_gain = serializers.ReadOnlyField()
    survival_rate = serializers.ReadOnlyField()
    age_days = serializers.ReadOnlyField()

    class Meta:
        model = Pond
        fields = [
            "id",
            "owner",

            "length",
            "width",
            "depth",
            "volume",

            "species",
            "stocking_date",

            "initial_count",
            "current_count",

            "initial_avg_weight",
            "current_avg_weight",

            "created_at",

            # Derived
            "biomass",
            "initial_biomass",
            "weight_gain",
            "total_weight_gain",
            "survival_rate",
            "age_days",
        ]

        # ✅ Prevent client from sending these
        read_only_fields = [
            "owner",
            "volume",
            "created_at",

            # Derived always read-only
            "biomass",
            "initial_biomass",
            "weight_gain",
            "total_weight_gain",
            "survival_rate",
            "age_days",
        ]

    # -----------------------------
    # VALIDATION (Optional but Recommended)
    # -----------------------------
    def validate(self, data):
        """
        Ensure logical consistency of pond data
        """

        # Prevent negative or zero dimensions
        for field in ["length", "width", "depth"]:
            value = data.get(field)
            if value is not None and value <= 0:
                raise serializers.ValidationError(
                    {field: "Must be greater than 0."}
                )

        # Counts must be positive
        for field in ["initial_count", "current_count"]:
            value = data.get(field)
            if value is not None and value < 0:
                raise serializers.ValidationError(
                    {field: "Cannot be negative."}
                )

        # Weights must be positive
        for field in ["initial_avg_weight", "current_avg_weight"]:
            value = data.get(field)
            if value is not None and value <= 0:
                raise serializers.ValidationError(
                    {field: "Must be greater than 0."}
                )

        return data

class WaterQualitySerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterQuality
        fields = "__all__"
        read_only_fields = ["pond", "recorded_at"]

    def create(self, validated_data):
        """
        DO NOT handle user logic here.
        Pond is assigned in the view.
        """
        return super().create(validated_data)