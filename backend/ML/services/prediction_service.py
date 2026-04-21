from django.utils import timezone
from .predictor import predict_growth
from .feature_builder import build_growth_features
from ..models import GrowthSnapshot


def generate_growth_prediction(plan):
    features, snapshot_meta = build_growth_features(plan)

    print("MODEL INPUT:", features)

    predicted_weight = predict_growth(features)

    snapshot = GrowthSnapshot.objects.create(
        plan=plan,
        date=timezone.now().date(),

        # -------------------------
        # FEATURES (SAVE FOR ANALYTICS)
        # -------------------------
        feeding_frequency=snapshot_meta["feeding_frequency"],
        feeding_consistency=snapshot_meta["feeding_consistency"],
        avg_protein=snapshot_meta["avg_protein"],

        temperature=snapshot_meta["temperature"],
        oxygen=snapshot_meta["oxygen"],
        ph=snapshot_meta["ph"],

        stocking_density=snapshot_meta["stocking_density"],
        current_weight=snapshot_meta["current_weight"],

        # -------------------------
        # OUTPUT
        # -------------------------
        predicted_weight=predicted_weight,
    )

    return snapshot