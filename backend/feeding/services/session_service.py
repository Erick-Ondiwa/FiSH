from datetime import datetime, timedelta
from django.utils import timezone
from django.db import transaction

from ..models import FeedingSession
from .feed_selector import get_balanced_feeds

def create_sessions_for_day(plan, feeding_day):
    if feeding_day.sessions.exists():
        return

    base_datetime = timezone.make_aware(
        datetime.combine(feeding_day.date, plan.start_time)
    )

    sessions = []

    for i in range(plan.meals_per_day):
        scheduled_time = base_datetime + timedelta(
            hours=i * plan.feeding_interval_hours
        )

        sessions.append(FeedingSession(
            feeding_day=feeding_day,
            session_number=i + 1,
            scheduled_time=scheduled_time,
            status="pending"
        ))
        
    created_sessions = FeedingSession.objects.bulk_create(sessions)

    for i, session in enumerate(created_sessions):
        feeds = get_balanced_feeds(plan.species, plan.age_group, i + 1)
        session.feeds.set(feeds)


@transaction.atomic
def confirm_session(user, session_id):
    from .day_service import advance_day
    from datetime import timedelta

    session = FeedingSession.objects.select_related(
        "feeding_day__plan"
    ).get(id=session_id)

    plan = session.feeding_day.plan

    if plan.user != user:
        raise ValueError("Unauthorized")

    if session.status == "completed":
        raise ValueError("Already completed")

    now = timezone.now()

    if session.scheduled_time > now:
        raise ValueError("Too early")

    expiry_time = session.scheduled_time + timedelta(hours=1)
    if now > expiry_time:
        raise ValueError("Session expired")

    previous_sessions = session.feeding_day.sessions.filter(
        session_number__lt=session.session_number
    )

    if previous_sessions.exclude(status__in=["completed", "missed"]).exists():
        raise ValueError("Previous session still pending")

    session.status = "completed"
    session.confirmed_at = now
    session.save(update_fields=["status", "confirmed_at"])

    if not session.feeding_day.sessions.exclude(
        status__in=["completed", "missed"]
    ).exists():
        advance_day(plan)

    return {
        "message": "Session confirmed",
        "session_id": session.id
    }