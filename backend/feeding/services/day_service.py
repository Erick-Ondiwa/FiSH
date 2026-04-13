from django.utils import timezone
from django.db import transaction
from ..models import FeedingDay
from .session_service import create_sessions_for_day

@transaction.atomic
def advance_day(plan):
    from .session_service import create_sessions_for_day  # 👈 move here

    last_day = plan.days.order_by("-day_number").first()

    next_day_number = last_day.day_number + 1

    existing = plan.days.filter(day_number=next_day_number).first()
    if existing:
        return existing

    next_date = last_day.date + timezone.timedelta(days=1)

    new_day = FeedingDay.objects.create(
        plan=plan,
        day_number=next_day_number,
        date=next_date
    )

    create_sessions_for_day(plan, new_day)

    plan.current_day = next_day_number
    plan.save(update_fields=["current_day"])

    return new_day