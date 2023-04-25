from rest_framework import viewsets

from .models import BrewLog
from .serializers import BrewLogSerializer


class BrewLogViewSet(viewsets.ModelViewSet):
    """
    Brew Log CRUD
    """

    queryset = BrewLog.objects.all()
    serializer_class = BrewLogSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = BrewLog.objects.filter(recipe__owner=request.user)
        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        brew_log_id = request.data.get("id")

        BrewLog.objects.get_or_create(id=brew_log_id, owner=request.user)
        return super().update(request, *args, **kwargs)
