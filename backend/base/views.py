from django.contrib.auth.models import User

from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import UserSerializerWithToken

from django.contrib.auth.hashers import make_password
from rest_framework import status


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v
            
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data

    otp_from_session = request.session.get('otp')
    if not otp_from_session or otp_from_session != data.get('otp'):
        return Response({'error': 'Invalid OTP'},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
        )

        customer = Customer.objects.create(
            tenant=Tenant.objects.get(id=1),
            user=user,
            phone_number=data['phone'],
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


import os
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from typing import Any, Dict
from django import http
from django.contrib import messages
from django.contrib.sites.shortcuts import get_current_site
from django.http.response import Http404
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.urls import reverse_lazy
from django.urls import reverse
from django.views.generic import DetailView, ListView, TemplateView, RedirectView
from django.views.generic.edit import FormView, CreateView, UpdateView, DeleteView
from base.forms import *
from django.contrib.auth.models import Group
from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from .models import *
from booking.models import *
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse_lazy
from django.contrib.auth.views import PasswordResetView
from django.contrib.messages.views import SuccessMessageMixin
from django.views.generic.base import TemplateView
from django.shortcuts import redirect
from datetime import datetime, timedelta
from django.utils import timezone

# from django.db import transaction
from django.http import JsonResponse
from .middleware import FirstLoginMiddleware

@method_decorator(login_required, name='dispatch')
@method_decorator(FirstLoginMiddleware, name='dispatch')
class HomePageView(View):
    template_name = 'getstarted.html'
    
    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)



class OrganizationSignupView(CreateView):
    form_class = OrganizationSignupForm
    template_name = 'signup.html'
    success_url = reverse_lazy('home_page')

    def get(self, request, *args, **kwargs):
        form = self.form_class()
        context = {'form': form}
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        context = {'form': form}

        if form.is_valid():
            phone_number = form.cleaned_data['phone_number']
            alt_number = form.cleaned_data.get('alt_number')

            if not self.is_valid_number(phone_number):
                form.add_error('phone_number',
                               'Phone number must be exactly 10 digits long.')

            if alt_number and not self.is_valid_number(alt_number):
                form.add_error(
                    'alt_number',
                    'Alternate number must be exactly 10 digits long.')

            if form.errors:
                return render(request, self.template_name, context)

            random_password = form.generate_password()
            phone_number = form.cleaned_data['phone_number']
            organization_name = form.cleaned_data['organization_name']
            user = form.save(random_password, commit=False)
            user.groups.add(Group.objects.get(name="Organization"))
            user.save()

            organization = Organization.objects.create(
                phone_number=phone_number,
                tenant=Tenant.objects.get(id=1),
                organization_name=organization_name,
                user=user)
            organization.save()

            if not user.last_login:
                request.session['first_login_' + str(user.id)] = True

            current_site = get_current_site(request)
            subject = 'Welcome to Our Website'
            message = render_to_string(
                'email_genrate.html', {
                    'user': user,
                    'domain': current_site.domain,
                    'random_password': random_password
                })
            from_email = 'testgamefront@gmail.com'
            recipient_list = [user.email]
            send_mail(subject,
                      message,
                      from_email,
                      recipient_list,
                      fail_silently=False)
            login(request, user)
            return HttpResponseRedirect(self.success_url)
        else:
            return render(request, self.template_name, context)

    def is_valid_number(self, number):
        return len(str(number)) == 10


class LoginView(View):
    template_name = 'login.html'

    def get(self, request):
        form = LoginForm()
        context = {'form': form}
        return render(request, self.template_name, context)

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            
            # minutes_since_joined = (timezone.now() - user.date_joined).total_seconds() / 60
            if (timezone.now() - user.date_joined).total_seconds() < 30:
                return redirect('home_page')

            if user.groups.filter(name='Customer').exists():
                return redirect('home_page')
            elif user.groups.filter(name='Organization').exists():
                profile_page_url = reverse(
                    'organization_profile',
                    kwargs={'pk': user.organization.pk}
                )
                return redirect(profile_page_url)  
            elif user.groups.filter(name='Tenant').exists():
                return redirect('tenantuser_page')
            elif user.groups.filter(name='TenantAdmin').exists():
                return redirect('admin_page')
        else:
            messages.info(request, 'Invalid username or password')
            return redirect('login')

        return HttpResponse("Unexpected error occurred. Please try again.")


