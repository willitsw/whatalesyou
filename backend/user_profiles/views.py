from rest_framework import mixins, viewsets
from rest_framework.exceptions import PermissionDenied

from user_profiles.models import UserProfile
from user_profiles.serializers import UserProfileSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    User Profile CRUD
    """

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def list(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied({"message": "user is not authorized to do this"})
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        if (
            not request.user.is_staff
            and int(self.kwargs["pk"]) != request.user.profile.pk
        ):
            raise PermissionDenied({"message": "user is not authorized to do this"})
        return super().retrieve(request, *args, **kwargs)
