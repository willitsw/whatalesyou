from django.urls import path, re_path

from frontend import views

urlpatterns = [
    re_path(r".*\.js$", views.java_script),
    path("", views.index, {"resource": ""}),
    path("<path:resource>", views.index),
]
