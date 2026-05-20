from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import FeedingHistory

from .services.plan_service import start_feeding_plan
from .services.status_service import get_feeding_status
from .services.session_service import confirm_session
from .services.feeding_response import build_feeding_response
from .services.history_service import build_history_response

from .serializers import (
    StartFeedingSerializer,
    ConfirmSessionSerializer,
    FeedingHistoryResponseSerializer
)


# --------------------------------------------------
# 1. START FEEDING PLAN
# --------------------------------------------------

class StartFeedingPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StartFeedingSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            result = start_feeding_plan(
                user=request.user,
                species=serializer.validated_data["species"],
                age_group=serializer.validated_data["age_group"],
            )

            if "error" in result:
                return Response(
                    {"success": False, "message": result["error"]},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {"success": True, "data": result},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# --------------------------------------------------
# 2. GET FEEDING STATUS
# --------------------------------------------------

class FeedingStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            data, error = get_feeding_status(request.user)

            if error:
                return Response(
                    {"success": False, "message": error},
                    status=status.HTTP_404_NOT_FOUND
                )

            response = build_feeding_response(data)

            return Response(
                {"success": True, "data": response},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": str(e),
                    "type": e.__class__.__name__,
                },
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

            # Re-fetch updated status
            data, error = get_feeding_status(request.user)

            if error:
                return Response(
                    {"success": False, "message": error},
                    status=status.HTTP_400_BAD_REQUEST
                )

            response = build_feeding_response(data)

            return Response(
                {
                    "success": True,
                    "message": result.get("message", "Session confirmed"),
                    "data": response
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
                {
                    "success": False,
                    "message": str(e),
                    "type": e.__class__.__name__,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# --------------------------------------------------
# 4. FEEDING HISTORY
# --------------------------------------------------

class FeedingHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:

            # ----------------------------------------
            # FETCH HISTORY
            # ----------------------------------------

            history = list(
                FeedingHistory.objects.filter(
                    user=request.user
                ).prefetch_related(
                    "feeds"
                ).order_by(
                    "-scheduled_time"
                )[:50]
            )

            # ----------------------------------------
            # BUILD STRUCTURED RESPONSE
            # ----------------------------------------
            response_data = build_history_response(history)

            # ----------------------------------------
            # SERIALIZE STRUCTURED DATA
            # ----------------------------------------
            serializer = FeedingHistoryResponseSerializer(response_data)

            return Response(
                {
                    "success": True,
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {
                    "success": False,
                    "message": str(e),
                    "type": e.__class__.__name__,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )