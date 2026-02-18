from django.contrib import admin
from .models import (
    FarmingMethod,
    WaterSource,
    FishSpecies,
    FishAgeGroup,
    County,
    SubCounty,
    ClimateZone,
)

# -------------------------------------------------
# Farming Method
# -------------------------------------------------
@admin.register(FarmingMethod)
class FarmingMethodAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)
    ordering = ("name",)

# -------------------------------------------------
# Water Source
# -------------------------------------------------
@admin.register(WaterSource)
class WaterSourceAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    ordering = ("name",)

# -------------------------------------------------
# Fish Species
# -------------------------------------------------
@admin.register(FishSpecies)
class FishSpeciesAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "scientific_name",
        "optimal_temperature_min",
        "optimal_temperature_max",
        "optimal_ph_min",
        "optimal_ph_max",
    )
    search_fields = ("name", "scientific_name")
    ordering = ("name",)

# -------------------------------------------------
# Fish Age Group
# -------------------------------------------------
@admin.register(FishAgeGroup)
class FishAgeGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)
    ordering = ("name",)

# -------------------------------------------------
# SubCounty Inline (VERY IMPORTANT)
# -------------------------------------------------
class SubCountyInline(admin.TabularInline):
    model = SubCounty
    extra = 1

# -------------------------------------------------
# County
# -------------------------------------------------
@admin.register(County)
class CountyAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    ordering = ("name",)
    inlines = [SubCountyInline]   # 👈 lets you add subcounties inside county

# -------------------------------------------------
# SubCounty (Standalone view too)
# -------------------------------------------------
@admin.register(SubCounty)
class SubCountyAdmin(admin.ModelAdmin):
    list_display = ("name", "county")
    list_filter = ("county",)
    search_fields = ("name",)
    ordering = ("name",)

# -------------------------------------------------
# Climate Zone
# -------------------------------------------------
@admin.register(ClimateZone)
class ClimateZoneAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "average_temperature",
        "average_rainfall",
    )
    search_fields = ("name",)
    ordering = ("name",)
