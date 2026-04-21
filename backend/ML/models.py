from django.db import models

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