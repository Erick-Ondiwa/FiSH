from django.utils import timezone
from datetime import timedelta
from ..models import FeedingPlan
from .session_service import create_sessions_for_day

from django.utils import timezone

def format_datetime(dt):
    local_time = timezone.localtime(dt)
    return local_time.strftime("%Y-%m-%d %H:%M")

def get_feeding_status(user):
    plan = FeedingPlan.objects.filter(user=user, is_active=True).first()

    if not plan:
        return {"error": "No active plan"}

    feeding_day = plan.days.order_by("-day_number").first()

    if not feeding_day:
        feeding_day = plan.days.create(
            day_number=1,
            date=timezone.now().date()
        )
        create_sessions_for_day(plan, feeding_day)

    sessions = list(feeding_day.sessions.order_by("session_number"))
    now = timezone.now()

    current = None
    upcoming = None

    # ----------------------------------------
    # 1. AUTO-MARK MISSED
    # ----------------------------------------
    for s in sessions:
        if s.status == "pending":
            expiry = s.scheduled_time + timedelta(hours=1)

            if now > expiry:
                s.status = "missed"
                s.save(update_fields=["status"])

    # ----------------------------------------
    # 2. DETERMINE CURRENT (STRICT WINDOW)
    # ----------------------------------------
    for s in sessions:
        if s.status == "pending":
            start = s.scheduled_time
            end = s.scheduled_time + timedelta(hours=1)

            if start <= now <= end:
                current = s
                break

    # ----------------------------------------
    # 3. FALLBACK CURRENT (MISSED STAYS VISIBLE)
    # ----------------------------------------
    if not current:
        for s in sessions:
            if s.status in ["missed", "completed"]:
                current = s
            else:
                break  # stop at first unresolved

    # ----------------------------------------
    # 4. DETERMINE UPCOMING
    # ----------------------------------------
    if current:
        for s in sessions:
            if s.session_number > current.session_number:
                upcoming = s
                break

    # ----------------------------------------
    # 5. HANDLE DAY COMPLETION
    # ----------------------------------------
    if all(s.status in ["completed", "missed"] for s in sessions):
        new_day = plan.days.create(
            day_number=feeding_day.day_number + 1,
            date=timezone.now().date()
        )
        create_sessions_for_day(plan, new_day)
        return get_feeding_status(user)

    # ----------------------------------------
    # 6. BUILD RESPONSE
    # ----------------------------------------
    session_list = []

    # 🔥 KEY RULE: unlock upcoming feeds ONLY when current resolved
    current_resolved = current and current.status in ["completed", "missed"]

    for s in sessions:
        is_current = current and s.id == current.id
        is_upcoming = upcoming and s.id == upcoming.id

        # ----------------------------------------
        # CONFIRM LOGIC (STRICT WINDOW)
        # ----------------------------------------
        can_confirm = False
        if is_current and s.status == "pending":
            start = s.scheduled_time
            end = s.scheduled_time + timedelta(hours=1)
            can_confirm = start <= now <= end

        # ----------------------------------------
        # FEED VISIBILITY LOGIC (CRITICAL)
        # ----------------------------------------
        if is_current:
            feeds = [f.name for f in s.feeds.all()]

        elif is_upcoming and current_resolved:
            feeds = [f.name for f in s.feeds.all()]  # unlock

        else:
            feeds = []
        session_list.append({
            "id": s.id,
            "session": s.session_number,
            "time": format_datetime(s.scheduled_time),
            "status": s.status,

            "is_current": is_current,
            "is_upcoming": is_upcoming,
            "can_confirm": can_confirm,

            "feeds": feeds
        })


    # ----------------------------------------
    # 7. PROGRESS
    # ----------------------------------------
    total = len(sessions)
    completed = len([s for s in sessions if s.status == "completed"])

    progress = int((completed / total) * 100) if total else 0

    # ----------------------------------------
    # 8. FINAL RESPONSE
    # ----------------------------------------
    return {
        "plan_id": plan.id,
        "day": feeding_day.day_number,
        "progress": progress,

        "current_session_id": current.id if current else None,
        "upcoming_session_id": upcoming.id if upcoming else None,

        "sessions": session_list
    }
