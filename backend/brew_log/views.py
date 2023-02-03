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
        self.queryset = BrewLog.objects.filter(recipe__owner__user=request.user)
        return super().list(request, *args, **kwargs)
