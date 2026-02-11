from rest_framework import serializers
from .models import OnboardingTask, TaskStep, FarmerStepProgress
from accounts.models import FarmerProfile
from django.utils import timezone
# ------------------------------------------------------------
# STEP SERIALIZER (READ)
# Includes farmer progress status
# ------------------------------------------------------------
class TaskStepSerializer(serializers.ModelSerializer):
    completed = serializers.SerializerMethodField()

    class Meta:
        model = TaskStep
        fields = [
            'id',
            'step_number',
            'title',
            'description',
            'image',
            'video_url',
            'completed',
        ]

    def get_completed(self, obj):
        """
        Determine if the logged-in farmer has completed this step.
        """
        farmer = self.context.get("farmer")
        if not farmer:
            return False

        return FarmerStepProgress.objects.filter(
            farmer=farmer,
            step=obj,
            completed=True
        ).exists()


# ------------------------------------------------------------
# TASK SERIALIZER (READ)
# Includes nested steps + progress summary
# ------------------------------------------------------------
class OnboardingTaskSerializer(serializers.ModelSerializer):
    steps = TaskStepSerializer(many=True, read_only=True)
    total_steps = serializers.SerializerMethodField()
    completed_steps = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = OnboardingTask
        fields = [
            'id',
            'title',
            'short_description',
            'icon',
            'farming_method',
            'fish_species',
            'order',
            'steps',
            'total_steps',
            'completed_steps',
            'is_completed',
        ]

    def get_total_steps(self, obj):
        return obj.steps.count()

    def get_completed_steps(self, obj):
        farmer = self.context.get("farmer")
        if not farmer:
            return 0

        return FarmerStepProgress.objects.filter(
            farmer=farmer,
            step__task=obj,
            completed=True
        ).count()

    def get_is_completed(self, obj):
        """
        A task is complete if all its steps are complete.
        """
        total = self.get_total_steps(obj)
        done = self.get_completed_steps(obj)

        return total > 0 and total == done

# ------------------------------------------------------------
# SERIALIZER FOR MARKING A STEP COMPLETE
# ------------------------------------------------------------
class StepProgressUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerStepProgress
        fields = ['id', 'farmer', 'step', 'completed', 'completed_at']
        read_only_fields = ['completed_at']

    def update(self, instance, validated_data):
        """
        When farmer marks a step as done, fill timestamp.
        """
        if validated_data.get('completed'):
            instance.completed = True
            instance.completed_at = timezone.now()
        else:
            instance.completed = False
            instance.completed_at = None

        instance.save()
        return instance

# ------------------------------------------------------------
# CREATE PROGRESS ENTRY IF NONE EXISTS
# Useful during onboarding initialization
# ------------------------------------------------------------
class StepProgressCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerStepProgress
        fields = ['id', 'farmer', 'step']
