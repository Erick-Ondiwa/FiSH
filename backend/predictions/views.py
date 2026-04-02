import joblib
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import GrowthPredictionSerializer

# Load model and encoder globally for performance
MODEL_PATH = os.path.join(settings.BASE_DIR, 'ml_models/fish_growth_model.pkl')
ENCODER_PATH = os.path.join(settings.BASE_DIR, 'ml_models/species_encoder.pkl')

model = joblib.load(MODEL_PATH)
le = joblib.load(ENCODER_PATH)

class PredictGrowthView(APIView):
    def post(self, request):
        serializer = GrowthPredictionSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            
            try:
                # 1. Encode the species string into a number
                species_encoded = le.transform([data['species']])[0]
                
                # 2. Prepare features in the exact order used during training
                features = [
                    species_encoded, 
                    data['temperature'], 
                    data['oxygen'], 
                    data['ph'], 
                    data['density'], 
                    data['feeding_rate'], 
                    data['initial_weight'], 
                    data['days']
                ]
                
                # 3. Make prediction
                prediction = model.predict([features])[0]
                
                return Response({
                    'predicted_weight': round(float(prediction), 2),
                    'status': 'success'
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)