from drf_writable_nested.serializers import WritableNestedModelSerializer
from rest_framework import serializers

from recipes.models import Chemistry, Culture, Fermentable, Hop, NonFermentable, Recipe


class FermentableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fermentable
        fields = "__all__"


class ChemistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Chemistry
        fields = "__all__"


class NonFermentableSerializer(serializers.ModelSerializer):
    class Meta:
        model = NonFermentable
        fields = "__all__"


class HopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hop
        fields = "__all__"


class CultureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Culture
        fields = "__all__"


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = "__all__"


class RecipeDetailSerializer(
    WritableNestedModelSerializer, serializers.ModelSerializer
):
    fermentables = FermentableSerializer(many=True)
    chemistry = ChemistrySerializer(many=True)
    hops = HopSerializer(many=True)
    cultures = CultureSerializer(many=True)
    non_fermentables = NonFermentableSerializer(many=True)

    class Meta:
        model = Recipe
        fields = "__all__"
