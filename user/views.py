from typing import Any, Optional

from django.http import HttpRequest
from rest_framework import status, viewsets
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.response import Response

from .models import User
from .serializers import CreateUserSerializer, UpdateUserSerializer, UserSerializer
from .services import (
    generate_verification_code,
    reset_verification_code,
    send_forgot_password_email,
    send_new_user_email,
)


class CanAccessUsers(BasePermission):
    """
    New users can be created via POST without authentication. Otherwise auth is required.
    """

    def has_permission(self, request, view):
        if request.method == "DELETE" and not request.user.is_staff:
            return False
        if request.method == "POST" or request.user and request.user.is_authenticated:
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
        access_code = generate_verification_code()

        send_new_user_email(
            request_data.get("email"),
            request_data.get("first_name", "New User"),
            access_code,
        )

        new_user = User.objects.create_user(
            email=request_data.get("email"),
            first_name=request_data.get("first_name", ""),
            last_name=request_data.get("last_name", ""),
            password=request_data.get("password"),
            verification_code=access_code,
        )

        new_user_serializer = UserSerializer(new_user)

        headers = self.get_success_headers(new_user_serializer.data)
        return Response(
            data=new_user_serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


@api_view(["POST"])
def verification_code_check(request: HttpRequest) -> Response:
    validation_code: str = request.data.get("token", None)

    user: User = request.user

    if not validation_code or validation_code != user.verification_code:
        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data={"error": "The code entered is not correct, please try again"},
        )

    user.is_verified = True
    user.verification_code = ""

    user.save()

    return Response(
        status=status.HTTP_200_OK,
    )


@api_view(["GET"])
def send_new_code(request: HttpRequest) -> Response:
    user: User = request.user

    access_code = generate_verification_code()
    user.verification_code = access_code
    user.is_verified = False
    reset_verification_code(user.email, user.first_name, access_code)
    user.save()

    return Response(
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def initiate_reset_password(request: HttpRequest) -> Response:
    email: str = request.data.get("email", None)

    user: Optional[User] = User.objects.get_or_none(email=email)

    if user:
        access_code = generate_verification_code()
        send_forgot_password_email(user.email, user.first_name, access_code)
        user.verification_code = access_code
        user.save()

    return Response(
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def process_reset_password(request: HttpRequest) -> Response:
    email: str = request.data.get("email", None)
    validation_code: str = request.data.get("code", None)
    new_password: str = request.data.get("password", None)

    user: User = User.objects.get(email=email)

    if (
        not validation_code
        or not user
        or not new_password
        or validation_code != user.verification_code
    ):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.verification_code = ""

    user.save()

    return Response(
        status=status.HTTP_200_OK,
    )
