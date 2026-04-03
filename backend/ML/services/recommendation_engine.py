def get_recommendations(disease: str, species: str = None):
    """
    Returns structured recommendations based on:
    - disease
    - species (optional but recommended)
    """

    # -----------------------------
    # Base Recommendations
    # -----------------------------
    base = {
        "low_oxygen_stress": {
            "severity": "high",
            "priority_actions": [
                "Increase aeration immediately",
                "Stop feeding temporarily"
            ],
            "recommendations": [
                "Use aerators or water pumps to increase oxygen levels.",
                "Reduce stocking density if overcrowded.",
                "Perform partial water exchange."
            ],
            "prevention": [
                "Monitor dissolved oxygen daily",
                "Avoid overstocking",
                "Install backup aeration systems"
            ]
        },

        "bacterial_infection": {
            "severity": "high",
            "priority_actions": [
                "Isolate infected fish immediately",
                "Remove dead fish from pond"
            ],
            "recommendations": [
                "Apply antibacterial treatment (consult expert).",
                "Improve water hygiene and sanitation.",
                "Disinfect equipment regularly."
            ],
            "prevention": [
                "Avoid injuries during handling",
                "Maintain good water quality",
                "Quarantine new fish before stocking"
            ]
        },

        "fungal_infection": {
            "severity": "medium",
            "priority_actions": [
                "Treat infected fish with antifungal agents"
            ],
            "recommendations": [
                "Apply salt baths or antifungal treatment.",
                "Improve water conditions.",
                "Remove severely infected fish."
            ],
            "prevention": [
                "Avoid fish injuries",
                "Maintain clean water",
                "Reduce stress factors"
            ]
        },

        "parasite_infection": {
            "severity": "medium",
            "priority_actions": [
                "Start anti-parasitic treatment immediately"
            ],
            "recommendations": [
                "Use anti-parasitic medication.",
                "Quarantine infected fish.",
                "Disinfect pond if outbreak spreads."
            ],
            "prevention": [
                "Avoid introducing infected fish",
                "Maintain biosecurity measures",
                "Monitor fish behavior regularly"
            ]
        },

        "poor_water_quality": {
            "severity": "high",
            "priority_actions": [
                "Change water immediately",
                "Stop feeding temporarily"
            ],
            "recommendations": [
                "Adjust pH to optimal range.",
                "Improve filtration and circulation.",
                "Reduce waste buildup."
            ],
            "prevention": [
                "Test water parameters regularly",
                "Avoid overfeeding",
                "Maintain proper filtration systems"
            ]
        },

        "healthy": {
            "severity": "low",
            "priority_actions": [],
            "recommendations": [
                "Maintain current conditions.",
                "Continue monitoring fish regularly."
            ],
            "prevention": [
                "Regular water testing",
                "Follow proper feeding schedule",
                "Observe fish behavior daily"
            ]
        }
    }

    # -----------------------------
    # Get base data
    # -----------------------------
    data = base.get(disease, {
        "severity": "unknown",
        "priority_actions": [],
        "recommendations": ["No recommendations available"],
        "prevention": []
    })

    # -----------------------------
    # Species-specific adjustments
    # -----------------------------
    if species:
        species = species.lower()

        # Trout → very sensitive to oxygen
        if disease == "low_oxygen_stress" and species == "trout":
            data["priority_actions"].insert(0, "URGENT: Increase oxygen immediately (trout are highly sensitive)")
            data["recommendations"].append("Maintain oxygen above 7 mg/L for trout")

        # Catfish → tolerant but overcrowding risk
        if disease == "poor_water_quality" and species == "catfish":
            data["recommendations"].append("Reduce high organic waste (catfish ponds accumulate waste faster)")

        # Tilapia → hardy but disease spreads fast in crowding
        if disease == "bacterial_infection" and species == "tilapia":
            data["recommendations"].append("Check for overcrowding — tilapia spread infections quickly")

        # Nile perch → high predatory stress
        if species == "nile perch":
            data["prevention"].append("Ensure adequate space to reduce stress and aggression")

    return data