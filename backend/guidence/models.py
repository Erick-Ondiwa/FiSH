from django.db import models
from django.utils import timezone
from accounts.models import FarmerProfile

class OnboardingTask(models.Model):
    """
    Represents a high-level task required for a farmer to get started.
    Example: Setup Pond, Source Fingerlings, Choose Fish Species.
    """

    title = models.CharField(max_length=150)
    short_description = models.TextField()
    icon = models.CharField(max_length=150, blank=True, null=True)
    farming_method = models.CharField(max_length=50, blank=True, null=True)
    fish_species = models.CharField(max_length=50, blank=True, null=True)
    order = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class TaskStep(models.Model):
    """
    A detailed step under a specific onboarding task.
    Each step contains text, images, and an optional video link.
    """
    
    task = models.ForeignKey(OnboardingTask, on_delete=models.CASCADE, related_name='steps')

    step_number = models.PositiveIntegerField()
    title = models.CharField(max_length=150)
    description = models.TextField()

    image = models.ImageField(upload_to='task_steps/images/', blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['step_number']
        unique_together = ('task', 'step_number')

    def __str__(self):
        return f"{self.task.title} - Step {self.step_number}: {self.title}"

class FarmerTaskProgress(models.Model):
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE)
    task = models.ForeignKey(OnboardingTask, on_delete=models.CASCADE)

    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ('farmer', 'task')


class FarmerStepProgress(models.Model):
    """
    Tracks whether a farmer has completed a specific step within a task.
    """

    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE)
    step = models.ForeignKey(TaskStep, on_delete=models.CASCADE)

    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        unique_together = ('farmer', 'step')

    def mark_completed(self):
        self.completed = True
        self.completed_at = timezone.now()
        self.save()

    def __str__(self):
        status = "Completed" if self.completed else "Pending"
        return f"{self.farmer.user.get_full_name()} - {self.step.title} ({status})"
