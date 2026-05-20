from django.utils import timezone
from datetime import timedelta


def format_datetime(dt):
    return timezone.localtime(dt).strftime("%Y-%m-%d %H:%M")


def build_feeding_response(data):
    plan = data["plan"]
    feeding_day = data["feeding_day"]
    sessions = data["sessions"]
    current = data["current"]
    upcoming = data["upcoming"]
    progress = data["progress"]
    now = data["now"]

    session_list = []

    for s in sessions:
        start = timezone.localtime(s.scheduled_time)
        end = start + timedelta(hours=1)

        is_current = current and s.id == current.id
        is_upcoming = upcoming and s.id == upcoming.id

        # ----------------------------------------
        # CONFIRM WINDOW LOGIC (STRICT)
        # ----------------------------------------
        can_confirm = (
            s.status == "pending" and
            start <= now <= end
        )

        # ----------------------------------------
        # FEED VISIBILITY (ONLY CURRENT + UPCOMING)
        # ----------------------------------------
        feeds = []
        if is_current or is_upcoming:
            feeds = [f.name for f in s.feeds.all()]

        session_list.append({
            "id": s.id,
            "session_number": s.session_number,
            "time": format_datetime(s.scheduled_time),
            "status": s.status,
            "is_current": is_current,
            "is_upcoming": is_upcoming,
            "can_confirm": can_confirm,
            "feeds": feeds,
        })

    return {
        "plan": {
            "id": plan.id,
            "species": plan.species,
            "age_group": plan.age_group,
            "meals_per_day": plan.meals_per_day,
        },

        "day": {
            "day_number": feeding_day.day_number,
            "date": str(feeding_day.date),
        },

        "progress": progress,

        "current_session_id": current.id if current else None,
        "upcoming_session_id": upcoming.id if upcoming else None,

        "sessions": session_list,
    }