class LogoutView(View):

    def get(self, request):
        logout(request)
        return redirect('login')


#FOR ORGANIZATION ------------


@method_decorator(login_required, name='dispatch')
class OrganizationHomeView(TemplateView):
    template_name = 'org_dashboard.html'

    def get_context_data(self, **kwargs):
        organization = Organization.objects.get(user=self.request.user)

        courts = Court.objects.filter(location__organization=organization)

       # Initialize an empty list to store all bookings
        all_bookings = []
        
        for court in courts:
            # Filter bookings for the current court
            court_bookings = Booking.objects.filter(court=court)
            
            # Extend the all_bookings list with the current court's bookings
            all_bookings.extend(court_bookings)
        
        context = {
            'organization': organization,
            'bookings': all_bookings
        }
        
        return context
    
@method_decorator(login_required, name='dispatch')
class ListofConfirmBookingView(TemplateView):
    template_name = 'confirmed_bookings.html'

    def get_context_data(self, **kwargs):
        organization = Organization.objects.get(user=self.request.user)

        courts = Court.objects.filter(location__organization=organization)

       # Initialize an empty list to store all bookings
        all_bookings = []
        
        for court in courts:
            court_bookings = Booking.objects.filter(Q(court=court) & Q(booking_status=Booking.CONFIRMED))
            all_bookings.extend(court_bookings)
        
        context = {
            'organization': organization,
            'bookings': all_bookings
        }
        
        return context
    
@method_decorator(login_required, name='dispatch')
class ListofPendingBookingView(TemplateView):
    template_name = 'pending_bookings.html'

    def get_context_data(self, **kwargs):
        organization = Organization.objects.get(user=self.request.user)

        courts = Court.objects.filter(location__organization=organization)

       # Initialize an empty list to store all bookings
        all_bookings = []
        
        for court in courts:
            court_bookings = Booking.objects.filter(Q(court=court) & Q(booking_status=Booking.PENDING))
            all_bookings.extend(court_bookings)
        
        context = {
            'organization': organization,
            'bookings': all_bookings
        }
        
        return context
    

@method_decorator(login_required, name='dispatch')
class ListofCancelledBookingView(TemplateView):
    template_name = 'cancelled_bookings.html'

    def get_context_data(self, **kwargs):
        organization = Organization.objects.get(user=self.request.user)

        courts = Court.objects.filter(location__organization=organization)

       # Initialize an empty list to store all bookings
        all_bookings = []
        
        for court in courts:
            court_bookings = Booking.objects.filter(Q(court=court) & Q(booking_status=Booking.CANCELLED))
            all_bookings.extend(court_bookings)
        
        context = {
            'organization': organization,
            'bookings': all_bookings
        }
        
        return context
    



@method_decorator(login_required, name='dispatch')
class OrganizationProfileView(UpdateView):
    model = Organization
    template_name = 'org_profile.html'
    form_class = OrganizationProfileForm
    success_url = reverse_lazy('organization_locationlist')

    def form_valid(self, form):
        phone_number = form.cleaned_data.get('phone_number')
        alt_number = form.cleaned_data.get('alt_number')

        if not self.is_valid_number(phone_number):
            if len(str(phone_number)) > 10:
                form.add_error('phone_number',
                               'Phone number exceeds 10 digits')
                return self.form_invalid(form)
            elif len(str(phone_number)) < 10:
                form.add_error('phone_number',
                               'Phone number must be at least 10 digits')
                return self.form_invalid(form)

        if alt_number and not self.is_valid_number(alt_number):
            if len(str(alt_number)) > 10:
                form.add_error('alt_number',
                               'Alternate number exceeds 10 digits')
                return self.form_invalid(form)
            elif len(str(alt_number)) < 10:
                form.add_error('alt_number',
                               'Alternate number must be at least 10 digits')
                return self.form_invalid(form)

        return super().form_valid(form)

    def is_valid_number(self, number):
        return len(str(number)) == 10

    def get_object(self):
        return Organization.objects.get(user=self.request.user)


@method_decorator(login_required, name='dispatch')
class OrganizationAddLocationView(CreateView):   
    model = OrganizationLocation    
    template_name = 'org_createlocation.html'    
    form_class = OrganizationLocationForm    
    success_url = reverse_lazy('organization_locationworkingdays')

    def form_valid(self, form):       
        organization = get_object_or_404(Organization, user=self.request.user)        
        form.instance.organization = organization        
        form.save()        
        self.request.session['location_pk'] = form.instance.pk   

        days_order = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        
        days_index_map = {day: index for index, day in enumerate(days_order, start=1)}

        sorted_days = sorted(days_order, key=lambda x: days_index_map[x])

        for day in sorted_days:
            workingdays = OrganizationLocationWorkingDays.objects.create(
                days=day,
                organization_location=form.instance,
            )            
            workingdays.save()        

        return HttpResponseRedirect(self.success_url)


@method_decorator(login_required, name='dispatch')
class OrganizationUpdateLocationView(UpdateView):
    model = OrganizationLocation
    template_name = 'update_location.html'
    form_class = OrganizationLocationForm
    success_url = reverse_lazy('organization_locationworkingdays')

    def form_valid(self, form):
        organization = get_object_or_404(Organization, user=self.request.user)
        form.instance.organization = organization
        form.save()
        self.request.session['location_pk'] = form.instance.pk
        phone_number = form.cleaned_data.get('phone_number')

        if not self.is_valid_number(phone_number):
            if len(str(phone_number)) > 10:
                form.add_error('phone_number',
                               'Phone number exceeds 10 digits')
                return self.form_invalid(form)
            elif len(str(phone_number)) < 10:
                form.add_error('phone_number',
                               'Phone number must be at least 10 digits')
                return self.form_invalid(form)

        return super().form_valid(form)

    def is_valid_number(self, number):
        return len(str(number)) == 10


@method_decorator(login_required, name='dispatch')
class OrganizationLocationListView(ListView):
    model = OrganizationLocation
    template_name = 'org_locations.html'
    context_object_name = 'locations'

    def get_queryset(self):
        organization = get_object_or_404(Organization, user=self.request.user)
        return OrganizationLocation.objects.filter(organization=organization)


@method_decorator(login_required, name='dispatch')
class OrganizationLocationGameListView(ListView):
    model = OrganizationLocationGameType
    template_name = 'org_locationgames.html'
    context_object_name = 'games'

    def get_queryset(self):
        pk = self.request.session.get('location_pk')
        return OrganizationLocationGameType.objects.filter(
            organization_location__pk=pk)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('location_pk')
        return context


@method_decorator(login_required, name='dispatch')
class OrganizationLocationGameTypeView(CreateView):
    model = OrganizationLocationGameType
    template_name = 'add_game.html'
    form_class = OrganizationLocationGameTypeCreateForm
    success_url = reverse_lazy('organization_locationgamelist')

    def form_valid(self, form):
        form.instance.organization_location = OrganizationLocation.objects.get(
            pk=self.request.session.get('location_pk'))
        form.save()

        # Create courts based on the number_of_courts selected
        number_of_courts = form.instance.number_of_courts
        game_type = form.instance

        for i in range(number_of_courts):
            court = Court.objects.create(
                name=f"Court {i+1} of {game_type.game_type}",
                location=form.instance.organization_location,
                game=game_type,
                description=f"description for court {i+1}",
                is_active=True)

        return HttpResponseRedirect(self.success_url)


@method_decorator(login_required, name='dispatch')
class OrganizationUpdateLocationGameTypeView(UpdateView):
    model = OrganizationLocationGameType
    template_name = 'update_game.html'
    form_class = OrganizationLocationGameTypeForm
    success_url = reverse_lazy('organization_locationgamelist')

    def form_valid(self, form):
        form = form.save(commit=False)
        pk = self.request.session.get('location_pk')
        form.organization_location = OrganizationLocation.objects.get(pk=pk)
        form.save()
        return HttpResponseRedirect(self.success_url)


@method_decorator(login_required, name='dispatch')
class OrganizationLocationImageListiew(ListView):
    model = OrganizationGameImages
    template_name = 'org_locationimages.html'
    context_object_name = 'images'

    def get_queryset(self):
        pk = self.request.session.get('location_pk')
        return OrganizationGameImages.objects.filter(organization__pk=pk)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('location_pk')
        return context


@method_decorator(login_required, name='dispatch')
class OrganizationLocationImageView(CreateView):
    model = OrganizationGameImages
    template_name = 'add_images.html'
    form_class = OrganizationGameImagesForm
    success_url = reverse_lazy('organization_imageslist')

    def form_valid(self, form):
        form_instance = form.save(commit=False)
        pk = self.request.session.get('location_pk')
        form_instance.organization = OrganizationLocation.objects.get(pk=pk)
        form_instance.save()

        return HttpResponseRedirect(self.success_url)


@method_decorator(login_required, name='dispatch')
class OrganizationUpdateLocationImageView(UpdateView):
    model = OrganizationGameImages
    template_name = 'update_image.html'
    form_class = OrganizationGameImagesForm
    success_url = reverse_lazy('organization_imageslist')

    def form_valid(self, form):
            clear_image = self.request.POST.get('image-clear', False)
            
            if clear_image:
                if self.object.image:
                    self.object.image.delete()
                form.instance.image = None
            
            return super().form_valid(form)

@method_decorator(login_required, name='dispatch')
class OrganizationDeleteLocationImageView(DeleteView):
    model = OrganizationGameImages
    template_name = 'delete_image.html'
    success_url = reverse_lazy('organization_imageslist')

    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()

        if self.object.image:
            image_path = self.object.image.path
        if os.path.exists(image_path):
            os.remove(image_path)
        else:
            self.object.delete()
            messages.success(request, "Image Deleted Successfully")
            return redirect(self.get_success_url())


@method_decorator(login_required, name='dispatch')
class OrganizationLocationAmenitiesView(UpdateView):
    model = OrganizationLocationAmenities
    template_name = 'update_amenities.html'
    form_class = OrganizationLocationAmenitiesForm
    success_url = reverse_lazy('organization_locationlist')

    def get_object(self):
        try:
            pk = self.request.session.get('location_pk')
            return OrganizationLocationAmenities.objects.get(
                organization_location__pk=pk)
        except OrganizationLocationAmenities.DoesNotExist:
            return None

    def form_valid(self, form):
        form = form.save(commit=False)
        pk = self.request.session.get('location_pk')
        form.organization_location = OrganizationLocation.objects.get(pk=pk)
        form.save()
        return HttpResponseRedirect(self.success_url)


@method_decorator(login_required, name='dispatch')
class OrganizationWorkingDaysView(UpdateView):
    model = OrganizationLocationWorkingDays
    template_name = 'update_workingdays.html'
    form_class = OrganizationLocationWorkingDaysForm
    success_url = reverse_lazy('organization_locationgamelist')

    def get_object(self):
        pk = self.request.session.get('location_pk')
        days = OrganizationLocationWorkingDays.objects.filter(
            organization_location_id=pk)
        return days

    def get_context_data(self, **kwargs):
        context = {}
        queryset = self.get_object()
        formset = OrganizationLocationWorkingDaysFormSet(queryset=queryset)
        context['formset'] = formset
        context['locationpk'] = self.request.session.get('location_pk')
        return context

    def post(self, request, **kwargs):
        queryset = self.get_object()
        formset = OrganizationLocationWorkingDaysFormSet(request.POST,
                                                         queryset=queryset)
        if formset.is_valid():
            formset.save()
            return HttpResponseRedirect(self.success_url)
        else:
            return HttpResponseRedirect(request, self.template_name,
                                        {'formset': formset})


class CourtUpdateView(UpdateView):
    model = Court
    template_name = 'update_court.html'
    form_class = CourtForm
    success_url = reverse_lazy('court-list')

    def form_valid(self, form):
        instance = form.save(commit=False)
        pk = self.request.session.get('location_pk')
        instance.organization_location = OrganizationLocation.objects.get(
            pk=pk)
        instance.save()
        return HttpResponseRedirect(self.success_url)


class CourtsListView(ListView):
    model = Court
    template_name = 'org_locationcourts.html'
    context_object_name = 'courts'

    def get_queryset(self):
        pk = self.request.session.get('location_pk')
        return Court.objects.filter(location_id=pk)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('location_pk')
        return context


@method_decorator(login_required, name='dispatch')
class CourtDeleteView(DeleteView):
    model = Court
    template_name = 'delete_court.html'
    success_url = reverse_lazy('court-list')


@method_decorator(login_required, name='dispatch')
class SlotListView(ListView):
    model = Slot
    template_name = 'slot-list.html'
    context_object_name = 'slots'

    def get_queryset(self):
        pk = self.request.session.get('location_pk')
        return Slot.objects.filter(location_id=pk)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('location_pk')
        return context


class SlotCreateView(CreateView):
    template_name = 'add_slot.html'
    form_class = SlotForm
    success_url = reverse_lazy('slot-list')

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        location_pk = self.kwargs.get('location_pk')
        # working_days = OrganizationLocationWorkingDays.objects.filter(organization_location_id=location_pk, is_active=True)
        kwargs['request'] = self.request
        # kwargs['working_days'] = working_days
        return kwargs

    def form_invalid(self, form):
        errors = form.errors.as_json()
        return JsonResponse({'error': errors}, status=400)

    def form_valid(self, form):
        try:
            pk = self.request.session['location_pk']
            location = OrganizationLocation.objects.get(pk=pk)
            form.instance.location = location
            return super().form_valid(form)
        except KeyError:
            return JsonResponse({'error': 'Location PK not found in session'},
                                status=400)


class SlotUpdateView(UpdateView):
    model = Slot
    template_name = 'update_slot.html'
    form_class = SlotUpdateForm
    success_url = reverse_lazy('slot-list')

    def form_invalid(self, form):
        errors = form.errors.as_json()
        return JsonResponse({'error': errors}, status=400)

    def form_valid(self, form):
        return super().form_valid(form)


@method_decorator(login_required, name='dispatch')
class SlotDeleteView(DeleteView):
    model = Slot
    template_name = 'delete_slot.html'
    success_url = reverse_lazy('slot-list')


class CourtCreateView(CreateView):
    template_name = 'add_court.html'
    form_class = CourtForm
    success_url = reverse_lazy('court-list')

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_valid(self, form):
        try:
            pk = self.request.session['location_pk']
            location = OrganizationLocation.objects.get(pk=pk)
            form.instance.location = location
        except KeyError:
            return HttpResponseRedirect(reverse_lazy('error-url'))

        # Save the form
        return super().form_valid(form)


class PreviewView(FormView):
    template_name = 'org_preview2.html'
    form_class = TermsandConditionsForm
    success_url = reverse_lazy('organization_page')

    def get_context_data(self):
        context = {}
        locationdetails = []
        locations = OrganizationLocation.objects.filter(
            organization__user=self.request.user)
        for location in locations:
            context_item = {}
            context_item['location'] = location
            context_item[
                'games'] = OrganizationLocationGameType.objects.filter(
                    organization_location=location)
            context_item[
                'amenities'] = OrganizationLocationAmenities.objects.filter(
                    organization_location=location)
            context_item[
                'workingtimes'] = OrganizationLocationWorkingDays.objects.filter(
                    organization_location=location)
            locationdetails.append(context_item)
        context['all_locations'] = locationdetails
        profile = Organization.objects.filter(user=self.request.user)
        context['profiles'] = profile
        return context
    
    def form_valid(self, form):
        organization = Organization.objects.get(user=self.request.user)
        organization.is_terms_and_conditions_agreed = True
        organization.status = Organization.IN_PROGRESS
        organization.save()
        return HttpResponseRedirect(self.success_url)


@method_decorator(login_required, name='dispatch')
class TermsandConditionsView(FormView):
    template_name = 'org_terms.html'
    form_class = TermsandConditionsForm
    success_url = reverse_lazy('organization_page')

    def get_context_data(self):
        context = super().get_context_data()
        organization = Organization.objects.get(user=self.request.user)
        context['terms_and_conditions'] = organization.tenant.sign_up_terms_and_conditions
        print(context)
        return context


@method_decorator(login_required, name='dispatch')
class StatusView(TemplateView):
    template_name = 'status.html'

    def get_organization(self):
        try:
            return Organization.objects.get(user=self.request.user)
        except Organization.DoesNotExist:
            return HttpResponseBadRequest("Organization not found")

    def get(self, request, *args, **kwargs):
        organization = self.get_organization()
        context = {
            'organization': organization
        }
        return render(request, self.template_name, context)

#FOR TENANT USER:

@method_decorator(login_required, name='dispatch')
class TenantEmployeeHomeView(ListView):
    model = Organization
    template_name = 'tenantuser_page.html'
    context_object_name = 'organizations'


@method_decorator(login_required, name='dispatch')
class OrganizationListView(ListView):
    model = Organization
    template_name = 'organization_list.html'
    context_object_name = 'organizations'

class TenantOrganizationPreviewView(DetailView):
    model = Organization
    template_name = 'tenant_organization_preview.html'
    context_object_name = 'organization'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        organization = self.object  # Get the organization object aka pk

        # Fetch all locations related to the organization
        locations = OrganizationLocation.objects.filter(
            organization=organization)

        # Create a list to store location details
        locationdetails = []

        for location in locations:
            context_item = {}
            context_item['location'] = location
            context_item['games'] = OrganizationLocationGameType.objects.filter(
                organization_location=location)
            context_item['amenities'] = OrganizationLocationAmenities.objects.filter(
                organization_location=location)
            context_item['workingtimes'] = OrganizationLocationWorkingDays.objects.filter(
                organization_location=location)
            context_item['courts'] = Court.objects.filter(
                location=location)
            locationdetails.append(context_item)

        context['all_locations'] = locationdetails
        return context


@method_decorator(login_required, name='dispatch')
class ApprovalListView(ListView):
    template_name = 'approval_list.html'
    context_object_name = 'organizations'

    def get_queryset(self):
        return Organization.objects.filter(
            tenant=TenantUser.objects.get(user=self.request.user).tenant,
            status=Organization.IN_PROGRESS)

class ChangeOrganizationStatusView(View):
    def post(self, request, organization_id, new_status):
        # Get the organization object using the organization_id
        organization = get_object_or_404(Organization, id=organization_id)

    # Update the organization's status and save it
        print(new_status)
        organization.status = new_status
        organization.save()

    # add a success message
        messages.success(request, 'Organization status updated successfully.')

        return redirect('organization_list')



@method_decorator(login_required, name='dispatch')
class VerifyView(DetailView):
    model = Organization
    template_name = 'verify.html'
    success_url = 'approval_reject'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        locations = OrganizationLocation.objects.filter(
            organization=self.get_object())
        self.request.session['organizationpk'] = self.get_object().pk
        locationdetails = []
        for location in locations:
            context_item = {}
            context_item['location'] = location
            context_item[
                'games'] = OrganizationLocationGameType.objects.filter(
                    organization_location=location)
            context_item[
                'amenities'] = OrganizationLocationAmenities.objects.filter(
                    organization_location=location)
            context_item[
                'workingtimes'] = OrganizationLocationWorkingDays.objects.filter(
                    organization_location=location)
            locationdetails.append(context_item)
        context['all_locations'] = locationdetails
        return context


@method_decorator(login_required, name='dispatch')
class ApprovalRejectionView(RedirectView):

    def get_redirect_url(self, **kwargs):
        action = kwargs['action']
        print('action is ', action)
        print(action)
        organizationpk = self.request.session.get('organizationpk')
        organization = Organization.objects.get(pk=organizationpk)
        print(organization)
        if action == 'reject':
            organization.status = Organization.CANCELLED
            organization.save()
            return reverse_lazy('reject')
        elif action == 'approved':
            organization.status = Organization.APPROVED
            organization.save()
            return reverse_lazy('success')


@method_decorator(login_required, name='dispatch')
class ChangePasswordView(PasswordChangeView):
    template_name = 'change_password.html'
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        messages.success(self.request,
                         'Your password was successfully updated!')
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, 'Please correct the error below.')
        return super().form_invalid(form)


class ResetPasswordView(SuccessMessageMixin, PasswordResetView):
    template_name = 'password_reset.html'
    email_template_name = 'password_reset_email.html'
    subject_template_name = 'password_reset_subject.txt'
    success_message = "We've emailed you instructions for setting your password, " \
                      "if an account exists with the email you entered. You should receive them shortly." \
                      " If you don't receive an email, " \
                      "please make sure you've entered the address you registered with, and check your spam folder."
    success_url = reverse_lazy('login')

from django.contrib import messages
from django.urls import reverse_lazy
from django.views.generic import CreateView
# from .models import OrganizationLocation, Slot, OrganizationLocationWorkingDays



class CreateMultipleSlotsView(View):
    def get(self, request, *args, **kwargs):
        pk = request.session.get('location_pk')
        courts = Court.objects.filter(location_id=pk)
        form = SlotForm()  # Instantiate your SlotForm
        context = {
            'courts': courts,
            'form': form,  # Pass the form to the template context
        }
        return render(request, 'ml.html', context)
        
    def post(self, request, *args, **kwargs):
        # Get the court_pk from URL parameters
        court_pk = kwargs.get('court_pk')
        
        # Retrieve the court object corresponding to court_pk
        court = get_object_or_404(Court, pk=court_pk, location_id=request.session.get('location_pk'))

        # Get all active days for the organization location
        active_days = OrganizationLocationWorkingDays.objects.filter(organization_location=request.session.get('location_pk'), is_active=True)

        # Iterate over active days
        for day in active_days:
            # Get start and end time for the day
            work_from_time = day.work_from_time
            work_to_time = day.work_to_time

            # Set current time to the starting work time
            current_datetime = datetime.combine(datetime.now().date(), work_from_time)

            # Create slots for each hour within the time range
            while current_datetime < datetime.combine(datetime.now().date(), work_to_time):
                # Create a new slot for the current hour and court
                Slot.objects.create(
                    start_time=current_datetime.time(),
                    end_time=(current_datetime + timedelta(hours=1)).time(),
                    court=court,
                    location=OrganizationLocation.objects.get(pk=request.session.get('location_pk')),  # Assuming you are passing location data via POST
                    days=day.days, 
                    is_booked=False  # Assuming slots are initially not booked
                )
                
                # Move to the next hour
                current_datetime += timedelta(hours=1)

        # Redirect or render as needed
        return redirect('court-list')

@method_decorator(login_required, name='dispatch')
class TenantEmployeeHomeView(ListView):
    model = Organization
    template_name = 'tenantuser_page.html'
    context_object_name = 'organizations'


@method_decorator(login_required, name='dispatch')
class OrganizationListView(ListView):
    model = Organization
    template_name = 'organization_list.html'
    context_object_name = 'organizations'

@method_decorator(login_required, name='dispatch')
class CancelOrganizationListView(ListView):
    model = Organization
    template_name = 'cancelled_organization.html'
    context_object_name = 'organizations'

@method_decorator(login_required, name='dispatch')
class PendingOrganizationListView(ListView):
    model = Organization
    template_name = 'pending_organization.html'
    context_object_name = 'organizations'

@method_decorator(login_required, name='dispatch')
class WaitingOrganizationListView(ListView):
    model = Organization
    template_name = 'waiting_organization.html'
    context_object_name = 'organizations'


@method_decorator(login_required, name='dispatch')
class ConfirmOrganizationListView(ListView):
    model = Organization
    template_name = 'confirmed_organization.html'
    context_object_name = 'organizations'



class TenantOrganizationPreviewView(DetailView):
    model = Organization
    template_name = 'tenant_organization_preview.html'
    context_object_name = 'organization'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        organization = self.object  # Get the organization object aka pk

        # Fetch all locations related to the organization
        locations = OrganizationLocation.objects.filter(
            organization=organization)

        # Create a list to store location details
        locationdetails = []

        for location in locations:
            context_item = {}
            context_item['location'] = location
            context_item['games'] = OrganizationLocationGameType.objects.filter(
                organization_location=location)
            context_item['amenities'] = OrganizationLocationAmenities.objects.filter(
                organization_location=location)
            context_item['workingtimes'] = OrganizationLocationWorkingDays.objects.filter(
                organization_location=location)
            context_item['courts'] = Court.objects.filter(
                location=location)
            locationdetails.append(context_item)

        context['all_locations'] = locationdetails
        return context


class ChangeOrganizationStatusView(View):
    def post(self, request, organization_id, new_status):
        # Get the organization object using the organization_id
        organization = get_object_or_404(Organization, id=organization_id)

    # Update the organization's status and save it
        print(new_status)
        organization.status = new_status
        organization.save()

    # add a success message
        messages.success(request, 'Organization status updated successfully.')

        return redirect('organization_list')
