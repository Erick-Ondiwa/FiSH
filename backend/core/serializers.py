from rest_framework import serializers
from core.models import (
    County,
    SubCounty,
    FishSpecies,
    FishAgeGroup,
    FarmingMethod,
)


class CountySerializer(serializers.ModelSerializer):
    """
    Serializer for County lookup.
    """

    class Meta:
        model = County
        fields = ["id", "name"]


class SubCountySerializer(serializers.ModelSerializer):
    """
    Serializer for SubCounty lookup.
    """

    county_name = serializers.CharField(source="county.name", read_only=True)

    class Meta:
        model = SubCounty
        fields = ["id", "name", "county", "county_name"]


class FishSpeciesSerializer(serializers.ModelSerializer):
    """
    Serializer for Fish Species lookup.
    """

    class Meta:
        model = FishSpecies
        fields = ["id", "name"]


class FishAgeGroupSerializer(serializers.ModelSerializer):
    """
    Serializer for Fish Age Group lookup.
    """

    class Meta:
        model = FishAgeGroup
        fields = ["id", "name"]


class FarmingMethodSerializer(serializers.ModelSerializer):
    """
    Serializer for Farming Method lookup.
    """

    class Meta:
        model = FarmingMethod
        fields = ["id", "name"]
