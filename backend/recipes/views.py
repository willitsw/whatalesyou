from rest_framework import viewsets
from rest_framework.response import Response

from recipes.models import Recipe
from recipes.serializers import RecipeDetailSerializer, RecipeSerializer


class RecipesViewSet(viewsets.ModelViewSet):
    """
    Recipe CRUD
    """

    queryset = Recipe.objects.all()
    serializer_class = RecipeDetailSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = Recipe.objects.filter(owner__pk=request.user.pk)
        self.serializer_class = RecipeSerializer
        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        recipe_id = request.data.get("id")

        Recipe.objects.get_or_create(id=recipe_id, owner=request.user)
        return super().update(request, *args, **kwargs)
