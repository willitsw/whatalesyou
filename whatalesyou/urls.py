"""whatalesyou URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from brew_log.views import BrewLogViewSet
from brew_settings.views import BrewSettingViewSet
from recipes.views import RecipesViewSet
from user.views import (
    UserViewSet,
    initiate_reset_password,
    process_reset_password,
    verification_code_check,
)
from whatalesyou import views as core_views

router = routers.DefaultRouter()
router.register(r"recipes", RecipesViewSet)
router.register(r"users", UserViewSet)
router.register(r"brew-logs", BrewLogViewSet)
router.register(r"brew-settings", BrewSettingViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path("admin/", admin.site.urls),
    path("api/api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/validate-new-user/", verification_code_check),
    path("api/initiate-password-reset/", initiate_reset_password),
    path("api/process-password-reset/", process_reset_password),
    path("", include("frontend.urls")),
    path("favicon.ico", core_views.favicon),
]
