# farm/serializers.py

from rest_framework import serializers
from .models import Pond, WaterQuality


# =========================================================
# 🟢 POND SERIALIZER
# =========================================================
class PondSerializer(serializers.ModelSerializer):
    # -----------------------------
    # DERIVED FIELDS (SAFE + EXPLICIT)
    # -----------------------------
    biomass = serializers.SerializerMethodField()
    initial_biomass = serializers.SerializerMethodField()
    weight_gain = serializers.SerializerMethodField()
    total_weight_gain = serializers.SerializerMethodField()
    survival_rate = serializers.SerializerMethodField()
    age_days = serializers.SerializerMethodField()
    stocking_density = serializers.SerializerMethodField()

    class Meta:
        model = Pond
        fields = [
            "id",
            "owner",  # optional (read-only)

            # Dimensions
            "length",
            "width",
            "depth",
            "volume",

            # Fish info
            "species",
            "age_group",
            "stocking_date",

            # Population
            "initial_count",
            "current_count",

            # Weight
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
            "stocking_density",
        ]

        read_only_fields = [
            "owner",
            "volume",
            "created_at",

            # Always computed
            "biomass",
            "initial_biomass",
            "weight_gain",
            "total_weight_gain",
            "survival_rate",
            "age_days",
            "stocking_density",
        ]

    # =========================================================
    # DERIVED FIELD METHODS
    # =========================================================
    def get_biomass(self, obj):
        return obj.biomass

    def get_initial_biomass(self, obj):
        return obj.initial_biomass

    def get_weight_gain(self, obj):
        return obj.weight_gain

    def get_total_weight_gain(self, obj):
        return obj.total_weight_gain

    def get_survival_rate(self, obj):
        return obj.survival_rate

    def get_age_days(self, obj):
        return obj.age_days

    def get_stocking_density(self, obj):
        return obj.stocking_density

    # =========================================================
    # VALIDATION
    # =========================================================
    def validate(self, data):
        # Dimensions must be > 0
        for field in ["length", "width", "depth"]:
            value = data.get(field)
            if value is not None and value <= 0:
                raise serializers.ValidationError(
                    {field: "Must be greater than 0."}
                )

        # Counts must be >= 0
        for field in ["initial_count", "current_count"]:
            value = data.get(field)
            if value is not None and value < 0:
                raise serializers.ValidationError(
                    {field: "Cannot be negative."}
                )

        # Weights must be > 0
        for field in ["initial_avg_weight", "current_avg_weight"]:
            value = data.get(field)
            if value is not None and value <= 0:
                raise serializers.ValidationError(
                    {field: "Must be greater than 0."}
                )

        return data


# =========================================================
# 🌊 WATER QUALITY SERIALIZER
# =========================================================
class WaterQualitySerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterQuality
        fields = "__all__"
        read_only_fields = ["pond", "recorded_at"]

    def create(self, validated_data):
        return super().create(validated_data)