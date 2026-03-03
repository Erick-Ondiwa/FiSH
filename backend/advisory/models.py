from django.db import models
from django.conf import settings
from django.utils.text import slugify

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
