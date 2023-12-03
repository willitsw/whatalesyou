from rest_framework import viewsets

from .models import BrewSetting
from .serializers import BrewSettingSerializer


class BrewSettingViewSet(viewsets.ModelViewSet):
    """
    Brew Settings CRUD
    """

    queryset = BrewSetting.objects.all()
    serializer_class = BrewSettingSerializer

    def list(self, request, *args, **kwargs):
        if not request.user.is_staff:
            self.queryset = BrewSetting.objects.filter(owner=request.user)
        return super().list(request, *args, **kwargs)
