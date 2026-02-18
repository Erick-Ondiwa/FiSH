from django.db import models
from django.utils import timezone
from core.models import (
    County,
    SubCounty,
    FishSpecies,
    FishAgeGroup,
    FarmingMethod,
)

class AdvisoryContent(models.Model):
    """
    Contextual advisory information based on:
    - Farming method
    - Species
    - Age group
    - Region (optional filtering)
    """

    # Context Filters (Optional Region Specificity)
    county = models.ForeignKey(
        County,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="advisories"
    )

    subcounty = models.ForeignKey(
        SubCounty,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="advisories"
    )

    farming_method = models.ForeignKey(
        FarmingMethod,
        on_delete=models.CASCADE,
        related_name="advisories"
    )

    fish_species = models.ForeignKey(
        FishSpecies,
        on_delete=models.CASCADE,
        related_name="advisories"
    )

    age_group = models.ForeignKey(
        FishAgeGroup,
        on_delete=models.CASCADE,
        related_name="advisories"
    )

    # Advisory Sections
    setup_procedure = models.TextField()
    feeding_guidelines = models.TextField()
    disease_prevention = models.TextField()
    water_management = models.TextField()
    harvesting_tips = models.TextField()
    sustainability_practices = models.TextField()

    # Metadata
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Advisory Content"
        verbose_name_plural = "Advisory Contents"
        indexes = [
            models.Index(fields=["farming_method", "fish_species", "age_group"]),
        ]

    def __str__(self):
        return f"{self.fish_species.name} - {self.farming_method.name} ({self.age_group.name})"

class FishDisease(models.Model):
    """
    Species-specific disease information.
    """

    name = models.CharField(max_length=255)

    fish_species = models.ForeignKey(
        FishSpecies,
        on_delete=models.CASCADE,
        related_name="diseases"
    )

    symptoms = models.TextField()
    causes = models.TextField()
    prevention = models.TextField()
    treatment = models.TextField()

    def __str__(self):
        return f"{self.name} ({self.fish_species.name})"

class FishSourcing(models.Model):
    """
    Sourcing guidance for fingerlings/juveniles by region and species.
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

    sourcing_guidelines = models.TextField()
    average_price_range = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Sourcing {self.fish_species.name} in {self.county.name}"

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
