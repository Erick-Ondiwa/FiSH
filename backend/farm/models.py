from django.db import models
from django.conf import settings
from django.utils import timezone

from core.models import (
    FishSpecies,
    FishAgeGroup,
    FarmingMethod,
)

# -------------------------------------------------------
# Farm Unit (Pond / Cage / Tank)
# -------------------------------------------------------

class FarmUnit(models.Model):
    """
    Represents a physical farming unit:
    pond, cage, tank, etc.
    """

    class UnitType(models.TextChoices):
        POND = "pond", "Pond"
        CAGE = "cage", "Cage"
        TANK = "tank", "Tank"
        OTHER = "other", "Other"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="farm_units"
    )

    name = models.CharField(max_length=100)

    unit_type = models.CharField(
        max_length=20,
        choices=UnitType.choices
    )

    farming_method = models.ForeignKey(
        FarmingMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    size = models.FloatField(help_text="Size in square meters", null=True, blank=True)
    depth = models.FloatField(help_text="Depth in meters", null=True, blank=True)

    location_description = models.CharField(max_length=255, blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.unit_type})"


# -------------------------------------------------------
# Stocking Record
# -------------------------------------------------------

class StockingRecord(models.Model):
    """
    Records stocking events into a farm unit.
    """

    farm_unit = models.ForeignKey(
        FarmUnit,
        on_delete=models.CASCADE,
        related_name="stockings"
    )

    fish_species = models.ForeignKey(
        FishSpecies,
        on_delete=models.CASCADE
    )

    age_group = models.ForeignKey(
        FishAgeGroup,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    quantity = models.PositiveIntegerField()
    average_weight = models.FloatField(
        help_text="Initial average weight (grams)",
        null=True,
        blank=True
    )

    stocking_date = models.DateField(default=timezone.now)

    source = models.CharField(
        max_length=255,
        help_text="Supplier or hatchery",
        blank=True
    )

    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.fish_species.name} - {self.quantity} stocked"


# -------------------------------------------------------
# Feeding Log
# -------------------------------------------------------

class FeedingLog(models.Model):
    """
    Tracks feeding activities per farm unit.
    """

    farm_unit = models.ForeignKey(
        FarmUnit,
        on_delete=models.CASCADE,
        related_name="feeding_logs"
    )

    feed_type = models.CharField(max_length=100)
    quantity = models.FloatField(help_text="Feed amount (kg)")

    feeding_time = models.DateTimeField(default=timezone.now)

    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.feed_type} - {self.quantity}kg"


# -------------------------------------------------------
# Water Quality Log
# -------------------------------------------------------

class WaterQualityLog(models.Model):
    """
    Tracks environmental conditions.
    Critical for fish survival.
    """

    farm_unit = models.ForeignKey(
        FarmUnit,
        on_delete=models.CASCADE,
        related_name="water_logs"
    )

    temperature = models.FloatField(help_text="°C")
    ph = models.FloatField(help_text="pH level")
    dissolved_oxygen = models.FloatField(help_text="mg/L")

    turbidity = models.FloatField(null=True, blank=True)
    ammonia = models.FloatField(null=True, blank=True)

    recorded_at = models.DateTimeField(default=timezone.now)

    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Water Log ({self.recorded_at.date()})"


# -------------------------------------------------------
# Growth Monitoring
# -------------------------------------------------------

class GrowthLog(models.Model):
    """
    Tracks fish growth over time.
    Used for prediction (harvest readiness).
    """

    farm_unit = models.ForeignKey(
        FarmUnit,
        on_delete=models.CASCADE,
        related_name="growth_logs"
    )

    sample_size = models.PositiveIntegerField(
        help_text="Number of fish sampled"
    )

    average_weight = models.FloatField(
        help_text="Average weight in grams"
    )

    recorded_at = models.DateField(default=timezone.now)

    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Growth {self.average_weight}g"


# -------------------------------------------------------
# Disease Incidents
# -------------------------------------------------------

class DiseaseIncident(models.Model):
    """
    Records disease outbreaks or suspected cases.
    """

    class SeverityLevel(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        CRITICAL = "critical", "Critical"

    farm_unit = models.ForeignKey(
        FarmUnit,
        on_delete=models.CASCADE,
        related_name="disease_incidents"
    )

    disease_name = models.CharField(max_length=255)

    symptoms = models.TextField()

    severity = models.CharField(
        max_length=20,
        choices=SeverityLevel.choices
    )

    action_taken = models.TextField(blank=True)

    reported_at = models.DateTimeField(default=timezone.now)

    resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.disease_name} ({self.severity})"