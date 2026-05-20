# feeding/services/notification_service.py
from django.utils import timezone
from datetime import timedelta
from notifications.services.notification_service import create_notification

from feeding.models import FeedingSession

def trigger_feeding_notifications():
    now = timezone.now()

    sessions = FeedingSession.objects.filter(status="pending")

    for session in sessions:
        start = session.scheduled_time
        end = start + timedelta(hours=1)

        # ⏰ 10 min before start
        if 0 < (start - now).total_seconds() <= 600:
            create_notification(
                user=session.feeding_day.plan.user,
                type="feeding_start",
                title="Feeding Session Starting",
                message=f"Session {session.session_number} starts in 10 minutes.",
                session=session
            )

        # ⏰ 10 min before end
        if 0 < (end - now).total_seconds() <= 600:
            create_notification(
                user=session.feeding_day.plan.user,
                type="feeding_end",
                title="Session Ending Soon",
                message=f"Session {session.session_number} ends soon.",
                session=session
            )
