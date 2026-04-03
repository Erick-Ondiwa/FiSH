from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


from .serializers import GrowthPredictionSerializer, DiseasePredictionSerializer
from .services.prediction import predict_growth
from .services.disease_detection import predict_disease


class PredictGrowthView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GrowthPredictionSerializer(data=request.data)

        if serializer.is_valid():
            result = predict_growth(serializer.validated_data)
            return Response({"predicted_weight": result})

        return Response(serializer.errors, status=400)

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