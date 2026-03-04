from django.urls import path

from .views import (
    AdvisorySectionListView,
    AdvisoryGuideDetailView,
    UserOnboardingStatusView,
)

app_name = "advisory"

urlpatterns = [

    # -------------------------------------------------------
    # Sidebar Sections
    # GET /api/advisory/sections/
    # -------------------------------------------------------
    path(
        "sections/",
        AdvisorySectionListView.as_view(),
        name="advisory-sections",
    ),

    # -------------------------------------------------------
    # Context-Aware Guide
    # GET /api/advisory/guide/<slug>/
    # Example:
    # /api/advisory/guide/farming-place-setup/
    # -------------------------------------------------------
    path(
        "guide/<slug:slug>/",
        AdvisoryGuideDetailView.as_view(),
        name="advisory-guide-detail",
    ),

    # -------------------------------------------------------
    # Getting Started (Onboarding)
    # GET /api/advisory/onboarding/
    # -------------------------------------------------------
    path(
        "onboarding/",
        UserOnboardingStatusView.as_view(),
        name="advisory-onboarding-status",
    ),
]
