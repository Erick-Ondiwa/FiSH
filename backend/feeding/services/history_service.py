from django.utils import timezone
from ..models import FeedingPlan


def get_feeding_history(user):
    plan = FeedingPlan.objects.filter(user=user, is_active=True).first()

    if not plan:
        return {"error": "No active feeding plan"}

    days = plan.days.prefetch_related("sessions__feeds").order_by("-day_number")

    history_days = []
    total_sessions = 0
    total_completed = 0

    for day in days:
        sessions_data = []

        completed = 0
        missed = 0

        for s in day.sessions.all().order_by("session_number"):
            session_info = {
                "id": s.id,
                "session": s.session_number,
                "time": s.scheduled_time.strftime("%H:%M"),
                "status": s.status,
                "feeds": [f.name for f in s.feeds.all()] if s.status == "completed" else []
            }

            sessions_data.append(session_info)

            total_sessions += 1

            if s.status == "completed":
                completed += 1
                total_completed += 1
            elif s.status == "missed":
                missed += 1

        history_days.append({
            "day": day.day_number,
            "date": day.date,
            "sessions": sessions_data,
            "summary": {
                "completed": completed,
                "missed": missed,
                "total": len(sessions_data),
                "completion_rate": int((completed / len(sessions_data)) * 100) if sessions_data else 0
            }
        })

    overall_rate = int((total_completed / total_sessions) * 100) if total_sessions else 0

    return {
        "days": history_days,
        "overall": {
            "total_sessions": total_sessions,
            "completed_sessions": total_completed,
            "completion_rate": overall_rate
        }
    }