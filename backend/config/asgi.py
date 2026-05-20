from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from notifications.routing import websocket_urlpatterns

from channels.auth import AuthMiddlewareStack

application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})

# import os

# # ✅ MUST BE FIRST
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from notifications.routing import websocket_urlpatterns

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),

#     # Use AuthMiddlewareStack first (debug), not JWT yet
#     "websocket": AuthMiddlewareStack(
#         URLRouter(websocket_urlpatterns)
#     ),
# })