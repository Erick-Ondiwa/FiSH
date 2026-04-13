# from datetime import timedelta, datetime
# from django.db import transaction
# from django.utils import timezone

# from ..models import (
#     FeedingPlan,
#     FeedingDay,
#     FeedingSession,
#     Feed
# )
# from .feeding_strategy import get_feeding_strategy

# # --------------------------------------------------
# # 1. FEED SELECTION ENGINE
# # --------------------------------------------------
# def get_balanced_feeds(species, age_group, session_number):
#     feeds = Feed.objects.filter(
#         species__iexact=species,
#         age_group__iexact=age_group,
#         is_active=True
#     )

#     if not feeds.exists():
#         return list(Feed.objects.filter(is_active=True)[:2])

#     # -------------------------
#     # GROUP BY ROLE
#     # -------------------------
#     primary = feeds.filter(role="primary")
#     booster = feeds.filter(role="booster")
#     supplement = feeds.filter(role="supplement")
#     energy = feeds.filter(role="energy")

#     selected_feeds = []

#     # -------------------------
#     # 1. ALWAYS INCLUDE PRIMARY
#     # -------------------------
#     if primary.exists():
#         selected_feeds.append(primary.first())
#     else:
#         selected_feeds.append(feeds.first())

#     # -------------------------
#     # 2. SESSION-BASED BALANCING
#     # -------------------------

#     # Session 1 → Strong start (growth boost)
#     if session_number == 1:
#         if booster.exists():
#             selected_feeds.append(booster.first())

#     # Session 2 → Light feeding (digestion balance)
#     elif session_number == 2:
#         if energy.exists():
#             selected_feeds.append(energy.first())

#     # Session 3 → Health support
#     elif session_number == 3:
#         if supplement.exists():
#             selected_feeds.append(supplement.first())

#     # Session 4 → Recovery / mixed
#     elif session_number >= 4:
#         if supplement.exists():
#             selected_feeds.append(supplement.first())
#         elif booster.exists():
#             selected_feeds.append(booster.first())

#     # -------------------------
#     # 3. REMOVE DUPLICATES
#     # -------------------------
#     # (important if same feed appears in multiple roles)
#     unique_feeds = list({feed.id: feed for feed in selected_feeds}.values())

#     return unique_feeds

# # --------------------------------------------------
# # 2. START FEEDING PLAN
# # --------------------------------------------------
# @transaction.atomic
# def start_feeding_plan(user, species, age_group):
#     strategy = get_feeding_strategy(species, age_group)

#     existing = FeedingPlan.objects.filter(user=user, is_active=True).first()
#     if existing:
#         return {"error": "Active feeding plan already exists"}

#     plan = FeedingPlan.objects.create(
#         user=user,
#         species=species.lower(),
#         age_group=age_group.lower(),
#         meals_per_day=strategy["meals_per_day"],
#         feeding_interval_hours=strategy["interval"],
#         start_time=timezone.now().time()
#     )

#     # Create Day 1
#     feeding_day = FeedingDay.objects.create(
#         plan=plan,
#         day_number=1,
#         date=timezone.now().date()
#     )

#     _create_sessions_for_day(plan, feeding_day)

#     return build_day_response(feeding_day)


# # --------------------------------------------------
# # 3. CREATE SESSIONS FOR A DAY
# # --------------------------------------------------

# def _create_sessions_for_day(plan, feeding_day):
#     """
#     Creates deterministic daily sessions based on plan.start_time.
#     Prevents drift and ensures consistency across days.
#     """

#     # Prevent duplicate creation
#     if feeding_day.sessions.exists():
#         return

#     # Anchor to plan start time
#     base_datetime = datetime.combine(
#         feeding_day.date,
#         plan.start_time
#     )

#     base_datetime = timezone.make_aware(base_datetime)

#     sessions = []

#     for i in range(plan.meals_per_day):
#         scheduled_time = base_datetime + timedelta(
#             hours=i * plan.feeding_interval_hours
#         )

#         feeds = get_balanced_feeds(
#             plan.species,
#             plan.age_group,
#             i + 1
#         )

#         session = FeedingSession(
#             feeding_day=feeding_day,
#             session_number=i + 1,
#             scheduled_time=scheduled_time,
#             status="pending"
#         )

#         sessions.append(session)

#     # Bulk create (performance)
#     created_sessions = FeedingSession.objects.bulk_create(sessions)

#     # Assign feeds (M2M must be done after save)
#     for i, session in enumerate(created_sessions):
#         feeds = get_balanced_feeds(
#             plan.species,
#             plan.age_group,
#             i + 1
#         )
#         session.feeds.set(feeds)


