from rest_framework import viewsets

from recipes.models import Recipe
from recipes.serializers import RecipeDetailSerializer, RecipeSerializer


class RecipesViewSet(viewsets.ModelViewSet):
    """
    Recipe CRUD
    """

    queryset = Recipe.objects.all()
    serializer_class = RecipeDetailSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = Recipe.objects.filter(owner__user=request.user)
        self.serializer_class = RecipeSerializer
        return super().list(request, *args, **kwargs)
