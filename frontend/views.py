from django.http import HttpResponse
from django.shortcuts import render


def index(request, **_):
    return render(request, "index.html")


def java_script(request):
    filename = "frontend/static" + request.path.split("static")[1]
    data = open(filename, "rb").read()
    return HttpResponse(data, content_type="application/x-javascript")
