from rest_framework import serializers
from advisory.serializers.advisory_serializers import (
    AdvisoryContentSerializer,
    FishSourcingSerializer,
    DiseaseSerializer,
)

class SpeciesAdvisoryBundleSerializer(serializers.Serializer):
    species = serializers.CharField()
    age_group = serializers.CharField()

    advisory = AdvisoryContentSerializer(allow_null=True)
    sourcing = FishSourcingSerializer(allow_null=True)
    # market = MarketSerializer(allow_null=True)
    diseases = DiseaseSerializer(many=True)

class DashboardSerializer(serializers.Serializer):
    welcome_message = serializers.CharField()
    species_advisories = SpeciesAdvisoryBundleSerializer(many=True)
