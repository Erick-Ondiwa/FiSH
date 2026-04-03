from django.urls import path
from .views import PredictGrowthView, PredictDiseaseView

urlpatterns = [
    path("predict-growth/", PredictGrowthView.as_view()),
    path("disease-detection/", PredictDiseaseView.as_view()),
]