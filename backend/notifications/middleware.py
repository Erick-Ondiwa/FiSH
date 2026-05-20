# notifications/middleware.py

from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        try:
            query_string = scope["query_string"].decode()
            query_params = parse_qs(query_string)

            token = query_params.get("token", [None])[0]

            if token:
                access_token = AccessToken(token)
                user_id = access_token["user_id"]

                user = await database_sync_to_async(User.objects.get)(id=user_id)
                scope["user"] = user
            else:
                scope["user"] = AnonymousUser()

        except Exception as e:
            print("JWT ERROR:", str(e))
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

# from urllib.parse import parse_qs
# from django.contrib.auth.models import AnonymousUser
# from rest_framework_simplejwt.tokens import AccessToken
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class JWTAuthMiddleware:
#     def __init__(self, app):
#         self.app = app

#     async def __call__(self, scope, receive, send):
#         query_string = parse_qs(scope["query_string"].decode())

#         token = query_string.get("token")

#         if token:
#             try:
#                 access_token = AccessToken(token[0])
#                 scope["user"] = User.objects.get(id=access_token["user_id"])
#             except:
#                 scope["user"] = AnonymousUser()
#         else:
#             scope["user"] = AnonymousUser()

#         return await self.app(scope, receive, send)