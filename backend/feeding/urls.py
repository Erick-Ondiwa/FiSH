from django.urls import path
from .views import (
    StartFeedingPlanView,
    FeedingStatusView,
    ConfirmSessionView,
    FeedingAlertsView,
)

urlpatterns = [
    # Start feeding plan
    path("start/", StartFeedingPlanView.as_view(), name="feeding-start"),

    # Get current feeding status (day + meals)
    path("status/", FeedingStatusView.as_view(), name="feeding-status"),

    # Confirm a specific meal
    path("confirm-session/", ConfirmSessionView.as_view(), name="ession"),

    # Get alerts (due/missed meals)
    path("alerts/", FeedingAlertsView.as_view(), name="feeding-alerts"),
]