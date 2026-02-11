from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404

from .models import OnboardingTask, TaskStep, FarmerStepProgress
from accounts.models import FarmerProfile
from .serializers import (
    OnboardingTaskSerializer,
    TaskStepSerializer,
    StepProgressUpdateSerializer,
)

# ------------------------------------------------------------
# HELPER
# ------------------------------------------------------------
def get_farmer(request):
    user = request.user
    if not user or not user.is_authenticated:
        return None
    try:
        return user.farmer_profile
    except FarmerProfile.DoesNotExist:
        return None


# ------------------------------------------------------------
class OnboardingTaskListView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = OnboardingTaskSerializer

    def get_queryset(self):
        farmer = get_farmer(self.request)
        queryset = OnboardingTask.objects.all()

        if farmer and farmer.place_of_farming:
            queryset = queryset.filter(
                farming_method__in=[farmer.place_of_farming, None, ""]
            )

        return queryset

    def get_serializer_context(self):
        return {"farmer": get_farmer(self.request)}


# ------------------------------------------------------------
class OnboardingTaskDetailView(generics.RetrieveAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = OnboardingTask.objects.all()
    serializer_class = OnboardingTaskSerializer

    def get_serializer_context(self):
        return {"farmer": get_farmer(self.request)}


# ------------------------------------------------------------
class StepProgressUpdateView(generics.UpdateAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = StepProgressUpdateSerializer

    def get_object(self):
        farmer = get_farmer(self.request)
        if not farmer:
            raise PermissionDenied("Farmer profile not found.")

        step_id = self.kwargs.get("step_id")
        step = get_object_or_404(TaskStep, id=step_id)

        progress, _ = FarmerStepProgress.objects.get_or_create(
            farmer=farmer,
            step=step
        )
        return progress

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


# ------------------------------------------------------------
class TaskStepListView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TaskStepSerializer

    def get_queryset(self):
        task_id = self.kwargs.get("task_id")
        return TaskStep.objects.filter(task_id=task_id).order_by("step_number")

    def get_serializer_context(self):
        return {"farmer": get_farmer(self.request)}
