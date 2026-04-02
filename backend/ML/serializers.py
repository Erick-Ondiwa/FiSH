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

    