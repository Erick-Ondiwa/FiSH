from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FarmerProfile

User = get_user_model()


# -------------------------------------------------------
#  USER SERIALIZER (Step 1: Basic Personal Details)
# -------------------------------------------------------

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Handles creation and partial update of basic user details.
    Used for Step 1 of multi-step registration.
    """
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'password', 'username', 'role', 'is_verified']
        read_only_fields = ['username', 'is_verified']

    def create(self, validated_data):
        password = validated_data.pop('password', None)
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
