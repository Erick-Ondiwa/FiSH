from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.utils import timezone

User = settings.AUTH_USER_MODEL

from core.models import (
    County,
    SubCounty,
    FishSpecies,
    FishAgeGroup,
    FarmingMethod,
)
# ============================================================
# Advisory Section (Sidebar Navigation)
# ============================================================

class AdvisorySection(models.Model):
    """
    Represents sidebar navigation sections like:
    - Getting Started
    - Farming Place Setup
    - Sourcing Fish
    """

    SECTION_TYPE_CHOICES = [
        ("guide", "Guide"),
        ("module", "Module"),
    ]

    type = models.CharField(
        max_length=10,
        choices=SECTION_TYPE_CHOICES,
        default="guide"
    )

    module_key = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="Frontend module identifier (e.g., growth_prediction)"
    )

    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    icon = models.CharField(
        max_length=100,
        blank=True,
        help_text="Optional icon name for frontend UI"
    )

    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

# ============================================================
#  Advisory Guide (Context-Based Filtering)
# ============================================================

class AdvisoryGuide(models.Model):
    """
    Context-specific advisory guide.
    One section can have multiple guides depending on:
    - Farming Method
    - Fish Species
    - Age Group
    - Optional Region
    """

    section = models.ForeignKey(
        AdvisorySection,
        on_delete=models.CASCADE,
        related_name="guides"
    )

    farming_method = models.ForeignKey(
        FarmingMethod,
        on_delete=models.CASCADE,
        related_name="advisory_guides"
    )

    fish_species = models.ForeignKey(
        FishSpecies,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='advisory_guides'
    )

    age_group = models.ForeignKey(
        FishAgeGroup,
        on_delete=models.CASCADE,
        related_name="advisory_guides"
    )

    county = models.ForeignKey(
        County,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="advisory_guides"
    )

    subcounty = models.ForeignKey(
        SubCounty,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="advisory_guides"
    )

    introduction = models.TextField(
        blank=True,
        help_text="Optional introduction shown at top of guide"
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["farming_method", "fish_species", "age_group"]),
        ]

    def __str__(self):
        return f"{self.section.name} - {self.fish_species.name}"


# ============================================================
# Advisory Step (Ordered Steps + Images)
# ============================================================

class AdvisoryStep(models.Model):
    """
    Individual step inside a guide.
    Example:
    Step 1 – Prepare Pond
    Step 2 – Test Water
    Step 3 – Install Aeration
    """

    guide = models.ForeignKey(
        AdvisoryGuide,
        on_delete=models.CASCADE,
        related_name="steps"
    )

    step_number = models.PositiveIntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField()

    image = models.ImageField(
        upload_to="advisory/steps/",
        blank=True,
        null=True
    )

    video_url = models.URLField(blank=True, null=True)

    is_mandatory = models.BooleanField(
        default=True,
        help_text="Whether this step is required for onboarding completion"
    )

    class Meta:
        ordering = ["step_number"]
        unique_together = ("guide", "step_number")

    def __str__(self):
        return f"{self.guide.section.name} - Step {self.step_number}"

# ============================================================
#  User Onboarding Progress (Getting Started Engine)
# ============================================================

