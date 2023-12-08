from django.urls import path

from frontend import views

urlpatterns = [
    path("", views.index, {"resource": ""}),
    path("<path:resource>", views.index),
]
