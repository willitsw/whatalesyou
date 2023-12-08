from django.http import HttpResponse
from django.shortcuts import render


def index(request, **_):
    return render(request, "index.html")


def java_script(request):
    filename = request.path.strip("/")
    data = open(filename, "rb").read()
    return HttpResponse(data, mimetype="application/x-javascript")
