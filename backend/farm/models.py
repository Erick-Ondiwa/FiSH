# farm/models/farm.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Farm(models.Model):
    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="farm"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner.username}'s Farm"

class Pond(models.Model):


    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="pond"
    )

    length = models.FloatField()
    width = models.FloatField()
    depth = models.FloatField()

    volume = models.FloatField(blank=True, null=True)

    # Fish-related (single species assumption)
    species = models.CharField(max_length=50)
    stocking_date = models.DateField()

    # Population
    initial_count = models.IntegerField()
    current_count = models.IntegerField()

    # Weight tracking (IMPORTANT)
    initial_avg_weight = models.FloatField(
        help_text="Average weight per fish at stocking (grams)"
    )
    current_avg_weight = models.FloatField(
        help_text="Current average weight per fish (grams)"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-compute pond volume
        self.volume = self.length * self.width * self.depth
        super().save(*args, **kwargs)

    # -------------------------
    # Derived Metrics
    # -------------------------

    @property
    def biomass(self):
        """
        Total biomass (grams)
        """
        return self.current_count * self.current_avg_weight

    @property
    def initial_biomass(self):
        """
        Biomass at stocking (grams)
        """
        return self.initial_count * self.initial_avg_weight

    @property
    def weight_gain(self):
        """
        Average weight gain per fish (grams)
        """
        return self.current_avg_weight - self.initial_avg_weight

    @property
    def total_weight_gain(self):
        """
        Total biomass gain (grams)
        """
        return self.biomass - self.initial_biomass

    @property
    def survival_rate(self):
        """
        Percentage survival
        """
        if self.initial_count == 0:
            return 0
        return (self.current_count / self.initial_count) * 100

    @property
    def age_days(self):
        """
        Dynamic age calculation (no need to store in DB)
        """
        from datetime import date
        return (date.today() - self.stocking_date).days


class WaterQuality(models.Model):
    pond = models.ForeignKey(
        "Pond",
        on_delete=models.CASCADE,
        related_name="water_records"
    )

    temperature = models.FloatField()
    ph = models.FloatField()
    dissolved_oxygen = models.FloatField()

    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Water Record - {self.pond.owner.username}"