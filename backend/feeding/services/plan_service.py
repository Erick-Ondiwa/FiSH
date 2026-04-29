from django.db import transaction
from django.utils import timezone

from farm.models import Pond
from ..models import FeedingPlan, FeedingDay
from .feeding_strategy import get_feeding_strategy
from .session_service import create_sessions_for_day
from .feeding_response import build_feeding_response
from .status_service import get_feeding_status


@transaction.atomic
def start_feeding_plan(user, species, age_group):
    # ----------------------------------------
    # 1. PREVENT MULTIPLE ACTIVE PLANS
    # ----------------------------------------
    existing = FeedingPlan.objects.filter(
        user=user,
        is_active=True
    ).first()

    if existing:
        return {
            "success": False,
            "message": "Active feeding plan already exists"
        }

    # ----------------------------------------
    # 2. ENSURE POND EXISTS
    # ----------------------------------------
    pond = Pond.objects.filter(owner=user).first()

    if not pond:
        return {
            "success": False,
            "message": "Create pond first"
        }

    # ----------------------------------------
    # 3. NORMALIZE INPUT
    # ----------------------------------------
    species = species.lower().strip()
    age_group = age_group.lower().strip()

    # ----------------------------------------
    # 4. GET STRATEGY
    # ----------------------------------------
    strategy = get_feeding_strategy(species, age_group)

    # ----------------------------------------
    # 5. CREATE PLAN
    # ----------------------------------------
    plan = FeedingPlan.objects.create(
        user=user,
        pond=pond,
        species=species,
        age_group=age_group,
        meals_per_day=strategy["meals_per_day"],
        feeding_interval_hours=strategy["interval"],
        start_time=timezone.localtime().time(),
        is_active=True
    )

    # ----------------------------------------
    # 6. CREATE DAY 1
    # ----------------------------------------
    feeding_day = FeedingDay.objects.create(
        plan=plan,
        day_number=1,
        date=timezone.localdate()
    )

    # ----------------------------------------
    # 7. GENERATE SESSIONS
    # ----------------------------------------
    create_sessions_for_day(plan, feeding_day)

    # ----------------------------------------
    # 8. REUSE STATUS ENGINE (FIXED)
    # ----------------------------------------
    data, error = get_feeding_status(user)

    if error:
        return {
            "success": False,
            "message": error
        }

    # ----------------------------------------
    # 9. FINAL RESPONSE
    # ----------------------------------------
    return {
        "success": True,
        "data": build_feeding_response(data)
    }