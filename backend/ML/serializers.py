from rest_framework import serializers

class GrowthPredictionSerializer(serializers.Serializer):
    Species = serializers.CharField()
    temperature = serializers.FloatField()
    oxygen = serializers.FloatField()
    ph = serializers.FloatField()
    density = serializers.FloatField()
    feeding_rate = serializers.FloatField()
    initial_weight = serializers.FloatField()
    days = serializers.IntegerField()

class DiseasePredictionSerializer(serializers.Serializer):
    species = serializers.CharField()
    age_group = serializers.CharField()

    symptoms = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=True
    )

    temperature = serializers.FloatField()
    ph = serializers.FloatField()
    oxygen = serializers.FloatField()
    stocking_density = serializers.FloatField()
    water_source = serializers.CharField()

    recent_deaths = serializers.IntegerField()  # 0 or 1
    death_rate = serializers.FloatField()