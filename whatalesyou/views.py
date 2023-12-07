from django.conf import settings
from django.http import FileResponse, HttpRequest, HttpResponse
from django.views.decorators.cache import cache_control
from django.views.decorators.http import require_GET


@require_GET
@cache_control(max_age=60 * 60 * 24, immutable=True, public=True)  # one day
def favicon(_: HttpRequest) -> HttpResponse:
    file = (settings.BASE_DIR / "frontend" / "templates" / "favicon.ico").open("rb")
    return FileResponse(file)
