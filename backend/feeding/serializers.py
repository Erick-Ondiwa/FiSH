from rest_framework import serializers
from .models import Feed, FeedingPlan, FeedingDay, FeedingSession

# ==================================================
# 1. INPUT SERIALIZERS
# ==================================================

class StartFeedingSerializer(serializers.Serializer):
    species = serializers.CharField()
    age_group = serializers.CharField()

    def validate_species(self, value):
        return value.lower().strip()

    def validate_age_group(self, value):
        return value.lower().strip()


class ConfirmSessionSerializer(serializers.Serializer):
    session_id = serializers.IntegerField()

    def validate_session_id(self, value):
        if not FeedingSession.objects.filter(id=value).exists():
            raise serializers.ValidationError("Session does not exist")
        return value


# ==================================================
# 2. CORE MODEL SERIALIZERS (INTERNAL USE)
# ==================================================

class FeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feed
        fields = [
            "id",
            "name",
            "role",
            "protein_percent",
        ]


class FeedingSessionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedingSession
        fields = "__all__"


# ==================================================
# 3. RESPONSE SERIALIZERS (CRITICAL)
# ==================================================

class FeedingSessionResponseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    session = serializers.IntegerField()
    time = serializers.CharField()

    status = serializers.CharField()

    # CONTROL FLAGS (NEW)
    is_current = serializers.BooleanField()
    is_upcoming = serializers.BooleanField()
    is_confirmable = serializers.BooleanField()

    # ONLY CURRENT SESSION SHOULD HAVE FEEDS
    feeds = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )


class FeedingStatusSerializer(serializers.Serializer):
    day = serializers.IntegerField()
    current_session = FeedingSessionResponseSerializer()
    upcoming_session = FeedingSessionResponseSerializer()


class FeedingAlertSerializer(serializers.Serializer):
    session_id = serializers.IntegerField()
    message = serializers.CharField()


class FeedingAlertsResponseSerializer(serializers.Serializer):
    alerts = FeedingAlertSerializer(many=True)
    count = serializers.IntegerField()


# ==================================================
# 4. LIGHTWEIGHT SERIALIZERS (OPTIONAL)
# ==================================================

class SimpleSessionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    session = serializers.IntegerField()
    time = serializers.CharField()
    status = serializers.CharField()



# ==================================================
# FEEDING HISTORY SERIALIZERS
# ==================================================

class FeedingHistorySessionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    session = serializers.IntegerField()
    time = serializers.CharField()
    status = serializers.CharField()
    feeds = serializers.ListField(child=serializers.CharField())


class FeedingHistoryDaySummarySerializer(serializers.Serializer):
    completed = serializers.IntegerField()
    missed = serializers.IntegerField()
    total = serializers.IntegerField()
    completion_rate = serializers.IntegerField()


class FeedingHistoryDaySerializer(serializers.Serializer):
    day = serializers.IntegerField()
    date = serializers.DateField()
    sessions = FeedingHistorySessionSerializer(many=True)
    summary = FeedingHistoryDaySummarySerializer()


class FeedingHistoryOverallSerializer(serializers.Serializer):
    total_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()
    completion_rate = serializers.IntegerField()


class FeedingHistoryResponseSerializer(serializers.Serializer):
    days = FeedingHistoryDaySerializer(many=True)
    overall = FeedingHistoryOverallSerializer()


class NotificationSerializer(serializers.Serializer):
    type = serializers.CharField()
    message = serializers.CharField()
    session_id = serializers.IntegerField(required=False)
    is_read = serializers.BooleanField(required=False)
    created_at = serializers.DateTimeField(required=False)


class NotificationsResponseSerializer(serializers.Serializer):
    alerts = NotificationSerializer(many=True)
    count = serializers.IntegerField()