class UserOnboardingProgress(models.Model):
    """
    Tracks onboarding progress for 'Getting Started'
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="onboarding_progress"
    )

    farm_setup_completed = models.BooleanField(default=False)
    fish_sourcing_completed = models.BooleanField(default=False)

    completed_at = models.DateTimeField(null=True, blank=True)

    def overall_completion_percentage(self):
        total = 2
        completed = sum([
            self.farm_setup_completed,
            self.fish_sourcing_completed,
        ])
        return int((completed / total) * 100)

    def __str__(self):
        return f"Onboarding - {self.user.username}"


class Supplier(models.Model):
    """
    Represents verified suppliers such as hatcheries,
    feed distributors, or equipment providers.
    """

    class SupplierType(models.TextChoices):
        HATCHERY = "hatchery", "Hatchery"
        FEED_SUPPLIER = "feed_supplier", "Feed Supplier"
        EQUIPMENT_SUPPLIER = "equipment_supplier", "Equipment Supplier"

    name = models.CharField(max_length=255)

    supplier_type = models.CharField(
        max_length=50,
        choices=SupplierType.choices
    )

    county = models.ForeignKey(
        County,
        on_delete=models.CASCADE,
        related_name="suppliers"
    )

    subcounty = models.ForeignKey(
        SubCounty,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="suppliers"
    )

    fish_species = models.ManyToManyField(
        FishSpecies,
        blank=True,
        related_name="suppliers"
    )

    contact_phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)

    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["county", "supplier_type"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.supplier_type})"

class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name="conversations")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation {self.id}"

class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )

    content = models.TextField()
    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.content[:20]}"

class StockingGuideline(models.Model):
    """
    Provides recommended stocking practices for fish farming.
    """

    county = models.ForeignKey(
        County,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="stocking_guidelines"
    )

    fish_species = models.ForeignKey(
        FishSpecies,
        on_delete=models.CASCADE,
        related_name="stocking_guidelines"
    )

    farming_method = models.ForeignKey(
        FarmingMethod,
        on_delete=models.CASCADE,
        related_name="stocking_guidelines"
    )

    age_group = models.ForeignKey(
        FishAgeGroup,
        on_delete=models.CASCADE,
        related_name="stocking_guidelines"
    )

    # Core guideline fields
    recommended_density = models.CharField(
        max_length=100,
        help_text="e.g., 2–4 fish per m²"
    )

    min_stock = models.PositiveIntegerField(null=True, blank=True)
    max_stock = models.PositiveIntegerField(null=True, blank=True)

    water_volume_requirement = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="e.g., 1000L per 100 fish"
    )

    acclimatization_procedure = models.TextField()

    stocking_tips = models.TextField()

    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [
            models.Index(fields=["fish_species", "farming_method", "age_group"]),
        ]

    def __str__(self):
        return f"{self.fish_species.name} - {self.farming_method.name} ({self.age_group.name})"

class FishSourcing(models.Model):
    """
    Sourcing guidance for fish fingerlings/juveniles.
    """

    county = models.ForeignKey(
        County,
        on_delete=models.CASCADE,
        related_name="sourcing_guides"
    )

    fish_species = models.ForeignKey(
        FishSpecies,
        on_delete=models.CASCADE,
        related_name="sourcing_guides"
    )

    age_group = models.ForeignKey(
        FishAgeGroup,
        on_delete=models.CASCADE,
        related_name="sourcing_guides"
    )

    # Guidance
    sourcing_guidelines = models.TextField()

    recommended_sources = models.TextField(
        help_text="Where to buy (hatcheries, certified farms, etc.)"
    )

    transportation_tips = models.TextField(
        help_text="How to transport fish safely"
    )

    # Pricing
    average_price_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    average_price_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    # Metadata
    is_active = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=["county", "fish_species", "age_group"]),
        ]

    def __str__(self):
        return f"{self.fish_species.name} ({self.age_group.name}) in {self.county.name}"


class FishQualityChecklist(models.Model):
    """
    Checklist used to verify fish quality before purchase.
    """

    fish_species = models.ForeignKey(
        FishSpecies,
        on_delete=models.CASCADE,
        related_name="quality_checklists"
    )

    age_group = models.ForeignKey(
        FishAgeGroup,
        on_delete=models.CASCADE,
        related_name="quality_checklists"
    )

    # Checklist items
    physical_appearance = models.TextField(
        help_text="e.g., shiny skin, no wounds"
    )

    behavior = models.TextField(
        help_text="e.g., active swimming, responsive"
    )

    size_uniformity = models.TextField(
        help_text="e.g., similar sizes across batch"
    )

    health_indicators = models.TextField(
        help_text="e.g., no lesions, no discoloration"
    )

    rejection_signs = models.TextField(
        help_text="Conditions under which fish should NOT be purchased"
    )

    additional_notes = models.TextField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=["fish_species", "age_group"]),
        ]

    def __str__(self):
        return f"Quality Checklist - {self.fish_species.name} ({self.age_group.name})"

# ---------------------------------------------------------------------------------
#  FEEDING MODELS

class FeedingGuideline(models.Model):
    """
    Defines recommended feeding practices.
    """

    fish_species = models.ForeignKey(FishSpecies, on_delete=models.CASCADE)
    age_group = models.ForeignKey(FishAgeGroup, on_delete=models.CASCADE)
    farming_method = models.ForeignKey(FarmingMethod, on_delete=models.CASCADE)

    feeding_frequency_per_day = models.PositiveIntegerField(
        help_text="e.g., 2–3 times per day"
    )

    feed_type = models.CharField(max_length=100)
    feeding_percentage_body_weight = models.FloatField(
        help_text="e.g., 3% of body weight"
    )

    feeding_times = models.JSONField(
        help_text="Example: ['08:00', '13:00', '17:00']"
    )

    instructions = models.TextField()

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.fish_species} - {self.age_group}"