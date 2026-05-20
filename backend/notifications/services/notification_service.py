from notifications.models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def create_notification(user, title, type, message):
    notification = Notification.objects.create(
        user=user,
        title =title,
        type=type,
        message=message
    )
    # 🔥 PUSH REAL-TIME
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        f"user_{user.id}",
        {
            "type": "send_notification",
            "data": {
                "id": notification.id,
                "type": notification.type,
                "title": notification.title,
                "message": notification.message,
                "created_at": str(notification.created_at),
                "is_read": notification.is_read,
            },
        },
    )

    return notification