# ml/services/disease_log_service.py

from ..models import DiseaseLog

def log_disease_detection(user, pond, input_data, prediction_result):
    DiseaseLog.objects.create(
        user=user,
        pond=pond,

        species=input_data.get("species"),
        age_group=input_data.get("age_group"),

        temperature=input_data.get("temperature"),
        ph=input_data.get("ph"),
        oxygen=input_data.get("oxygen"),
        stocking_density=input_data.get("stocking_density"),

        recent_deaths=input_data.get("recent_deaths"),
        death_rate=input_data.get("death_rate"),

        symptoms=input_data.get("symptoms", []),

        predicted_disease=prediction_result["predicted_disease"],
        confidence=prediction_result.get("confidence"),

        severity=prediction_result["severity"],
        priority_actions=prediction_result["priority_actions"],
        recommendations=prediction_result["recommendations"],
        prevention=prediction_result["prevention"],
    )