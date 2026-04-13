from django.core.management.base import BaseCommand
from feeding.models import Feed


class Command(BaseCommand):
    help = "Seed initial feed data"

    def handle(self, *args, **kwargs):

        feeds_data = [
            # -------------------------
            # TILAPIA - FINGERLINGS
            # -------------------------
            {
                "name": "Starter Crumbles",
                "species": "tilapia",
                "age_group": "fingerlings",
                "role": "primary",
                "protein_percent": 40,
                "description": "High protein starter feed for rapid early growth"
            },
            {
                "name": "High Protein Pellets",
                "species": "tilapia",
                "age_group": "fingerlings",
                "role": "booster",
                "protein_percent": 45,
                "description": "Boosts immunity and growth"
            },

            # -------------------------
            # TILAPIA - JUVENILE
            # -------------------------
            {
                "name": "Grower Pellets",
                "species": "tilapia",
                "age_group": "juvenile",
                "role": "primary",
                "protein_percent": 30,
                "description": "Balanced feed for mid-stage growth"
            },
            {
                "name": "Supplementary Feed",
                "species": "tilapia",
                "age_group": "juvenile",
                "role": "supplement",
                "protein_percent": 25,
                "description": "Adds nutritional diversity"
            },

            # -------------------------
            # CATFISH - FINGERLINGS
            # -------------------------
            {
                "name": "Floating Starter Feed",
                "species": "catfish",
                "age_group": "fingerlings",
                "role": "primary",
                "protein_percent": 42,
                "description": "Floating feed for easy monitoring"
            },

            # -------------------------
            # CATFISH - JUVENILE
            # -------------------------
            {
                "name": "Floating Grower Feed",
                "species": "catfish",
                "age_group": "juvenile",
                "role": "primary",
                "protein_percent": 32,
                "description": "Optimized for catfish growth"
            },

            # -------------------------
            # CATFISH - ADULT
            # -------------------------
            {
                "name": "Finisher Feed",
                "species": "catfish",
                "age_group": "adult",
                "role": "energy",
                "protein_percent": 28,
                "description": "Final growth stage feed"
            },

            # -------------------------
            # TROUT
            # -------------------------
            {
                "name": "High Protein Starter",
                "species": "trout",
                "age_group": "fingerlings",
                "role": "booster",
                "protein_percent": 50,
                "description": "Cold water high protein feed"
            },
            {
                "name": "Energy Dense Feed",
                "species": "trout",
                "age_group": "adult",
                "role": "energy",
                "protein_percent": 35,
                "description": "Supports high metabolism"
            },

            # -------------------------
            # NILE PERCH
            # -------------------------
            {
                "name": "Live Feed Mix",
                "species": "nile_perch",
                "age_group": "fingerlings",
                "role": "primary",
                "protein_percent": 48,
                "description": "Natural diet simulation"
            },
            {
                "name": "Protein Rich Pellets",
                "species": "nile_perch",
                "age_group": "juvenile",
                "role": "booster",
                "protein_percent": 38,
                "description": "Supports aggressive growth"
            },
        ]

        for item in feeds_data:
            Feed.objects.update_or_create(
                name=item["name"],   # unique identifier
                defaults=item
            )

        self.stdout.write(self.style.SUCCESS("Feeds seeded successfully"))