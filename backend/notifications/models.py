# notifications/models.py
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

class Notification(models.Model):
    TYPE_CHOICES = [
        ("feeding_start", "Feeding Start"),
        ("feeding_end", "Feeding Ending"),
        ("feeding_missed", "Feeding Missed"),
        ("water_reminder", "Water Reminder"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    type = models.CharField(max_length=50, choices=TYPE_CHOICES)

    title = models.CharField(max_length=255)
    message = models.TextField()

    is_read = models.BooleanField(default=False)

    # Optional linking
    session_id = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)