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
    symptoms = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )

    recent_deaths = serializers.BooleanField(required=False, default=False)

    death_rate = serializers.FloatField(required=False, default=0.0)

    # Optional validation
    def validate_death_rate(self, value):
        if value < 0:
            raise serializers.ValidationError("Death rate cannot be negative.")
        return value