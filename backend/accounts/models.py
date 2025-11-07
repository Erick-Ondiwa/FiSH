from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.utils.text import slugify
from django.utils import timezone
import uuid

# -------------------------------------------------------
# 1️⃣ Base Custom User Model
# -------------------------------------------------------

class User(AbstractUser):
    """
    Custom User model that supports multiple roles (Farmer, Fisherman, Buyer, Seller).
    Username is auto-generated if not provided.
    """
    USER_ROLES = [
        ('aspiring-farmer', 'Aspiring-farmer'),
        ('farmer', 'Farmer'),
        ('fisherman', 'Fisherman'),
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    ]

    # Additional fields
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True)
    role = models.CharField(max_length=20, choices=USER_ROLES, default='farmer')
    is_verified = models.BooleanField(default=False)

    # Override username to allow backend auto-generation
    username = models.CharField(max_length=50, unique=True, blank=True)

    REQUIRED_FIELDS = ['phone']
    USERNAME_FIELD = 'email'

    def save(self, *args, **kwargs):
        # Auto-generate username if missing
        if not self.username:
            base = slugify(self.first_name or "user")
            unique_suffix = uuid.uuid4().hex[:6]
            self.username = f"{base}-{unique_suffix}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"

# -------------------------------------------------------
# 2️⃣ Farmer Profile Model (Aspiring or Existing)
# -------------------------------------------------------

class FarmerProfile(models.Model):
    """
    Stores extended registration details for farmers (aspiring or existing).
    """
    FARMING_PLACES = [
        ('pond', 'Pond'),
        ('lake', 'Lake'),
        ('cage', 'Cage'),
        ('other', 'Other'),
    ]

    FISH_SPECIES = [
        ('tilapia', 'Tilapia'),
        ('nile perch', 'Nile Perch'),
        ('trout', 'Trout'),
        ('catfish', 'Catfish'),
        ('other', 'Other'),
    ]

    AGE_GROUPS = [
        ('fingerlings', 'Fingerlings'),
        ('juvenile', 'Juvenile'),
        ('mature', 'Mature Fish'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')

    # Location Details
    county = models.CharField(max_length=100)
    subcounty = models.CharField(max_length=100)

    # Farming Details
    place_of_farming = models.CharField(max_length=50, choices=FARMING_PLACES)
    fish_species = ArrayField(
        models.CharField(max_length=50, choices=FISH_SPECIES),
        default=list,
        blank=True,
    )
    age_group = models.CharField(max_length=50, choices=AGE_GROUPS)

    date_registered = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.fish_species} ({self.place_of_farming})"


# -------------------------------------------------------
# 3️⃣ Future Extendability
# -------------------------------------------------------
# You can later add similar profiles for other user types, like:

# class FishermanProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='fisherman_profile')
#     ...
#
# class BuyerProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='buyer_profile')
#     ...
#
# class SellerProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller_profile')
#     ...


