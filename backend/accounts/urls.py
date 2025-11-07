from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Step 1: Basic personal details
    path('register/step1/', views.RegisterStepOneAPIView.as_view(), name='register-step1'),
    path('register/step1/<int:pk>/', views.RegisterStepOneAPIView.as_view(), name='update-step1'),

    # Step 2: Location details
    path('register/step2/', views.RegisterStepTwoAPIView.as_view(), name='register-step2'),
    path('register/step2/<int:pk>/', views.RegisterStepTwoAPIView.as_view(), name='update-step2'),

    # Step 3: Farming details
    path('register/step3/<int:pk>/', views.RegisterStepThreeAPIView.as_view(), name='update-step3'),

    # Step 4: Confirmation & review
    path('register/step4/<int:pk>/', views.RegisterStepFourAPIView.as_view(), name='register-step4'),
]
