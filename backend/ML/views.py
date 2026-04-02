from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import GrowthPredictionSerializer
from .services.prediction import predict_growth


class PredictGrowthView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GrowthPredictionSerializer(data=request.data)

        if serializer.is_valid():
            result = predict_growth(serializer.validated_data)
            return Response({"predicted_weight": result})

        return Response(serializer.errors, status=400)