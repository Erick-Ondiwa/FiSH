# notifications/services/water_service.py

from django.utils import timezone
from datetime import timedelta

from django.contrib.auth import get_user_model
from farm.models import Pond
from notifications.services.notification_service import create_notification

User = get_user_model()


# ----------------------------------------
# CONFIG
# ----------------------------------------
REMINDER_DAYS = 7   # weekly reminder


# ----------------------------------------
# CORE FUNCTION
# ----------------------------------------
def trigger_water_reminders():
    """
    Runs periodically (daily via cron/celery)

    Logic:
    - If user has no pond → skip
    - If no water record → notify immediately
    - If last update > 7 days → notify
    """

    now = timezone.now()
    users = User.objects.all()

    for user in users:

        # ----------------------------------------
        # 1. GET USER POND
        # ----------------------------------------
        pond = Pond.objects.filter(owner=user).first()

        if not pond:
            continue  # no pond → nothing to track

        # ----------------------------------------
        # 2. GET LAST WATER RECORD
        # ----------------------------------------
        last_record = pond.water_records.order_by("-recorded_at").first()

        # ----------------------------------------
        # 3. DETERMINE IF NOTIFICATION IS NEEDED
        # ----------------------------------------
        if not last_record:
            should_notify = True
            days_since = None
        else:
            delta = now - last_record.recorded_at
            days_since = delta.days
            should_notify = days_since >= REMINDER_DAYS

        if not should_notify:
            continue

        # ----------------------------------------
        # 4. PREVENT DUPLICATE NOTIFICATIONS (IMPORTANT)
        # ----------------------------------------
        already_sent = user.notifications.filter(
            type="water_reminder",
            created_at__date=now.date()
        ).exists()

        if already_sent:
            continue

        # ----------------------------------------
        # 5. BUILD MESSAGE
        # ----------------------------------------
        if days_since is None:
            message = "You have not recorded any water quality data yet. Please update your pond conditions."
        else:
            message = f"It has been {days_since} days since your last water quality update. Please update your pond conditions."

        # ----------------------------------------
        # 6. CREATE NOTIFICATION
        # ----------------------------------------
        create_notification(
            user=user,
            type="water_reminder",
            title="Update Water Conditions",
            message=message,
        )