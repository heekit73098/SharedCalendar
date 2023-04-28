from django.middleware.csrf import CsrfViewMiddleware

def is_mobile_app_access(request):
    # This is not the best implementation but have to do for now
    return (request.META.get('HTTP_REFERER', None) is None 
        and request.META.get('HTTP_COOKIE', None) is None 
        )

class CustomCsrfViewMiddleware(CsrfViewMiddleware):
    def process_view(self, request, callback, callback_args, callback_kwargs):
        if is_mobile_app_access(request):
            return None
        else:
            return super(CustomCsrfViewMiddleware, self).process_view(request, callback, callback_args, callback_kwargs)

    def process_response(self, request, response):
        if is_mobile_app_access(request):
            return response
        else:
            return super(CustomCsrfViewMiddleware, self).process_response(request, response)