from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .services.prediction_service import generate_growth_prediction

from feeding.models import FeedingPlan
from .models import DiseaseLog
from accounts.models import FarmerProfile

from .serializers import GrowthPredictionSerializer, DiseasePredictionSerializer
from .services.predictor import predict_growth
from .services.disease_detection import predict_disease
from .services.disease_service import run_disease_detection
from .services.disease_log_service import log_disease_detection

from farm.models import Pond

class PredictDiseaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DiseasePredictionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = request.user

            # -----------------------------
            # 2. GET POND
            # -----------------------------
            pond = Pond.objects.filter(owner=user).first()

            if not pond:
                return Response(
                    {"error": "No pond found"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            water = pond.water_records.order_by("-recorded_at").first()

            if not water:
                return Response(
                    {"error": "No water quality data found"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            profile = FarmerProfile.objects.get(user=user)
            input_data = {
                # -------------------------
                # FROM POND
                # -------------------------
                "species": pond.species,
                "age_group": pond.age_group,
                "age_days": pond.age_days,
                "stocking_density": pond.stocking_density,
                "current_weight": pond.current_avg_weight,
                "water_source": profile.farming_method,

                # -------------------------
                # FROM WATER
                # -------------------------
                "temperature": water.temperature,
                "ph": water.ph,
                "oxygen": water.dissolved_oxygen,

                # -------------------------
                # FROM USER
                # -------------------------
                **serializer.validated_data,
            }

            # -----------------------------
            # 5. RUN MODEL
            # -----------------------------
            result = run_disease_detection(
                user=request.user,
                data=input_data
            )
            return Response(result, status=status.HTTP_200_OK)

        except ValueError as ve:
            return Response(
                {"error": str(ve)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {
                    "error": str(e),
                    "type": e.__class__.__name__,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GrowthHistoryView(APIView):
    def get(self, request):
        plan = FeedingPlan.objects.filter(
            user=request.user,
            is_active=True
        ).first()

        if not plan:
            return Response({"error": "No active plan"}, status=404)

        snapshots = plan.growth_snapshots.order_by("date")

        data = [
            {
                "date": s.date,
                "predicted_weight": s.predicted_weight,
                "feeding_consistency": s.feeding_consistency,
                "avg_protein": s.avg_protein,
                "temperature": s.temperature,
            }
            for s in snapshots
        ]

        return Response({
            "count": len(data),
            "data": data,
            "latest": data[-1] if data else None
        })
    

class DiseaseHistoryView(APIView):
    def get(self, request):
        logs = request.user.disease_logs.order_by("-created_at")[:50]

        print (logs)

        data = [
            {
                "id": log.id,
                "date": log.created_at,
                "disease": log.predicted_disease,
                "confidence": log.confidence,
                "severity": log.severity,
                "symptoms": log.symptoms,
                "actions": log.priority_actions,
            }
            for log in logs
        ]

        return Response({
            "count": len(data),
            "data": data
        })