from rest_framework import serializers

class GrowthPredictionSerializer(serializers.Serializer):
    species = serializers.ChoiceField(choices=['Tilapia', 'Trout', 'Catfish', 'Nile Perch'])
    initial_weight = serializers.FloatField()
    days = serializers.IntegerField()
    temperature = serializers.FloatField()
    oxygen = serializers.FloatField()
    ph = serializers.FloatField()
    density = serializers.FloatField()
    feeding_rate = serializers.FloatField()