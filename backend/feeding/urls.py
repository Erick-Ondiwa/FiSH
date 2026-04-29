from django.urls import path
from .views import (
    StartFeedingPlanView,
    FeedingStatusView,
    ConfirmSessionView,
    FeedingHistoryView,
    # NotificationsView,
    # MarkNotificationsReadView, 
)

urlpatterns = [
    # Start feeding plan
    path("start/", StartFeedingPlanView.as_view(), name="feeding-start"),

    # Get current feeding status (day + meals)
    path("status/", FeedingStatusView.as_view(), name="feeding-status"),

    # Confirm a specific meal
    path("confirm-session/", ConfirmSessionView.as_view(), name="ession"),

    path("history/", FeedingHistoryView.as_view(), name="feeding-history"),

#     path("notifications/", NotificationsView.as_view()),
#     path("notifications/mark-read/", MarkNotificationsReadView.as_view()),
]