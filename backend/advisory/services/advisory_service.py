from advisory.models import AdvisoryContent
from advisory.models import FishSourcing
# from advisory.models.market import MarketPrice
from advisory.models import FishDisease


class AdvisoryService:

    @staticmethod
    def get_dashboard_context(user):
        """
        Builds full personalized advisory context
        for dashboard rendering.
        """

        profile = user.farmer_profile

        dashboard_data = {
            "welcome_message": AdvisoryService._build_welcome_message(user),
            "species_advisories": []
        }

        # Loop through each species (ArrayField)
        for species in profile.fish_species:
            advisory_bundle = AdvisoryService._build_species_bundle(profile, species)
            dashboard_data["species_advisories"].append(advisory_bundle)

        return dashboard_data

    # ---------------------------------------------------
    # Build Welcome Message
    # ---------------------------------------------------

    @staticmethod
    def _build_welcome_message(user):
        profile = user.farmer_profile

        return (
            f"Welcome {user.first_name or 'Farmer'}, "
            f"we'll guide you on how to rear "
            f"{', '.join(profile.fish_species)} "
            f"in a {profile.place_of_farming} setup."
        )

    # ---------------------------------------------------
    # Build Species Advisory Bundle
    # ---------------------------------------------------

    @staticmethod
    def _build_species_bundle(profile, species):

        advisory = AdvisoryService._get_best_match_advisory(profile, species)

        sourcing = FishSourcing.objects.filter(
            county=profile.county,
            fish_species=species,
            age_group=profile.age_group
        ).first()

        # market = MarketPrice.objects.filter(
        #     county=profile.county,
        #     fish_species=species
        # ).first()

        diseases = FishDisease.objects.filter(
            fish_species=species
        )

        return {
            "species": species,
            "age_group": profile.age_group,
            "advisory": advisory,
            "sourcing": sourcing,
            # "market": market,
            "diseases": diseases
        }

    # ---------------------------------------------------
    # Intelligent Advisory Matching
    # ---------------------------------------------------

    @staticmethod
    def _get_best_match_advisory(profile, species):

        # LEVEL 1: county + subcounty
        advisory = AdvisoryContent.objects.filter(
            county=profile.county,
            subcounty=profile.subcounty,
            place_of_farming=profile.place_of_farming,
            fish_species=species,
            age_group=profile.age_group,
            is_active=True
        ).first()

        if advisory:
            return advisory

        # LEVEL 2: county only
        advisory = AdvisoryContent.objects.filter(
            county=profile.county,
            place_of_farming=profile.place_of_farming,
            fish_species=species,
            age_group=profile.age_group,
            is_active=True
        ).first()

        if advisory:
            return advisory

        # LEVEL 3: ignore region
        advisory = AdvisoryContent.objects.filter(
            place_of_farming=profile.place_of_farming,
            fish_species=species,
            age_group=profile.age_group,
            is_active=True
        ).first()

        if advisory:
            return advisory

        # LEVEL 4: global fallback
        advisory = AdvisoryContent.objects.filter(
            fish_species=species,
            age_group=profile.age_group,
            is_active=True
        ).first()

        return advisory
