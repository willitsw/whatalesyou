from typing import Any
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.request import Request
from .models import User
from .serializers import UserSerializer, CreateUserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    User CRUD
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer

    def list(self, request: Request, *args: Any, **kwargs: Any):
        if not request.user.is_staff:
            self.queryset = User.objects.filter(owner__user=request.user)
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        self.serializer_class = CreateUserSerializer
        return super().create(request, *args, **kwargs)