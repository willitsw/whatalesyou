from rest_framework import viewsets, mixins
from user_profiles.serializers import UserProfileSerializer
from user_profiles.models import UserProfile


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    User Profile CRUD
    """

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
