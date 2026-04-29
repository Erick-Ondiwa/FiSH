# feeding/services/history_service.py

from ..models import FeedingHistory

def log_feeding_history(session, status, actual_time=None):
    FeedingHistory.objects.create(
        plan=session.feeding_day.plan,
        session=session,
        day_number=session.feeding_day.day_number,
        session_number=session.session_number,
        scheduled_time=session.scheduled_time,
        actual_time=actual_time,
        status=status,
        feeds=[f.name for f in session.feeds.all()]
    )