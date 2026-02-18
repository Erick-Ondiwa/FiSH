from rest_framework import serializers
from advisory.models import AdvisoryContent
from advisory.models import FishSourcing
from advisory.models import Supplier
# from advisory.models.market import MarketPrice
from advisory.models import FishDisease

class AdvisoryContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvisoryContent
        fields = [
            "place_of_farming",
            "fish_species",
            "age_group",
            "setup_procedure",
            "feeding_guidelines",
            "disease_prevention",
            "water_management",
            "harvesting_tips",
            "sustainability_practices",
        ]

class FishSourcingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FishSourcing
        fields = [
            "fish_species",
            "age_group",
            "sourcing_guidelines",
            "average_price_range",
        ]

class SupplierSerializer(serializers.ModelSerializer):
    county = serializers.StringRelatedField()
    subcounty = serializers.StringRelatedField()

    class Meta:
        model = Supplier
        fields = [
            "id",
            "name",
            "supplier_type",
            "county",
            "subcounty",
            "contact_phone",
            "email",
        ]

class DiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FishDisease
        fields = [
            "name",
            "fish_species",
            "symptoms",
            "causes",
            "prevention",
            "treatment",
        ]