# # --------------------------------------------------
# # 4. GET CURRENT FEEDING STATUS
# # --------------------------------------------------
# def get_feeding_status(user):
#     plan = FeedingPlan.objects.filter(user=user, is_active=True).first()

#     if not plan:
#         return {"error": "No active feeding plan"}

#     feeding_day = plan.days.order_by("-day_number").first()

#     if not feeding_day:
#         return {"error": "No feeding day found"}

#     sessions = feeding_day.sessions.order_by("session_number")
#     now = timezone.now()

#     current_session = None
#     upcoming_session = None

#     # -----------------------------
#     # 1. DETERMINE CURRENT SESSION
#     # -----------------------------
#     for session in sessions:
#         if session.status == "completed":
#             continue

#         if session.scheduled_time <= now:
#             current_session = session
#             break

#     # -----------------------------
#     # 2. DETERMINE UPCOMING SESSION
#     # -----------------------------
#     for session in sessions:
#         if current_session and session.session_number > current_session.session_number:
#             upcoming_session = session
#             break

#         if not current_session and session.status != "completed":
#             upcoming_session = session
#             break

#     # -----------------------------
#     # 3. BUILD RESPONSE
#     # -----------------------------
#     response_sessions = []

#     # ---------- CURRENT ----------
#     if current_session:
#         response_sessions.append({
#             "session_id": current_session.id,
#             "session": current_session.session_number,
#             "time": current_session.scheduled_time,
#             "feeds": [f.name for f in current_session.feeds.all()],
#             "status": current_session.status,
#             "can_confirm": True,  # always confirmable if it's current
#             "is_current": True,
#             "is_upcoming": False
#         })

#     # ---------- UPCOMING ----------
#     if upcoming_session:
#         response_sessions.append({
#             "session_id": upcoming_session.id,
#             "session": upcoming_session.session_number,
#             "time": upcoming_session.scheduled_time,

#             # ❗ HIDE FEEDS UNTIL CURRENT IS CONFIRMED
#             "feeds": [] if current_session else [f.name for f in upcoming_session.feeds.all()],

#             "status": upcoming_session.status,

#             # ❗ NOT CONFIRMABLE UNTIL TIME REACHES
#             "can_confirm": False,

#             "is_current": False,
#             "is_upcoming": True
#         })

#     # -----------------------------
#     # 4. EDGE CASE: ALL COMPLETED
#     # -----------------------------
#     if not current_session and not upcoming_session:
#         # create next day automatically
#         next_day_number = feeding_day.day_number + 1

#         new_day = FeedingDay.objects.create(
#             plan=plan,
#             day_number=next_day_number,
#             date=timezone.now().date()
#         )

#         _create_sessions_for_day(plan, new_day)

#         return get_feeding_status(user)  # recursive refresh

#     return {
#         "plan_id": plan.id,
#         "day": feeding_day.day_number,
#         "sessions": response_sessions
#     }

# # --------------------------------------------------
# # 5. CONFIRM SESSION
# # --------------------------------------------------
# @transaction.atomic
# def confirm_session(user, session_id):
#     session = FeedingSession.objects.select_related(
#         "feeding_day__plan"
#     ).get(id=session_id)

#     plan = session.feeding_day.plan

#     # -------------------------
#     # AUTHORIZATION
#     # -------------------------
#     if plan.user != user:
#         raise ValueError("Unauthorized")

#     # -------------------------
#     # STATE VALIDATION
#     # -------------------------
#     if session.status == "completed":
#         raise ValueError("Session already completed")

#     now = timezone.now()

#     # ❗ BLOCK EARLY CONFIRMATION
#     if session.scheduled_time > now:
#         raise ValueError("Session not yet available")

#     # -------------------------
#     # ENSURE IT IS CURRENT SESSION
#     # -------------------------
#     previous_sessions = session.feeding_day.sessions.filter(
#         session_number__lt=session.session_number
#     )

#     if previous_sessions.exclude(status="completed").exists():
#         raise ValueError("Previous sessions must be completed first")

#     # -------------------------
#     # MARK COMPLETED
#     # -------------------------
#     session.status = "completed"
#     session.confirmed_at = now
#     session.save(update_fields=["status", "confirmed_at"])

#     # -------------------------
#     # CHECK DAY COMPLETION
#     # -------------------------
#     remaining_sessions = session.feeding_day.sessions.exclude(
#         status="completed"
#     ).exists()

#     if not remaining_sessions:
#         _advance_day(plan)

