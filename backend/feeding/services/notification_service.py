from datetime import timedelta
from django.utils import timezone
from ..models import FeedingPlan, FeedingNotification


def generate_dynamic_notifications(user):
    """
    Generate REAL-TIME notifications from feeding sessions
    """
    plan = FeedingPlan.objects.filter(user=user, is_active=True).first()
    if not plan:
        return []

    feeding_day = plan.days.order_by("-day_number").first()
    if not feeding_day:
        return []

    sessions = feeding_day.sessions.all()
    now = timezone.now()

    notifications = []

    for s in sessions:
        start = s.scheduled_time
        end = start + timedelta(hours=1)

        # 🔴 MISSED
        if s.status == "missed":
            notifications.append({
                "type": "missed",
                "message": f"Session {s.session_number} was missed",
                "session_id": s.id,
            })

        # 🟢 CURRENT
        elif start <= now <= end and s.status == "pending":
            notifications.append({
                "type": "current",
                "message": f"It's time to feed (Session {s.session_number})",
                "session_id": s.id,
            })

        # 🟡 UPCOMING (30 mins before)
        elif start - timedelta(minutes=30) <= now < start:
            notifications.append({
                "type": "upcoming",
                "message": f"Session {s.session_number} starts soon",
                "session_id": s.id,
            })

    return notifications


def store_notification(user, session, type, message):
    """
    Save persistent notification (optional use)
    """
    return FeedingNotification.objects.create(
        user=user,
        session=session,
        type=type,
        message=message
    )


def get_all_notifications(user):
    """
    Combine persistent + dynamic notifications
    """
    dynamic = generate_dynamic_notifications(user)

    persistent = FeedingNotification.objects.filter(user=user)

    persistent_list = [
        {
            "type": n.type,
            "message": n.message,
            "session_id": n.session.id if n.session else None,
            "is_read": n.is_read,
            "created_at": n.created_at,
        }
        for n in persistent
    ]

    return {
        "alerts": dynamic + persistent_list,
        "count": len(dynamic) + len(persistent_list)
    }


def mark_all_as_read(user):
    FeedingNotification.objects.filter(user=user, is_read=False).update(is_read=True)