from django.db import models

class FarmingMethod(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class WaterSource(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class FishSpecies(models.Model):
    name = models.CharField(max_length=100, unique=True)
    scientific_name = models.CharField(max_length=150, blank=True)
    optimal_temperature_min = models.FloatField(null=True, blank=True)
    optimal_temperature_max = models.FloatField(null=True, blank=True)
    optimal_ph_min = models.FloatField(null=True, blank=True)
    optimal_ph_max = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class FishAgeGroup(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class County(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class SubCounty(models.Model):
    name = models.CharField(max_length=100)
    county = models.ForeignKey(
        County,
        on_delete=models.CASCADE,
        related_name='subcounties'
    )

    class Meta:
        unique_together = ('name', 'county')
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - {self.county.name}"
    
class ClimateZone(models.Model):
    name = models.CharField(max_length=100, unique=True)
    average_temperature = models.FloatField(null=True, blank=True)
    average_rainfall = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name
    