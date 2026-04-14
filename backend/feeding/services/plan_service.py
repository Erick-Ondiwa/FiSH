from django.db import transaction
from django.utils import timezone

from ..models import FeedingPlan, FeedingDay
from .feeding_strategy import get_feeding_strategy
from .session_service import create_sessions_for_day
from .response_builder import build_day_response

@transaction.atomic
def start_feeding_plan(user, species, age_group):
    strategy = get_feeding_strategy(species, age_group)

    existing = FeedingPlan.objects.filter(user=user, is_active=True).first()
    if existing:
        return {"error": "Active feeding plan already exists"}

    plan = FeedingPlan.objects.create(
        user=user,
        species=species.lower(),
        age_group=age_group.lower(),
        meals_per_day=strategy["meals_per_day"],
        feeding_interval_hours=strategy["interval"],
        start_time=timezone.now().time()
    )

    feeding_day = FeedingDay.objects.create(
        plan=plan,
        day_number=1,
        date=timezone.now().date()
    )

    create_sessions_for_day(plan, feeding_day)

    return build_day_response(feeding_day)