#     return {
#         "message": "Session confirmed successfully",
#         "session_id": session.id
#     }


# # --------------------------------------------------
# # 6. ADVANCE DAY
# # --------------------------------------------------
# @transaction.atomic
# def _advance_day(plan):
#     """
#     Advances feeding plan to next day in a consistent, idempotent way.
#     """

#     last_day = plan.days.order_by("-day_number").first()

#     if not last_day:
#         raise ValueError("No previous day found")

#     next_day_number = last_day.day_number + 1

#     # Prevent duplicate day creation
#     existing_day = plan.days.filter(day_number=next_day_number).first()
#     if existing_day:
#         return existing_day

#     # Maintain logical continuity (not just timezone.now())
#     next_date = last_day.date + timezone.timedelta(days=1)

#     feeding_day = FeedingDay.objects.create(
#         plan=plan,
#         day_number=next_day_number,
#         date=next_date
#     )

#     # Create sessions deterministically
#     _create_sessions_for_day(plan, feeding_day)

#     # Update plan pointer
#     plan.current_day = next_day_number
#     plan.save(update_fields=["current_day"])

#     return feeding_day


# # --------------------------------------------------
# # 7. ALERT ENGINE
# # --------------------------------------------------
# from django.utils import timezone


# def get_due_sessions(user):
#     """
#     Returns only the CURRENT actionable session as an alert.
#     Prevents alert flooding and aligns with UI logic.
#     """

#     now = timezone.now()

#     plan = FeedingPlan.objects.filter(user=user, is_active=True).first()
#     if not plan:
#         return []

#     # Get today's sessions
#     sessions = FeedingSession.objects.filter(
#         feeding_day__plan=plan
#     ).order_by("session_number")

#     # -----------------------------
#     # FIND CURRENT SESSION
#     # -----------------------------
#     current_session = None

#     for session in sessions:
#         if session.status == "completed":
#             continue

#         if session.scheduled_time <= now:
#             current_session = session
#             break

#     # -----------------------------
#     # RETURN ONLY ONE ALERT
#     # -----------------------------
#     if current_session:
#         return [{
#             "session_id": current_session.id,
#             "message": f"Feeding time reached for session {current_session.session_number}",
#             "type": "due",
#             "scheduled_time": current_session.scheduled_time
#         }]

#     return []

# # --------------------------------------------------
# # 8. CORE RESPONSE BUILDER (CRITICAL)
# # --------------------------------------------------
# def build_day_response(feeding_day):
#     now = timezone.now()

#     sessions = list(
#         feeding_day.sessions.order_by("session_number")
#     )

#     if not sessions:
#         return {
#             "day": feeding_day.day_number,
#             "current_session": None,
#             "upcoming_session": None
#         }

#     current_session = None
#     upcoming_session = None

#     # --------------------------------------------------
#     # 1. FIND CURRENT SESSION
#     # --------------------------------------------------
#     for session in sessions:
#         if session.status == "pending":
#             current_session = session
#             break

#     # If all completed, fallback to last session
#     if not current_session:
#         current_session = sessions[-1]

#     # --------------------------------------------------
#     # 2. FIND UPCOMING SESSION
#     # --------------------------------------------------
#     for session in sessions:
#         if session.session_number == current_session.session_number + 1:
#             upcoming_session = session
#             break

#     # --------------------------------------------------
#     # 3. HELPER: FORMAT SESSION
#     # --------------------------------------------------
#     def format_session(session, is_current=False, is_upcoming=False):
#         if not session:
#             return None

#         is_confirmable = (
#             is_current and
#             session.status == "pending" and
#             session.scheduled_time <= now
#         )

#         data = {
#             "id": session.id,
#             "session": session.session_number,
#             "time": session.scheduled_time.strftime("%H:%M"),
#             "status": session.status,
#             "is_current": is_current,
#             "is_upcoming": is_upcoming,
#             "is_confirmable": is_confirmable,
#         }

#         # --------------------------------------------------
#         # 4. ONLY CURRENT SESSION HAS FEEDS
#         # --------------------------------------------------
#         if is_current:
#             data["feeds"] = [
#                 feed.name for feed in session.feeds.all()
#             ]

#         return data

#     # --------------------------------------------------
#     # 5. BUILD RESPONSE
#     # --------------------------------------------------
#     response = {
#         "day": feeding_day.day_number,
#         "current_session": format_session(
#             current_session,
#             is_current=True
#         ),
#         "upcoming_session": format_session(
#             upcoming_session,
#             is_upcoming=True
#         ) if upcoming_session else None,
#     }

#     return response