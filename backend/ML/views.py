from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .services.prediction_service import generate_growth_prediction

from feeding.models import FeedingPlan

from .serializers import GrowthPredictionSerializer, DiseasePredictionSerializer
from .services.predictor import predict_growth
from .services.disease_detection import predict_disease


# class PredictGrowthView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         serializer = GrowthPredictionSerializer(data=request.data)

#         if serializer.is_valid():
#             result = predict_growth(serializer.validated_data)
#             return Response({"predicted_weight": result})

#         return Response(serializer.errors, status=400)

class PredictDiseaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DiseasePredictionSerializer(data=request.data)

        # -----------------------------
        # Validate input
        # -----------------------------
        if not serializer.is_valid():
            return Response(
                {"errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # -----------------------------
            # Run prediction
            # -----------------------------
            result = predict_disease(serializer.validated_data)

            # -----------------------------
            # Return FULL response
            # -----------------------------
            return Response(result, status=status.HTTP_200_OK)

        except ValueError as ve:
            # Known validation errors (e.g. invalid symptoms)
            return Response(
                {"error": str(ve)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            # Unexpected errors
            return Response(
                {"error": "Internal server error"},
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
    

# class DebugGeneratePredictionView(APIView):
#     def get(self, request):
#         plan = FeedingPlan.objects.filter(
#             user=request.user,
#             is_active=True
#         ).first()

#         if not plan:
#             return Response({"error": "No active plan"}, status=404)

#         snapshot = generate_growth_prediction(plan)

#         return Response({
#             "message": "Prediction generated",
#             "predicted_weight": snapshot.predicted_weight
#         })