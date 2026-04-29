from django.conf import settings
from django.db import models
from django.utils import timezone

from django.contrib.auth import get_user_model

User = get_user_model()

# --------------------------------------------------
# 1. FEED CATEGORY (FOR BALANCED DIETS)
# --------------------------------------------------
class FeedCategory(models.TextChoices):
    PROTEIN = "protein", "Protein"
    ENERGY = "energy", "Energy"
    VITAMINS = "vitamins", "Vitamins"
    MINERALS = "minerals", "Minerals"
    OTHER = " other", "Other"

# --------------------------------------------------
# 2. FEED MODEL
# --------------------------------------------------
# --------------------------------------------------
# 2. FEED MODEL (IMPROVED)
# --------------------------------------------------
class Feed(models.Model):

    # -------------------------
    # BASIC INFO
    # -------------------------
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    # -------------------------
    # APPLICABILITY
    # -------------------------
    species = models.CharField(max_length=50)
    age_group = models.CharField(max_length=50)

    # -------------------------
    # FUNCTIONAL ROLE (CRITICAL)
    # -------------------------
    ROLE_CHOICES = [
        ("primary", "Primary Feed"),        # Main growth feed
        ("booster", "Growth Booster"),      # High protein
        ("supplement", "Supplement"),       # Vitamins / minerals
        ("energy", "Energy Feed"),          # Carbohydrates/fats
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="primary"
    )

    # -------------------------
    # NUTRITIONAL PROFILE
    # -------------------------
    protein_percent = models.FloatField()
    fat_percent = models.FloatField(null=True, blank=True)
    fiber_percent = models.FloatField(null=True, blank=True)
    moisture_percent = models.FloatField(null=True, blank=True)

    # -------------------------
    # FEED TYPE (PHYSICAL FORM)
    # -------------------------
    FORM_CHOICES = [
        ("pellet", "Pellet"),
        ("crumble", "Crumble"),
        ("powder", "Powder"),
        ("live", "Live Feed"),
    ]

    form = models.CharField(
        max_length=20,
        choices=FORM_CHOICES,
        default="pellet"
    )

    # -------------------------
    # COST (FOR FUTURE OPTIMIZATION)
    # -------------------------
    cost_per_kg = models.FloatField(null=True, blank=True)

    # -------------------------
    # ACTIVE FLAG
    # -------------------------
    is_active = models.BooleanField(default=True)

    # -------------------------
    # META
    # -------------------------
    created_at = models.DateTimeField(default=timezone.now())

    def __str__(self):
        return f"{self.name} ({self.role})"


# --------------------------------------------------
# 3. FEEDING PLAN (CONFIGURATION)
# --------------------------------------------------
class FeedingPlan(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="feeding_plans"
    )
    pond = models.ForeignKey(
        "farm.Pond",
        on_delete=models.CASCADE,
        related_name="feeding_plans",
        null=True,
        blank=True
    )

    species = models.CharField(max_length=50)
    age_group = models.CharField(max_length=50)

    #  CORE CONFIG
    meals_per_day = models.PositiveIntegerField(default=2)
    feeding_interval_hours = models.FloatField(default=8)

    # Optional: exact start time of first meal
    start_time = models.TimeField(default=timezone.now)

    start_date = models.DateField(auto_now_add=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.species} feeding plan"
# --------------------------------------------------
# 4. FEEDING DAY (STRUCTURE PER DAY)
# --------------------------------------------------
class FeedingDay(models.Model):
    plan = models.ForeignKey(
        FeedingPlan,
        on_delete=models.CASCADE,
        related_name="days"
    )

    day_number = models.PositiveIntegerField()

    date = models.DateField()

    class Meta:
        unique_together = ("plan", "day_number")
        ordering = ["day_number"]

    def __str__(self):
        return f"{self.plan} - Day {self.day_number}"


# --------------------------------------------------
# 5. FEEDING SESSION (CORE ENGINE)
# --------------------------------------------------
class FeedingSession(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("missed", "Missed"),
    ]

    feeding_day = models.ForeignKey(
        FeedingDay,
        on_delete=models.CASCADE,
        related_name="sessions"
    )

    # Meal number within the day
    session_number = models.PositiveIntegerField()

    #  SCHEDULING (CRITICAL)
    scheduled_time = models.DateTimeField()

    # Feeds assigned for this session
    feeds = models.ManyToManyField(Feed, blank=True)

    # Status tracking
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="pending"
    )

    confirmed_at = models.DateTimeField(null=True, blank=True)

    # Optional: track quantity (future AI)
    quantity_grams = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("feeding_day", "session_number")
        ordering = ["scheduled_time"]

    def __str__(self):
        return f"{self.feeding_day} - Meal {self.session_number} ({self.status})"


class FeedingHistory(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="feeding_history"
    )

    plan = models.ForeignKey(
        "feeding.FeedingPlan",
        on_delete=models.CASCADE,
        related_name="history"
    )

    session = models.ForeignKey(
        "feeding.FeedingSession",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # 📊 Execution Data
    fed_at = models.DateTimeField(auto_now_add=True)
    quantity_kg = models.FloatField(null=True, blank=True)

    # Feed composition
    feeds = models.ManyToManyField("feeding.Feed", blank=True)

    # 📈 Context snapshot (important for ML later)
    water_temperature = models.FloatField(null=True, blank=True)
    oxygen = models.FloatField(null=True, blank=True)
    ph = models.FloatField(null=True, blank=True)

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)