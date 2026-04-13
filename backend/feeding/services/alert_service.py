from django.utils import timezone
from ..models import FeedingPlan, FeedingSession

def get_due_sessions(user):
    plan = FeedingPlan.objects.filter(user=user, is_active=True).first()
    if not plan:
        return []

    now = timezone.now()

    sessions = FeedingSession.objects.filter(
        feeding_day__plan=plan
    ).order_by("session_number")

    for session in sessions:
        if session.status != "completed" and session.scheduled_time <= now:
            return [{
                "session_id": session.id,
                "message": f"Feeding time for session {session.session_number}",
                "type": "due"
            }]

    return []