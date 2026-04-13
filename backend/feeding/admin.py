from django.contrib import admin
from .models import Feed


@admin.register(Feed)
class FeedAdmin(admin.ModelAdmin):

    # -----------------------------------
    # LIST VIEW (TABLE DISPLAY)
    # -----------------------------------
    list_display = (
        "name",
        "species",
        "age_group",
        "role",
        "form",
        "protein_percent",
        "cost_per_kg",
        "is_active",
        "created_at",
    )

    # -----------------------------------
    # FILTERS (RIGHT SIDEBAR)
    # -----------------------------------
    list_filter = (
        "species",
        "age_group",
        "role",
        "form",
        "is_active",
    )

    # -----------------------------------
    # SEARCH BAR
    # -----------------------------------
    search_fields = (
        "name",
        "species",
        "age_group",
        "description",
    )

    # -----------------------------------
    # DEFAULT ORDERING
    # -----------------------------------
    ordering = ("-created_at",)

    # -----------------------------------
    # EDITABLE IN LIST VIEW
    # -----------------------------------
    list_editable = ("is_active",)

    # -----------------------------------
    # FIELD GROUPING (FORM VIEW)
    # -----------------------------------
    fieldsets = (
        ("Basic Information", {
            "fields": ("name", "description")
        }),

        ("Applicability", {
            "fields": ("species", "age_group")
        }),

        ("Functional Role", {
            "fields": ("role",)
        }),

        ("Nutritional Profile", {
            "fields": (
                "protein_percent",
                "fat_percent",
                "fiber_percent",
                "moisture_percent",
            )
        }),

        ("Feed Type", {
            "fields": ("form",)
        }),

        ("Cost & Availability", {
            "fields": ("cost_per_kg", "is_active")
        }),

        ("Metadata", {
            "fields": ("created_at",),
            "classes": ("collapse",),  # collapsible section
        }),
    )

    # -----------------------------------
    # READ-ONLY FIELDS
    # -----------------------------------
    readonly_fields = ("created_at",)

    # -----------------------------------
    # PAGINATION
    # -----------------------------------
    list_per_page = 20