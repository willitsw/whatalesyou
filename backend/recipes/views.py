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

    def create(self, request, *args, **kwargs):
        recipe_id = request.data.get("id")

        existing_recipe = Recipe.objects.get_or_create(pk=recipe_id, owner=request.user)

        return super().create(request, *args, **kwargs)

    # def update(self, request, *args, **kwargs):
    #     recipe_id = request.data.get("id")

    #     recipe = self.queryset.get(pk=recipe_id)

    #     serializer = RecipeDetailSerializer(recipe, data=request.data)

    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)

    #     return Response()

    # recipe = self.get_object(pk)
    # serializer = RecipeDetailSerializer(snippet, data=request.data)
    # if serializer.is_valid():
    #     serializer.save()
    #     return Response(serializer.data)
    # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
