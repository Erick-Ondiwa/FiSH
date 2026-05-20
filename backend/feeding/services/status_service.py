from django.utils import timezone
from datetime import timedelta
from ..models import FeedingPlan
from .session_service import create_sessions_for_day
from notifications.services.notification_service import create_notification
from feeding.services.history_service import log_feeding_history


def get_feeding_status(user):
    plan = FeedingPlan.objects.filter(user=user, is_active=True).first()

    if not plan:
        return None, "No active plan"

    feeding_day = plan.days.order_by("-day_number").first()

    if not feeding_day:
        feeding_day = plan.days.create(
            day_number=1,
            date=timezone.localtime(timezone.now()).date()
        )
        create_sessions_for_day(plan, feeding_day)

    sessions = list(feeding_day.sessions.order_by("session_number"))
    now = timezone.localtime(timezone.now())

    # ----------------------------------------
    # 1. AUTO-MARK MISSED
    # ----------------------------------------
    for s in sessions:
        if s.status == "pending":
            if now > timezone.localtime(s.scheduled_time) + timedelta(hours=0.5):
                s.status = "missed"
                s.save(update_fields=["status"])

                create_notification(
                    user=plan.user,
                    type="feeding_missed",
                    title="Missed Feeding Session",
                    message=f"Session {s.session_number} was missed.",
                )

                log_feeding_history(session=s, status="missed")

    # ----------------------------------------
    # 2. PENDING SESSIONS
    # ----------------------------------------
    pending = [s for s in sessions if s.status == "pending"]

    # ----------------------------------------
    # 3. CURRENT SESSION
    # ----------------------------------------
    current = None
    for s in pending:
        start = timezone.localtime(s.scheduled_time)
        end = start + timedelta(hours=1)
        if start <= now <= end:
            current = s
            break
    
    if not current and pending:
        current = min(pending, key=lambda s: s.scheduled_time)

    # if not current and pending:
    #     current = pending[0]

    # ----------------------------------------
    # 4. UPCOMING SESSION
    # ----------------------------------------
    upcoming = None

    if pending:
        # If current exists, exclude it
        remaining = [s for s in pending if not current or s.id != current.id]

        # Get next by time
        if remaining:
            upcoming = min(remaining, key=lambda s: s.scheduled_time)

    # upcoming = None
    # if current:
    #     found = False
    #     for s in sessions:
    #         if s.id == current.id:
    #             found = True
    #             continue
    #         if found and s.status == "pending":
    #             upcoming = s
    #             break

    # ----------------------------------------
    # 5. DAY COMPLETE
    # ----------------------------------------
    if all(s.status in ["completed", "missed"] for s in sessions):
        new_day = plan.days.create(
            day_number=feeding_day.day_number + 1,
            date=timezone.localtime(timezone.now()).date()
        )
        create_sessions_for_day(plan, new_day)
        return get_feeding_status(user)

    # ----------------------------------------
    # 6. PROGRESS
    # ----------------------------------------
    total = len(sessions)
    completed = len([s for s in sessions if s.status == "completed"])
    progress = int((completed / total) * 100) if total else 0

    return {
        "plan": plan,
        "feeding_day": feeding_day,
        "sessions": sessions,
        "current": current,
        "upcoming": upcoming,
        "progress": progress,
        "now": now
    }, None