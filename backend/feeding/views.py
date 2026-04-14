from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .services.plan_service import start_feeding_plan
from .services.status_service import get_feeding_status
from .services.session_service import  confirm_session
from .services.history_service import get_feeding_history

from .serializers import (
    StartFeedingSerializer,
    ConfirmSessionSerializer,
    FeedingHistoryResponseSerializer
)

from .services.notification_service import (
    get_all_notifications,
    mark_all_as_read
)

# --------------------------------------------------
# 1. START FEEDING PLAN
# --------------------------------------------------

class StartFeedingPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StartFeedingSerializer(data=request.data)

        if serializer.is_valid():
            try:
                result = start_feeding_plan(
                    user=request.user,
                    species=serializer.validated_data["species"],
                    age_group=serializer.validated_data["age_group"],
                )

                if "error" in result:
                    return Response(result, status=status.HTTP_400_BAD_REQUEST)

                return Response(result, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------------------------------------------------
# 2. GET FEEDING STATUS
# --------------------------------------------------
class FeedingStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            result = get_feeding_status(request.user)

            if "error" in result:
                return Response(result, status=status.HTTP_404_NOT_FOUND)

            return Response(
                {
                    "success": True,
                    "data": result
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# --------------------------------------------------
# 3. CONFIRM SESSION
# --------------------------------------------------
class ConfirmSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ConfirmSessionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            result = confirm_session(
                user=request.user,
                session_id=serializer.validated_data["session_id"]
            )

            updated_status = get_feeding_status(request.user)

            return Response(
                {
                    "success": True,
                    "message": result["message"],
                    "data": updated_status
                },
                status=status.HTTP_200_OK
            )

        except ValueError as ve:
            return Response(
                {"success": False, "message": str(ve)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {"success": False, "message": "Internal server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# --------------------------------------------------
# 4. GET FEEDING ALERTS
# --------------------------------------------------
class FeedingAlertsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            alerts = get_due_sessions(request.user)

            return Response(
                {
                    "success": True,
                    "data": {
                        "alerts": alerts,
                        "count": len(alerts)
                    }
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class FeedingHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            result = get_feeding_history(request.user)

            if "error" in result:
                return Response(result, status=status.HTTP_404_NOT_FOUND)

            serializer = FeedingHistoryResponseSerializer(result)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class NotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = get_all_notifications(request.user)
        return Response({
            "success": True,
            "data": data
        })


class MarkNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        mark_all_as_read(request.user)
        return Response({
            "success": True,
            "message": "All notifications marked as read"
        })