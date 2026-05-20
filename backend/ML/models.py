from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class GrowthSnapshot(models.Model):
    plan = models.ForeignKey(
        "feeding.FeedingPlan",
        on_delete=models.CASCADE,
        related_name="growth_snapshots"
    )

    date = models.DateField()

    # -------- FEATURES ----------
    feeding_frequency = models.IntegerField()
    feeding_consistency = models.FloatField()
    avg_protein = models.FloatField()

    temperature = models.FloatField()
    oxygen = models.FloatField()
    ph = models.FloatField()

    stocking_density = models.FloatField()
    current_weight = models.FloatField()

    # -------- OUTPUT ----------
    predicted_weight = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)


class DiseaseLog(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="disease_logs"
    )

    pond = models.ForeignKey(
        "farm.Pond",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="disease_logs"
    )

    # -------------------------
    # INPUT DATA
    # -------------------------
    species = models.CharField(max_length=50)
    age_group = models.CharField(max_length=50)

    temperature = models.FloatField()
    ph = models.FloatField()
    oxygen = models.FloatField()
    stocking_density = models.FloatField()

    recent_deaths = models.IntegerField()
    death_rate = models.FloatField()

    symptoms = models.JSONField()

    # -------------------------
    # OUTPUT
    # -------------------------
    predicted_disease = models.CharField(max_length=100)
    confidence = models.FloatField(null=True, blank=True)

    severity = models.CharField(max_length=50)

    priority_actions = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    prevention = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.predicted_disease} ({self.created_at.date()})"