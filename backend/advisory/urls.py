from django.urls import path

from .views import (
    AdvisorySectionListView,
    AdvisoryGuideDetailView,
    UserOnboardingStatusView,
    SupplierListView,
    StockingGuidelineView,
    FishQualityChecklistView,
    StartConversationView,
    ConversationMessagesView,
    SendMessageView,
)

app_name = "advisory"

urlpatterns = [

    # =======================================================
    # 🔹 ADVISORY CORE
    # =======================================================

    # Sidebar sections
    # GET /api/advisory/sections/
    path(
        "sections/",
        AdvisorySectionListView.as_view(),
        name="advisory-sections",
    ),

    # Context-aware guide
    # GET /api/advisory/guide/<slug>/
    path(
        "guide/<slug:slug>/",
        AdvisoryGuideDetailView.as_view(),
        name="advisory-guide-detail",
    ),

    # Onboarding (Getting Started dashboard)
    # GET /api/advisory/onboarding/
    path(
        "onboarding/",
        UserOnboardingStatusView.as_view(),
        name="advisory-onboarding-status",
    ),

    # =======================================================
    # 🔹 SOURCING MODULE (CRITICAL FIX)
    # =======================================================

    # Verified suppliers
    # GET /api/advisory/suppliers/
    path(
        "suppliers/",
        SupplierListView.as_view(),
        name="supplier-list",
    ),

    # Stocking guidelines
    # GET /api/advisory/stocking/
    path(
        "stocking/",
        StockingGuidelineView.as_view(),
        name="stocking-guidelines",
    ),

    # Fish quality checklist
    # GET /api/advisory/quality-checklist/
    path(
        "quality-checklist/",
        FishQualityChecklistView.as_view(),
        name="fish-quality-checklist",
    ),

    path("start/", StartConversationView.as_view(), name="start"),
    path("<int:conversation_id>/", ConversationMessagesView.as_view()),
    path("<int:conversation_id>/send/", SendMessageView.as_view()),

]



