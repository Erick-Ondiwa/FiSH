from django.utils import timezone
from datetime import timedelta

def build_growth_features(plan):
    pond = plan.pond

    # -------------------------
    # FARM DATA
    # -------------------------

    temperature = pond.water_records.last().temperature
    oxygen = pond.water_records.last().dissolved_oxygen
    ph = pond.water_records.last().ph
    stocking_density = pond.stocking_density
    current_weight = pond.current_avg_weight

    # -------------------------
    # FEEDING DATA (last 24h)
    # -------------------------
    recent_days = plan.days.filter(
        date__gte=timezone.now().date() - timedelta(days=1)
    ).prefetch_related("sessions__feeds")

    total_sessions = 0
    completed_sessions = 0
    total_protein = 0
    feed_count = 0

    for day in recent_days:
        for session in day.sessions.all():
            total_sessions += 1

            if session.status == "completed":
                completed_sessions += 1

                for feed in session.feeds.all():
                    total_protein += feed.protein_percent
                    feed_count += 1

    feeding_frequency = completed_sessions
    feeding_consistency = (
        completed_sessions / total_sessions if total_sessions else 0
    )
    avg_protein = (
        total_protein / feed_count if feed_count else 0
    )

    # -------------------------
    # MODEL INPUT FORMAT
    # -------------------------
    features = {
        "Species": plan.species,
        "temperature": temperature,
        "oxygen": oxygen,
        "ph": ph,
        "density": stocking_density,
        "feeding_rate": feeding_consistency,
        "initial_weight": current_weight,
        "days": (timezone.now().date() - plan.start_date).days,
    }

    # -------------------------
    # SNAPSHOT EXTRA FIELDS
    # -------------------------
    snapshot_meta = {
        "feeding_frequency": feeding_frequency,
        "feeding_consistency": feeding_consistency,
        "avg_protein": avg_protein,
        "temperature": temperature,
        "oxygen": oxygen,
        "ph": ph,
        "stocking_density": stocking_density,
        "current_weight": current_weight,
    }

    

    return features, snapshot_meta