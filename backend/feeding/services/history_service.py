# feeding/services/history_service.py

from ..models import FeedingHistory


def log_feeding_history(session, status, actual_time=None):

    history = FeedingHistory.objects.create(
        user=session.feeding_day.plan.user,

        plan=session.feeding_day.plan,

        session=session,

        day_number=session.feeding_day.day_number,

        session_number=session.session_number,

        scheduled_time=session.scheduled_time,

        actual_time=actual_time,

        status=status,
    )

    # ✅ Many-to-many assignment
    history.feeds.set(session.feeds.all())

    return history

def build_history_response(history_records):

    days = []

    # group by day_number
    grouped = {}

    for record in history_records:

        day = record.day_number

        if day not in grouped:
            grouped[day] = {
                "day": day,
                "date": record.scheduled_time.date(),
                "sessions": [],
            }

        grouped[day]["sessions"].append({
            "id": record.id,
            "session": record.session_number,
            "time": record.scheduled_time.strftime("%Y-%m-%d %H:%M"),
            "status": record.status,
            "feeds": [f.name for f in record.feeds.all()]
        })

    # summaries
    for day_data in grouped.values():

        sessions = day_data["sessions"]

        completed = len([
            s for s in sessions if s["status"] == "completed"
        ])

        total = len(sessions)

        missed = len([
            s for s in sessions if s["status"] == "missed"
        ])

        day_data["summary"] = {
            "completed": completed,
            "missed": missed,
            "total": total,
            "completion_rate": int((completed / total) * 100) if total else 0
        }

        days.append(day_data)

    total_sessions = len(history_records)
    completed_sessions = len([
        h for h in history_records
        if h.status == "completed"
    ])

    overall = {
        "total_sessions": total_sessions,
        "completed_sessions": completed_sessions,
        "completion_rate": int(
            (completed_sessions / total_sessions) * 100
        ) if total_sessions else 0
    }

    return {
        "days": days,
        "overall": overall
    }