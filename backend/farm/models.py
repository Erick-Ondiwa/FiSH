# farm/models.py

from django.db import models
from django.contrib.auth import get_user_model
from datetime import date

User = get_user_model()


# =========================================================
# 🟢 POND (PRIMARY CORE MODEL)
# =========================================================
class Pond(models.Model):
    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="pond",
        null=True,
        blank=True
    )

    # -------------------------
    # DIMENSIONS
    # -------------------------
    length = models.FloatField()
    width = models.FloatField()
    depth = models.FloatField()

    volume = models.FloatField(blank=True, null=True)

    # -------------------------
    # FISH DETAILS
    # -------------------------
    species = models.CharField(max_length=50)
    stocking_date = models.DateField()

    # -------------------------
    # POPULATION
    # -------------------------
    initial_count = models.IntegerField()
    current_count = models.IntegerField()

    # -------------------------
    # WEIGHT TRACKING (CRITICAL FOR ML)
    # -------------------------
    initial_avg_weight = models.FloatField(
        help_text="Average weight per fish at stocking (grams)"
    )
    current_avg_weight = models.FloatField(
        help_text="Current average weight per fish (grams)"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # -------------------------
    # AUTO COMPUTE
    # -------------------------
    def save(self, *args, **kwargs):
        self.volume = self.length * self.width * self.depth
        super().save(*args, **kwargs)

    # =========================================================
    # 📊 DERIVED METRICS (FOR DASHBOARD + ML)
    # =========================================================

    @property
    def biomass(self):
        """Total biomass (grams)"""
        return self.current_count * self.current_avg_weight

    @property
    def initial_biomass(self):
        """Biomass at stocking (grams)"""
        return self.initial_count * self.initial_avg_weight

    @property
    def weight_gain(self):
        """Average weight gain per fish (grams)"""
        return self.current_avg_weight - self.initial_avg_weight

    @property
    def total_weight_gain(self):
        """Total biomass gain (grams)"""
        return self.biomass - self.initial_biomass

    @property
    def survival_rate(self):
        """Percentage survival"""
        if self.initial_count == 0:
            return 0
        return (self.current_count / self.initial_count) * 100

    @property
    def stocking_density(self):
        """Fish per cubic meter"""
        if not self.volume:
            return 0
        return self.current_count / self.volume

    @property
    def age_days(self):
        """Days since stocking"""
        return (date.today() - self.stocking_date).days

    def __str__(self):
        return f"{self.owner.username}'s Pond"


# =========================================================
# 🌊 WATER QUALITY
# =========================================================
class WaterQuality(models.Model):
    pond = models.ForeignKey(
        Pond,
        on_delete=models.CASCADE,
        related_name="water_records"
    )

    temperature = models.FloatField()
    ph = models.FloatField()
    dissolved_oxygen = models.FloatField()

    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Water Record - {self.pond.owner.username} ({self.recorded_at})"