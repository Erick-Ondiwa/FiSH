from rest_framework import serializers
from .models import (
    AdvisorySection,
    AdvisoryGuide,
    AdvisoryStep,
    UserOnboardingProgress,
)
class AdvisorySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvisorySection
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "icon",
            "order",
        )
class AdvisoryStepSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = AdvisoryStep
        fields = (
            "id",
            "step_number",
            "title",
            "description",
            "image_url",
            "video_url",
            "is_mandatory",
        )
    
    image_url = serializers.SerializerMethodField()
    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

class AdvisoryGuideSerializer(serializers.ModelSerializer):
    section = AdvisorySectionSerializer(read_only=True)
    steps = AdvisoryStepSerializer(many=True, read_only=True)

    class Meta:
        model = AdvisoryGuide
        fields = (
            "id",
            "section",
            "introduction",
            "steps",
        )
class UserOnboardingProgressSerializer(serializers.ModelSerializer):
    completion_percentage = serializers.SerializerMethodField()

    class Meta:
        model = UserOnboardingProgress
        fields = (
            "farm_setup_completed",
            "fish_sourcing_completed",
            "completion_percentage",
        )

    def get_completion_percentage(self, obj):
        return obj.overall_completion_percentage()
