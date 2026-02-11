from django.urls import path
from .views import (
    OnboardingTaskListView,
    OnboardingTaskDetailView,
    StepProgressUpdateView,
    TaskStepListView
)

urlpatterns = [
    path("tasks/", OnboardingTaskListView.as_view(), name="onboarding-task-list"),
    path("tasks/<int:pk>/", OnboardingTaskDetailView.as_view(), name="onboarding-task-detail"),

    path("tasks/<int:task_id>/steps/", TaskStepListView.as_view(), name="task-step-list"),

    path("steps/<int:step_id>/progress/", StepProgressUpdateView.as_view(), name="step-progress"),
]
