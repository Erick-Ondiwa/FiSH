from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/core/", include("core.urls")),
    path("api/accounts/", include("accounts.urls")),
    path('api/advisory/', include('advisory.urls')),
    path('api/ml/', include('ML.urls')),
    path('api/feeding/', include('feeding.urls')),
    path('api/farm/', include('farm.urls')),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
