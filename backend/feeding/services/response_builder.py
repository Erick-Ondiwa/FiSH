from django.utils import timezone
from datetime import timedelta

def format_time(dt):
    local_time = timezone.localtime(dt)
    return local_time.strftime("%H:%M")

def build_day_response(feeding_day):
    now = timezone.now()
    sessions = list(feeding_day.sessions.order_by("session_number"))

    current = None
    upcoming = None

    # ----------------------------------------
    # 1. AUTO-MARK MISSED SESSIONS
    # ----------------------------------------
    for s in sessions:
        if s.status == "pending":
            expiry_time = s.scheduled_time + timedelta(hours=1)

            if now > expiry_time:
                s.status = "missed"
                s.save(update_fields=["status"])

    # ----------------------------------------
    # 2. DETERMINE CURRENT SESSION
    # ----------------------------------------
    for s in sessions:
        if s.status == "pending":
            start = s.scheduled_time
            end = s.scheduled_time + timedelta(hours=1)

            if start <= now <= end:
                current = s
                break

    # ----------------------------------------
    # 3. DETERMINE UPCOMING SESSION
    # ----------------------------------------
    if current:
        for s in sessions:
            if s.session_number > current.session_number:
                upcoming = s
                break
    else:
        for s in sessions:
            if s.status == "pending" and s.scheduled_time > now:
                upcoming = s
                break

    # ----------------------------------------
    # 4. SESSION FORMATTER
    # ----------------------------------------
    def format_session(s):
        if not s:
            return None

        is_current = current and s.id == current.id
        is_upcoming = upcoming and s.id == upcoming.id

        return {
            "id": s.id,
            "session": s.session_number,
            "time": format_time(s.scheduled_time),
            "status": s.status,

            # 🔥 CONTROL FLAGS
            "is_current": is_current,
            "is_upcoming": is_upcoming,
            "can_confirm": is_current,  # ONLY current session

            # 🔐 FEED VISIBILITY
            "feeds": [f.name for f in s.feeds.all()] if is_current else [],
        }

    # ----------------------------------------
    # 5. PROGRESS CALCULATION
    # ----------------------------------------
    total_sessions = len(sessions)
    completed_sessions = len([s for s in sessions if s.status == "completed"])

    progress = int((completed_sessions / total_sessions) * 100) if total_sessions else 0

    # ----------------------------------------
    # 6. FINAL RESPONSE
    # ----------------------------------------
    return {
        "day": feeding_day.day_number,
        "progress": progress,

        "current_session": format_session(current),
        "upcoming_session": format_session(upcoming),
    }