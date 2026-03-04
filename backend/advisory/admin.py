from django.contrib import admin
from django.utils.html import format_html

from .models import (
    AdvisorySection,
    AdvisoryGuide,
    AdvisoryStep,
    UserOnboardingProgress,
)


# ============================================================
# 1️⃣ Advisory Step Inline (Editable inside Guide)
# ============================================================

class AdvisoryStepInline(admin.TabularInline):
    model = AdvisoryStep
    extra = 1
    fields = (
        "step_number",
        "title",
        "description",
        "is_mandatory",
        "image_preview",
        "image",
        "video_url",
    )
    readonly_fields = ("image_preview",)
    ordering = ("step_number",)

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="80" height="80" style="object-fit:cover;" />',
                obj.image.url
            )
        return "-"
    image_preview.short_description = "Preview"


# ============================================================
# 2️⃣ Advisory Section Admin (Sidebar Items)
# ============================================================

@admin.register(AdvisorySection)
class AdvisorySectionAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order",)


# ============================================================
# 3️⃣ Advisory Guide Admin (Context-Specific Guides)
# ============================================================

@admin.register(AdvisoryGuide)
class AdvisoryGuideAdmin(admin.ModelAdmin):
    list_display = (
        "section",
        "fish_species",
        "farming_method",
        "age_group",
        "county",
        "is_active",
        "created_at",
    )

    list_filter = (
        "section",
        "fish_species",
        "farming_method",
        "age_group",
        "county",
        "is_active",
    )

    search_fields = (
        "section__name",
        "fish_species__name",
        "farming_method__name",
    )

    inlines = [AdvisoryStepInline]

    autocomplete_fields = (
        "fish_species",
        "farming_method",
        "age_group",
        "county",
        "subcounty",
    )

    list_select_related = (
        "section",
        "fish_species",
        "farming_method",
        "age_group",
        "county",
        "subcounty",
    )


# ============================================================
# 4️⃣ Advisory Step Standalone Admin (Optional)
# ============================================================

@admin.register(AdvisoryStep)
class AdvisoryStepAdmin(admin.ModelAdmin):
    list_display = (
        "guide",
        "step_number",
        "title",
        "description",
        "is_mandatory",
    )

    list_filter = (
        "guide__section",
        "is_mandatory",
    )

    search_fields = (
        "title",
        "description",
    )

    ordering = ("guide", "step_number")

    list_select_related = ("guide",)


# ============================================================
# 5️⃣ User Onboarding Progress Admin
# ============================================================

@admin.register(UserOnboardingProgress)
class UserOnboardingProgressAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "farm_setup_completed",
        "fish_sourcing_completed",
        "completion_percentage",
    )

    readonly_fields = ("completion_percentage",)

    search_fields = ("user__username", "user__email")

    def completion_percentage(self, obj):
        return f"{obj.overall_completion_percentage()}%"
    completion_percentage.short_description = "Completion"
