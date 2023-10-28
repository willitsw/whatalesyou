from typing import Any

from rest_framework import status, viewsets
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response

from .models import User
from .serializers import CreateUserSerializer, UpdateUserSerializer, UserSerializer
from .services import send_new_hire_email


class CanAccessUsers(BasePermission):
    """
    New users can be created via POST without authentication. Otherwise auth is required.
    """

    def has_permission(self, request, view):
        if request.method == "DELETE" and not request.user.is_staff:
            return False
        elif request.method == "POST" or request.user and request.user.is_authenticated:
            return True
        return False


class UserViewSet(viewsets.ModelViewSet):
    """
    User CRUD
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [CanAccessUsers]

    def list(self, request: Request, *args: Any, **kwargs: Any):
        if not request.user.is_staff:
            self.queryset = User.objects.filter(owner__user=request.user)
        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = UpdateUserSerializer
        return super().update(request, *args, **kwargs)

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        create_user_serializer = CreateUserSerializer(data=request.data)
        create_user_serializer.is_valid(raise_exception=True)

        request_data = create_user_serializer.data

        send_new_hire_email(
            request_data.get("email"), request_data.get("first_name", "New User")
        )

        new_user = User.objects.create_user(
            email=request_data.get("email"),
            first_name=request_data.get("first_name", ""),
            last_name=request_data.get("last_name", ""),
            password=request_data.get("password"),
        )

        new_user_serializer = UserSerializer(new_user)

        headers = self.get_success_headers(new_user_serializer.data)
        return Response(
            data=new_user_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )
