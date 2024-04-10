# middleware.py
from django.shortcuts import redirect
from django.urls import reverse

class FirstLoginMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Check if the user is authenticated
        if request.user.is_authenticated:
            first_login_key = 'first_login_' + str(request.user.id)
            
            # Check if it's the user's first login
            if not request.session.get(first_login_key, False):
                request.session[first_login_key] = True
                
                profile_page_url = reverse(
                    'organization_profile',
                    kwargs={'pk': request.user.organization.pk})
                
                # Redirect to the profile page
                return redirect('home_page')
        
        return response
