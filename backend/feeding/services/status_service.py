from django.utils import timezone
from datetime import timedelta
from ..models import FeedingPlan
from .session_service import create_sessions_for_day


def format_datetime(dt):
    return timezone.localtime(dt).strftime("%Y-%m-%d %H:%M")


def get_feeding_status(user):
    plan = FeedingPlan.objects.filter(user=user, is_active=True).first()

    if not plan:
        return {"error": "No active plan"}

    feeding_day = plan.days.order_by("-day_number").first()

    if not feeding_day:
        feeding_day = plan.days.create(
            day_number=1,
            date=timezone.localtime(timezone.now()).date()
        )
        create_sessions_for_day(plan, feeding_day)

    sessions = list(feeding_day.sessions.order_by("session_number"))

    # ✅ Normalize current time to localtime
    now = timezone.localtime(timezone.now())

    # ==================================================
    # 1. AUTO-MARK MISSED SESSIONS
    # ==================================================
    for s in sessions:
        if s.status == "pending":
            scheduled = timezone.localtime(s.scheduled_time)
            if now > scheduled + timedelta(hours=1):
                s.status = "missed"
                s.save(update_fields=["status"])

    # ==================================================
    # 2. BUILD PENDING LIST (SOURCE OF TRUTH)
    # ==================================================
    pending_sessions = [s for s in sessions if s.status == "pending"]

    # ==================================================
    # 3. DETERMINE CURRENT SESSION (STRICT WINDOW FIRST)
    # ==================================================
    current = None

    for s in pending_sessions:
        start = timezone.localtime(s.scheduled_time)
        end = start + timedelta(hours=1)

        if start <= now <= end:
            current = s
            break

    # FALLBACK: if no active window session, pick first pending
    if not current and pending_sessions:
        current = pending_sessions[0]

    # ==================================================
    # 4. DETERMINE UPCOMING SESSION (ALWAYS NEXT ONE)
    # ==================================================
    upcoming = None

    if current:
        found = False

        for s in sessions:
            if s.id == current.id:
                found = True
                continue

            if found and s.status == "pending":
                upcoming = s
                break

    # fallback: if no upcoming found, pick next available session
    if not upcoming:
        for s in sessions:
            if s.status == "pending" and (not current or s.id != current.id):
                upcoming = s
                break

    # ==================================================
    # 5. HANDLE DAY COMPLETION
    # ==================================================
    if all(s.status in ["completed", "missed"] for s in sessions):
        new_day = plan.days.create(
            day_number=feeding_day.day_number + 1,
            date=timezone.localtime(timezone.now()).date()
        )
        create_sessions_for_day(plan, new_day)
        return get_feeding_status(user)

    # ==================================================
    # 6. BUILD RESPONSE
    # ==================================================
    session_list = []

    for s in sessions:
        is_current = current and s.id == current.id
        is_upcoming = upcoming and s.id == upcoming.id

        # CONFIRM LOGIC (STRICT 1-HOUR WINDOW)
        can_confirm = False
        if is_current and s.status == "pending":
            start = timezone.localtime(s.scheduled_time)
            end = start + timedelta(hours=1)
            can_confirm = start <= now <= end

        # FEEDS LOGIC
        if is_current:
            feeds = [f.name for f in s.feeds.all()]
        elif is_upcoming:
            feeds = [f.name for f in s.feeds.all()]
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

    # ==================================================
    # 7. PROGRESS
    # ==================================================
    total = len(sessions)
    completed = len([s for s in sessions if s.status == "completed"])

    progress = int((completed / total) * 100) if total else 0

    # ==================================================
    # 8. FINAL RESPONSE (NEVER NULL CURRENT/UPCOMING)
    # ==================================================
    return {
        "plan_id": plan.id,
        "day": feeding_day.day_number,
        "progress": progress,

        "current_session_id": current.id if current else sessions[0].id,
        "upcoming_session_id": upcoming.id if upcoming else None,

        "sessions": session_list
    }