from django.urls import path
from .views import GrowthHistoryView, PredictDiseaseView, DiseaseHistoryView
urlpatterns = [
    path("growth-history/", GrowthHistoryView.as_view()),
    path("disease-detection/", PredictDiseaseView.as_view()),
    path("disease-history/", DiseaseHistoryView.as_view()),

]
