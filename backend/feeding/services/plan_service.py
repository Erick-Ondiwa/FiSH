from django.db import transaction
from django.utils import timezone

from farm.models import Pond  # ✅ IMPORT FARM
from ..models import FeedingPlan, FeedingDay
from .feeding_strategy import get_feeding_strategy
from .session_service import create_sessions_for_day
from .response_builder import build_day_response


@transaction.atomic
def start_feeding_plan(user, species, age_group):
    # ----------------------------------------
    # 1. PREVENT MULTIPLE ACTIVE PLANS
    # ----------------------------------------
    existing = FeedingPlan.objects.filter(user=user, is_active=True).first()
    if existing:
        return {"error": "Active feeding plan already exists"}

    # ----------------------------------------
    # 2. ENSURE FARM EXISTS (CRITICAL)
    # ----------------------------------------
    pond = Pond.objects.filter(owner=user).first()

    if not pond:
        return {
            "error": "Create Pond First"
        }

    # ----------------------------------------
    # 3. GET STRATEGY
    # ----------------------------------------
    strategy = get_feeding_strategy(species, age_group)

    # ----------------------------------------
    # 4. CREATE PLAN (WITH FARM LINK)
    # ----------------------------------------
    plan = FeedingPlan.objects.create(
        user=user,
        pond=pond,
        species=species.lower(),
        age_group=age_group.lower(),
        meals_per_day=strategy["meals_per_day"],
        feeding_interval_hours=strategy["interval"],
        start_time=timezone.now().time(),
        is_active=True
    )

    # ----------------------------------------
    # 5. CREATE DAY 1
    # ----------------------------------------
    feeding_day = FeedingDay.objects.create(
        plan=plan,
        day_number=1,
        date=timezone.now().date()
    )

    # ----------------------------------------
    # 6. GENERATE SESSIONS
    # ----------------------------------------
    create_sessions_for_day(plan, feeding_day)

    # ----------------------------------------
    # 7. RESPONSE
    # ----------------------------------------
    return build_day_response(feeding_day)