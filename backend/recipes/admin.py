from django.contrib import admin

from .models import Chemistry, Culture, Fermentable, Hop, NonFermentable, Recipe

admin.site.register(Recipe)
admin.site.register(Fermentable)
admin.site.register(Hop)
admin.site.register(Culture)
admin.site.register(Chemistry)
admin.site.register(NonFermentable)
