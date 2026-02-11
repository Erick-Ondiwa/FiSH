from django.contrib import admin
from .models import OnboardingTask, TaskStep, FarmerStepProgress

admin.site.register(OnboardingTask)
admin.site.register(TaskStep)
admin.site.register(FarmerStepProgress)

