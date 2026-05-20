from .disease_detection import predict_disease
from .disease_log_service import log_disease_detection
from farm.models import Pond

def run_disease_detection(user, data):
    # ----------------------------------------
    # 1. Get pond (optional but recommended)
    # ----------------------------------------
    pond = Pond.objects.filter(owner=user).first()

    # ----------------------------------------
    # 2. Run prediction
    # ----------------------------------------
    result = predict_disease(data)

    # ----------------------------------------
    # 3. Log result
    # ----------------------------------------
    log_disease_detection(
        user=user,
        pond=pond,
        input_data=data,
        prediction_result=result
    )

    return result