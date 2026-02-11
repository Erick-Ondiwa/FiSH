from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FarmerProfile

from django.contrib.auth import authenticate

User = get_user_model()
# -------------------------------------------------------
#  USER SERIALIZER (Step 1: Basic Personal Details)
# -------------------------------------------------------

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Handles creation and partial update of basic user details.
    Used for Step 1 of multi-step registration.
    """
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 
            'first_name', 
            'last_name', 
            'email', 
            'phone', 
            'password', 
            'confirm_password',
            'username', 
            'role', 
            'is_verified'
        ]
        read_only_fields = ['username', 'is_verified']

    def validate(self, data):
        """
        Ensure password confirmation and apply Django's password validation rules.
        """
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        # If either field is missing, don't block partial updates
        if password or confirm_password:
            if password != confirm_password:
                raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
            try:
                validate_password(password)
            except DjangoValidationError as e:
                raise serializers.ValidationError({"password": list(e.messages)})

        return data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        """
        Allow updating user info (useful for Save & Continue)
        """
        password = validated_data.pop('password', None)
        validated_data.pop('confirm_password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        instance.save()
        return instance

# -------------------------------------------------------
# FARMER PROFILE SERIALIZER (Steps 2 & 3)
# -------------------------------------------------------

class FarmerProfileSerializer(serializers.ModelSerializer):
    """
    Handles the farmer's extended details (location + farming info).
    Supports partial saves to enable 'Save and Continue'.
    """
    class Meta:
        model = FarmerProfile
        fields = [
            'id', 'user', 'county', 'subcounty',
            'place_of_farming', 'fish_species', 'age_group', 'date_registered'
        ]
        read_only_fields = ['date_registered']

    def create(self, validated_data):
        return FarmerProfile.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
# -------------------------------------------------------
# COMBINED SERIALIZER (Step 4: Confirmation & Review)
# -------------------------------------------------------

class CompleteFarmerRegistrationSerializer(serializers.Serializer):
    """
    Combines both User and FarmerProfile for final confirmation.
    Ensures everything is linked properly and registration is complete.
    """
    user = UserRegistrationSerializer()
    farmer_profile = FarmerProfileSerializer()

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        profile_data = validated_data.pop('farmer_profile')

        # Create or update user
        user, created = User.objects.update_or_create(
            email=user_data.get('email'),
            defaults=user_data
        )
        # Create or update farmer profile
        FarmerProfile.objects.update_or_create(
            user=user,
            defaults=profile_data
        )

        return {'user': user, 'farmer_profile': user.farmer_profile}


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        data["user"] = user
        return data


