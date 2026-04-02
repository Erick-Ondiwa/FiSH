from django.urls import path
from .views import PredictGrowthView

urlpatterns = [
    path("predict-growth/", PredictGrowthView.as_view()),
]