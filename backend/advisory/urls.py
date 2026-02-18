from django.urls import path
from advisory.views import (
    DashboardView,
    SpeciesAdvisoryDetailView,
    DiseaseListView,
    SourcingListView,
    SupplierListView,
)

app_name = "advisory"

urlpatterns = [

    # 🔹 Personalized Dashboard
    path(
        "dashboard/",
        DashboardView.as_view(),
        name="dashboard"
    ),

    # 🔹 Advisory by Species (detail)
    path(
        "species/<int:species_id>/",
        SpeciesAdvisoryDetailView.as_view(),
        name="species-advisory-detail"
    ),

    # 🔹 Diseases (filtered automatically by user profile)
    path(
        "diseases/",
        DiseaseListView.as_view(),
        name="disease-list"
    ),

    # 🔹 Sourcing (supports ?species=ID)
    path(
        "sourcing/",
        SourcingListView.as_view(),
        name="sourcing-list"
    ),

    # 🔹 Verified Suppliers (supports ?species=ID)
    path(
        "suppliers/",
        SupplierListView.as_view(),
        name="supplier-list"
    ),
]
