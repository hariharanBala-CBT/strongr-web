from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.html import format_html
from .utils import generate_password
from .messages import SUCCESS_MESSAGES, ERROR_MESSAGES, MAIL_MESSAGES
from .constants import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import UserSerializerWithToken, UserSerializerWithTokenAndCustomer

from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

import os
import json
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.sites.shortcuts import get_current_site
from django.http.response import Http404
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.urls import reverse_lazy
from django.urls import reverse
from django.views.generic import DetailView, ListView, TemplateView
from django.views.generic.edit import FormView, CreateView, UpdateView, DeleteView
from base.forms import *
from django.forms import formset_factory
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
from datetime import datetime, timedelta, time
from django.db.models import Q
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from dotenv import load_dotenv
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.mixins import UserPassesTestMixin
from django.core.exceptions import PermissionDenied
from functools import wraps
from base.utils import *

def group_required(group_name):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return login_required(view_func)(request, *args, **kwargs)
            if not request.user.groups.filter(name=group_name).exists():
                raise PermissionDenied
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator

load_dotenv()
DEBUG = os.environ.get('DJANGO_DEBUG')
if DEBUG == 'True':
    from backend.local_settings import *
else:
    from backend.production_settings import *

class GroupAccessMixin(UserPassesTestMixin):
    group_required = []

    def test_func(self):
        user = self.request.user
        if not user.is_authenticated:
            return False

        return any(user.groups.filter(name=group).exists() for group in self.group_required)

    def handle_no_permission(self):
        raise PermissionDenied

#FOR CUSTOMER ------------
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
            serializer = UserSerializerWithTokenAndCustomer(self.user).data
            for k, v in serializer.items():
                data[k] = v
            return data
        except Exception:
            return Response({'detail': 'User does not exist'},
                            status=status.HTTP_404_NOT_FOUND)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def PhoneLoginView(request):
    data = request.data

    try:
        phone = data['phone_number']
        message = {'success': 'logged in successfully'}
        customer = Customer.objects.get(phone_number=phone[2:12])
        user = User.objects.get(id=customer.user_id)

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Customer.DoesNotExist:
        return Response({'detail': 'User not registered'},
                        status=status.HTTP_404_NOT_FOUND)

    except KeyError:
        message = {
            'detail': 'phone_number is required'
        }
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def generateOtp(request):
    email = request.query_params.get('email')
    otp = get_random_string(length=4, allowed_chars='0123456789')
    subject = MAIL_MESSAGES.get('welcome')
    message = render_to_string('otp.html', {
        'otp': otp,
    })

    from_email = EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list, fail_silently=False)

    request.session['emailedotp'] = otp
    return Response({'otp': 'sent'})

@api_view(['GET'])
def generateUpdateOtp(request):
    email = request.query_params.get('email')
    user_id = request.query_params.get('id')
    otp = get_random_string(length=4, allowed_chars='0123456789')
    user = User.objects.get(id=user_id)
    subject = MAIL_MESSAGES.get('welcome')
    message = render_to_string('otp.html', {
        'otp': otp,
        'first_name': user.first_name,
        'last_name': user.last_name
    })

    from_email = EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list, fail_silently=False)

    request.session['emailedotp'] = otp
    return Response({'otp': 'sent'})

import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def registerUser(request):
    try:
        data = request.data
        otp_from_session = request.session.get('emailedotp')
        otp_from_client = data.get('otp')
        phone = data.get('phone')

        if not otp_from_session or otp_from_session != otp_from_client:
            return Response({'detail': 'invalidOTP'}, status=status.HTTP_400_BAD_REQUEST)

        if not phone:
            return Response({'detail': 'phoneNumberRequired'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=data['email']).exists():
            return Response({'detail': 'emailAlreadyRegistered'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
        )

        customer = Customer.objects.create(
            tenant=Tenant.objects.get(tenant_name = TENANT),
            user=user,
            phone_number=data.get('phone'),
        )

        customer_group = Group.objects.get(name='Customer')
        user.groups.add(customer_group)

        serializer = UserSerializerWithTokenAndCustomer(user, many=False)
        return Response(serializer.data)

    except Exception as e:
            print('this is exception', str(e))
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#FOR ORGANIZATION ------------

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
                form.add_error('phone_number', ERROR_MESSAGES.get('phone_number_invalid'))

            if alt_number and not self.is_valid_number(alt_number):
                form.add_error('alt_number', ERROR_MESSAGES.get('alt_number_invalid'))

            if form.errors:
                return render(request, self.template_name, context)

            random_password = generate_password()
            phone_number = form.cleaned_data['phone_number']
            organization_name = form.cleaned_data['organization_name']
            user = form.save(random_password, commit=False)
            user.groups.add(Group.objects.get(name="Organization"))
            user.save()

            organization = Organization.objects.create(
                phone_number=phone_number,
                tenant=Tenant.objects.get(tenant_name = TENANT),
                organization_name=organization_name,
                user=user
            )
            organization.save()

            if not user.last_login:
                request.session['first_login_' + str(user.id)] = True

            current_site = get_current_site(request)
            subject = MAIL_MESSAGES.get('welcome')
            message = render_to_string(
                'email_generate.html', {
                    'user': user,
                    'domain': current_site.domain,
                    'random_password': random_password
                })
            from_email = const_email
            recipient_list = [user.email]
            send_mail(subject, message, from_email, recipient_list, fail_silently=False)
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
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)

                if user.groups.filter(name='Customer').exists():
                    return redirect('access-restricted')
                elif user.groups.filter(name='Organization').exists():
                    profile_page_url = reverse('organization_page')
                    return redirect(profile_page_url)
                elif user.groups.filter(name='Tenant').exists():
                    return redirect('tenantuser_page')
                elif user.groups.filter(name='TenantAdmin').exists():
                    return redirect('admin_page')
                else:
                    error_messages = ''.join([f'{error}' for error in form.errors.values()])
                    messages.error(request, ERROR_MESSAGES.get('form_validation_failed', {error_messages}))
                    return redirect('login')
        else:
            return render(request, self.template_name, {'form': form})

class LogoutView(View):

    def get(self, request):
        logout(request)
        return redirect('login')

@method_decorator(login_required, name='dispatch')
class OrganizationBookingView(GroupAccessMixin, TemplateView):
    group_required = ['Organization']

    template_map = {
        'org_dashboard': 'org_dashboard.html',
        'org_bookings': 'org_bookings.html',
        'confirmed_bookings': 'confirmed_bookings.html',
        'completed_bookings': 'completed_bookings.html',
        'pending_bookings': 'pending_bookings.html',
        'cancelled_bookings': 'cancelled_bookings.html',
    }

    def get_template_names(self):
        return [self.template_map[self.template_name]]

    def get_context_data(self, **kwargs):
        organization = Organization.objects.get(user=self.request.user)
        courts = Court.objects.filter(location__organization=organization)

        all_bookings = []

        for court in courts:
            court_bookings = Booking.objects.filter(court=court)

            all_bookings.extend(court_bookings)

        games = GameType.objects.all()
        payment_status_choices = Booking.payment_status_choices

        context = {'organization': organization, 'bookings': all_bookings, 'games': games, 'payment_status_choices': payment_status_choices,}

        return context

@method_decorator(login_required, name='dispatch')
class OrganizationProfileView(GroupAccessMixin, UpdateView):
    model = Organization
    template_name = 'org_profile.html'
    form_class = OrganizationProfileForm
    group_required = ['Organization']

    def form_valid(self, form):
        form.save()
        if self.is_ajax_request():
            return JsonResponse({'status': 'success', 'message': SUCCESS_MESSAGES.get('update_profile')}, status=200)
        return self.render_to_response(self.get_context_data(form=form))

    def form_invalid(self, form):
        errors = {field: [str(e) for e in form.errors[field]] for field in form.errors}

        if self.is_ajax_request():
            return JsonResponse({'status': 'error', 'errors': errors}, status=400)
        else:
            for field, error_messages in errors.items():
                for error_message in error_messages:
                    messages.error(self.request, f"{form.fields[field].label}: {error_message}")

            return super().form_invalid(form)

    def is_valid_number(self, number):
        return len(str(number)) == 10

    def get_object(self):
        return Organization.objects.get(user=self.request.user)

    def is_ajax_request(self):
        return self.request.headers.get('X-Requested-With') == 'XMLHttpRequest'

@method_decorator(login_required, name='dispatch')
class OrganizationAddLocationView(GroupAccessMixin, CreateView):
    model = OrganizationLocation
    template_name = 'org_createlocation.html'
    form_class = OrganizationLocationForm
    group_required = ['Organization']

    def form_valid(self, form):
        organization = get_object_or_404(Organization, user=self.request.user)
        form.instance.organization = organization
        form.save()
        self.request.session['location_pk'] = form.instance.pk
        pk = form.instance.pk

        days_order = [
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ]

        days_index_map = {
            day: index
            for index, day in enumerate(days_order, start=1)
        }

        sorted_days = sorted(days_order, key=lambda x: days_index_map[x])

        for day in sorted_days:
            workingdays = OrganizationLocationWorkingDays.objects.create(
                days=day,
                organization_location=form.instance,
            )
            workingdays.save()
        messages.success(self.request, SUCCESS_MESSAGES.get('create_location'))
        return HttpResponseRedirect(reverse('mainview', kwargs={'location_pk': pk}))

    def form_invalid(self, form):
        return self.render_to_response(self.get_context_data(form=form))

@login_required
@group_required('Organization')
def update_location(request, pk):
    location = get_object_or_404(OrganizationLocation, pk=pk)
    organization = get_object_or_404(Organization, user=request.user)

    if request.method == 'POST':
        form = OrganizationLocationForm(request.POST, instance=location)
        if form.is_valid():
            form.instance.organization = organization
            form.save()
            request.session['location_pk'] = form.instance.pk
            messages.success(request, SUCCESS_MESSAGES.get('update_location'))
            return redirect('mainview', location_pk=form.instance.pk)
        else:
            if ERROR_MESSAGES.get('location_duplicate') in form.non_field_errors():
                messages.error(request, ERROR_MESSAGES.get('location_duplicate'))
            else:
                error_messages = ', '.join([str(error) for error in form.errors.values()])
                formatted_message = ERROR_MESSAGES.get('form_validation_failed_location').format(error_messages=error_messages)
                messages.error(request, formatted_message)
            return render(request, 'main_template.html', {'form': form, 'locationpk': pk})
    else:
        form = OrganizationLocationForm(instance=location)

    return render(request, 'update_location.html', {'form': form, 'pk': pk})



@method_decorator(login_required, name='dispatch')
class OrganizationLocationListView(GroupAccessMixin, ListView):
    model = OrganizationLocation
    template_name = 'org_locations.html'
    context_object_name = 'locations'
    group_required = ['Organization']

    def get_queryset(self):
        organization = get_object_or_404(Organization, user=self.request.user)
        return OrganizationLocation.objects.filter(organization=organization)

@method_decorator(login_required, name='dispatch')
class TempslotLocationListView(GroupAccessMixin, ListView):
    model = OrganizationLocation
    template_name = 'temp-slot-location.html'
    context_object_name = 'locations'
    group_required = ['Organization']

    def get_queryset(self):
        organization = get_object_or_404(Organization, user=self.request.user)
        return OrganizationLocation.objects.filter(organization=organization)

@method_decorator(login_required, name='dispatch')
class TempdeslotLocationListView(GroupAccessMixin, ListView):
    model = OrganizationLocation
    template_name = 'temp-deslot-location.html'
    context_object_name = 'locations'
    group_required = ['Organization']

    def get_queryset(self):
        organization = get_object_or_404(Organization, user=self.request.user)
        return OrganizationLocation.objects.filter(organization=organization)

@method_decorator(login_required, name='dispatch')
class OrganizationLocationGameListView(GroupAccessMixin, ListView):
    model = OrganizationLocationGameType
    template_name = 'org_locationgames.html'
    context_object_name = 'games'
    group_required = ['Organization']

    def get_queryset(self):
        pk = self.kwargs.get('locationpk')
        return OrganizationLocationGameType.objects.filter(organization_location__pk=pk)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.kwargs.get('locationpk')
        return context

@method_decorator(login_required, name='dispatch')
class OrganizationLocationGameTypeView(GroupAccessMixin, CreateView):
    model = OrganizationLocationGameType
    template_name = 'add_game.html'
    form_class = OrganizationLocationGameTypeCreateForm
    group_required = ['Organization']

    def get_success_url(self):
        locationpk = self.request.session.get('location_pk')
        return reverse('mainview' , kwargs={'location_pk': locationpk})

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        location_pk = self.kwargs.get('locationpk')
        if location_pk:
            organization_location = get_object_or_404(OrganizationLocation, pk=location_pk)
            kwargs['organization_location'] = organization_location
        return kwargs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.kwargs.get('locationpk')
        return context

    def form_valid(self, form):
        location_pk = self.kwargs.get('locationpk')
        if not location_pk:
            messages.error(self.request, 'No location found in session.')
            return redirect('organization_addlocation')

        form.instance.organization_location = get_object_or_404(OrganizationLocation, pk=location_pk)
        form.save()

        number_of_courts = form.instance.number_of_courts
        game_type = form.instance

        for i in range(number_of_courts):
            Court.objects.create(
                name=f"Court {i+1} of {game_type.game_type}",
                location=form.instance.organization_location,
                game=game_type,
                description=f"description for court {i+1}",
                is_active=True
            )

        messages.success(self.request, SUCCESS_MESSAGES.get('create_game'))
        return redirect(self.get_success_url())

@method_decorator(login_required, name='dispatch')
class OrganizationUpdateLocationGameTypeView(GroupAccessMixin, UpdateView):
    model = OrganizationLocationGameType
    template_name = 'update_game.html'
    form_class = OrganizationLocationGameTypeForm
    group_required = ['Organization']

    def get_object(self):
        locationpk = self.kwargs.get('locationpk')
        gamepk = self.kwargs.get('gamepk')
        return get_object_or_404(OrganizationLocationGameType, organization_location__pk=locationpk, pk=gamepk)

    def form_valid(self, form):
        form.instance.organization_location = get_object_or_404(OrganizationLocation, pk=self.kwargs.get('locationpk'))
        form.save()
        messages.success(self.request, SUCCESS_MESSAGES.get('update_game'))
        return redirect(reverse('mainview', kwargs={'location_pk': self.kwargs.get('locationpk')}))

    def form_invalid(self, form):
        error_messages = ''.join([f'{error}' for error in form.errors.values()])
        messages.error(self.request, ERROR_MESSAGES.get('form_validation_failed', {error_messages}))
        return self.render_to_response(self.get_context_data(form=form))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.kwargs.get('locationpk')
        return context


@method_decorator(login_required, name='dispatch')
class OrganizationLocationImageListView(GroupAccessMixin, ListView):
    model = OrganizationGameImages
    template_name = 'org_locationimages.html'
    context_object_name = 'images'
    group_required = ['Organization']

    def get_queryset(self):
        pk = self.kwargs.get('locationpk')
        return OrganizationGameImages.objects.filter(organization__pk=pk)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.kwargs.get('locationpk')
        return context


@method_decorator(login_required, name='dispatch')
class OrganizationLocationImageView(GroupAccessMixin, CreateView):
    model = OrganizationGameImages
    template_name = 'add_images.html'
    form_class = OrganizationGameImagesForm
    group_required = ['Organization']

    def form_valid(self, form):
        form_instance = form.save(commit=False)
        location_pk = self.kwargs.get('locationpk')
        form_instance.organization = get_object_or_404(OrganizationLocation, pk=location_pk)
        form_instance.save()
        messages.success(self.request, SUCCESS_MESSAGES.get('create_image'))
        return redirect(reverse('mainview', kwargs={'location_pk': location_pk}))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('location_pk')
        return context

@method_decorator(login_required, name='dispatch')
class OrganizationUpdateLocationImageView(GroupAccessMixin, UpdateView):
    model = OrganizationGameImages
    template_name = 'update_image.html'
    form_class = OrganizationGameImagesForm
    group_required = ['Organization']

    def form_valid(self, form):
        clear_image = self.request.POST.get('image-clear', False)

        if clear_image:
            if self.object.image:
                self.object.image.delete()
            form.instance.image = None
        messages.success(self.request, SUCCESS_MESSAGES.get('update_image'))
        return super().form_valid(form)

    def form_invalid(self, form):
        error_messages = ' '.join([error[0] for error in form.errors.values()])
        messages.error(self.request, ERROR_MESSAGES.get('form_validation_failed', error_messages))
        return self.render_to_response(self.get_context_data(form=form))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.kwargs.get('pk')
        return context

    def get_success_url(self):
        image_pk = self.kwargs.get('pk')
        location_pk = OrganizationGameImages.objects.get(pk = image_pk).organization.id
        return reverse('mainview',kwargs={'location_pk' : location_pk})

@method_decorator(login_required, name='dispatch')
class OrganizationDeleteLocationImageView(GroupAccessMixin, DeleteView):
    model = OrganizationGameImages
    template_name = 'delete_image.html'
    group_required = ['Organization']

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        success_url = self.get_success_url()

        if DEBUG == 'True':
            if self.object.image:
                image_path = self.object.image.path
                if os.path.exists(image_path):
                    os.remove(image_path)

        self.object.delete()
        messages.success(request, SUCCESS_MESSAGES.get('delete_image'))
        return redirect(success_url)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('location_pk')
        return context

    def get_success_url(self):
        locationpk = self.request.session.get('location_pk')
        return reverse('mainview', kwargs={'location_pk': locationpk})

@method_decorator(login_required, name='dispatch')
class CourtUpdateView(GroupAccessMixin, UpdateView):
    model = Court
    template_name = 'update_court.html'
    form_class = CourtForm
    group_required = ['Organization']

    def get_object(self):
        locationpk = self.kwargs.get('locationpk')
        courtpk = self.kwargs.get('courtpk')
        return get_object_or_404(Court,location__pk=locationpk, pk=courtpk)

    def form_valid(self, form):
        form.instance.organization_location = get_object_or_404(OrganizationLocation, pk=self.kwargs.get('locationpk'))
        form.save()
        messages.success(self.request, SUCCESS_MESSAGES.get('update_court'))
        return redirect(reverse('mainview', kwargs={'location_pk': self.kwargs.get('locationpk')}))

    def form_invalid(self, form):
        error_messages = ''.join([f'{error}' for error in form.errors.values()])
        messages.error(self.request, ERROR_MESSAGES.get('form_validation_failed', {error_messages}))
        return self.render_to_response(self.get_context_data(form=form))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.kwargs.get('locationpk')
        return context

class CourtsListView(GroupAccessMixin, ListView):
    model = Court
    template_name = 'org_locationcourts.html'
    context_object_name = 'courts'
    group_required = ['Organization']

    def get_queryset(self):
        pk = self.kwargs.get('locationpk')
        return Court.objects.filter(location_id=pk)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.kwargs.get('locationpk')
        return context

@method_decorator(login_required, name='dispatch')
class CourtDeleteView(GroupAccessMixin, DeleteView):
    model = Court
    template_name = 'delete_court.html'
    group_required = ['Organization']

    def post(self, request, *args, **kwargs):
        messages.success(request, SUCCESS_MESSAGES.get('delete_court'))
        return super().delete(request, *args, **kwargs)

    def get_success_url(self):
        locationpk = self.request.session.get('location_pk')
        return reverse('mainview', kwargs={'location_pk': locationpk})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('location_pk')
        return context

@method_decorator(login_required, name='dispatch')
class SlotListView(GroupAccessMixin, ListView):
    model = Slot
    template_name = 'slot-list.html'
    context_object_name = 'slots'
    group_required = ['Organization']

    def get_queryset(self):
        pk = self.kwargs.get('locationpk')
        return Slot.objects.filter(location_id=pk)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        pk = self.kwargs.get('locationpk')
        context['locationpk'] = pk
        self.request.session['locationpk'] = pk
        return context

@method_decorator(login_required, name='dispatch')
class TenantSlotListView(GroupAccessMixin, ListView):
    model = Slot
    template_name = 'tenant_slot_list.html'
    context_object_name = 'slots'
    group_required = ['Tenant']

    def get_queryset(self):
        pk = self.kwargs.get('locationpk')
        return Slot.objects.filter(location_id=pk)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        pk = self.kwargs.get('locationpk')
        context['locationpk'] = pk
        self.request.session['locationpk'] = pk
        return context

@method_decorator(login_required, name='dispatch')
class SlotLocationListView(GroupAccessMixin, ListView):
    model = OrganizationLocation
    template_name = 'slot_location.html'
    context_object_name = 'locations'
    group_required = ['Organization']

    def get_queryset(self):
        organization = get_object_or_404(Organization, user=self.request.user)
        return OrganizationLocation.objects.filter(organization=organization)

@method_decorator(login_required, name='dispatch')
class SlotCreateView(GroupAccessMixin, CreateView):
    template_name = 'add_slot.html'
    form_class = SlotForm
    group_required = ['Organization']

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['location_pk'] = self.request.session.get('locationpk')
        return context

    def form_valid(self, form):
        try:
            location_pk = self.request.session['locationpk']
            location = OrganizationLocation.objects.get(pk=location_pk)
            form.instance.location = location
        except KeyError:
            return HttpResponseRedirect(reverse_lazy('error'))
        messages.success(self.request, SUCCESS_MESSAGES.get('create_slot'))
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, ERROR_MESSAGES.get('form_validation_failed_generic'))
        return self.render_to_response(self.get_context_data(form=form))

    def get_success_url(self):
        location_pk = self.request.session.get('locationpk')
        return reverse('slot-list', kwargs={'locationpk': location_pk})

class SlotUpdateView(GroupAccessMixin, UpdateView):
    model = Slot
    template_name = 'update_slot.html'
    form_class = SlotUpdateForm
    group_required = ['Organization']

    def form_invalid(self, form):
        custom_error_message_1 = 'A slot with the same details already exists.'
        custom_error_message_2 = 'Time difference between slots must exactly be one hour'

        error_list = [str(error) for error in form.errors.values()]
        flat_error_list = ' '.join(error_list).replace('<ul class="errorlist nonfield"><li>', '').replace('</li></ul>', '').replace('</li><li>', ' ')

        if custom_error_message_1 in flat_error_list:
            error_message =  messages.error(self.request, ERROR_MESSAGES.get('form_validation_failed_slot_1'))
        elif custom_error_message_2 in flat_error_list:
            error_message =  messages.error(self.request, ERROR_MESSAGES.get('form_validation_failed_slot_2'))
        else:
            error_message = flat_error_list

        # Pass the error message to the context
        return self.render_to_response(self.get_context_data(form=form, error=error_message))

    def form_valid(self, form):
        pk = self.request.session.get('locationpk')
        self.object = form.save()
        messages.success(self.request, SUCCESS_MESSAGES.get('update_slot'))
        return HttpResponseRedirect(reverse('slot-list', kwargs={'locationpk': pk}))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('locationpk')
        return context


@method_decorator(login_required, name='dispatch')
class SlotDeleteView(GroupAccessMixin, DeleteView):
    model = Slot
    template_name = 'delete_slot.html'
    group_required = ['Organization']

    def post(self, request, *args, **kwargs):
        messages.success(request, SUCCESS_MESSAGES.get('delete_slot'))
        return super().delete(request, *args, **kwargs)

    def get_success_url(self):
        pk = self.request.session.get('locationpk')
        return reverse('slot-list', kwargs={'locationpk': pk})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pk'] = self.request.session.get('location_pk')
        return context

class CourtCreateView(GroupAccessMixin, CreateView):
    template_name = 'add_court.html'
    form_class = CourtForm
    group_required = ['Organization']

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('location_pk')
        return context

    def form_valid(self, form):
        try:
            pk = self.request.session['location_pk']
            location = OrganizationLocation.objects.get(pk=pk)
            form.instance.location = location
        except KeyError:
            return HttpResponseRedirect(reverse_lazy('error'))
        messages.success(self.request, SUCCESS_MESSAGES.get('create_court'))
        return super().form_valid(form)

    def get_success_url(self):
            locationpk = self.request.session.get('location_pk')
            return reverse('mainview' , kwargs={'location_pk': locationpk})

class PreviewView(GroupAccessMixin, FormView):
    template_name = 'org_preview2.html'
    form_class = TermsandConditionsForm
    success_url = reverse_lazy('status')
    group_required = ['Organization']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        locationdetails = []

        locations = OrganizationLocation.objects.filter(organization__user=self.request.user)
        for location in locations:
            context_item = {}
            context_item['location'] = location
            context_item['games'] = OrganizationLocationGameType.objects.filter(organization_location=location)
            context_item['happy'] = HappyHourPricing.objects.filter(organization_location=location)
            context_item['amenities'] = OrganizationLocationAmenities.objects.filter(organization_location=location)
            workingtimes = OrganizationLocationWorkingDays.objects.filter(organization_location=location)
            context_item['workingtimes'] = workingtimes
            context_item['courts'] = Court.objects.filter(location=location)
            context_item['images'] = OrganizationGameImages.objects.filter(organization=location)
            context_item['slots'] = Slot.objects.filter(location_id=location)
            context_item['has_courts'] = context_item['courts'].exists()
            context_item['has_slots'] = context_item['slots'].exists()

            # Set flag for all times being None
            context_item['all_times_none'] = all(
                wt.work_from_time is None and wt.work_to_time is None
                for wt in workingtimes
            )

            locationdetails.append(context_item)

        context['all_locations'] = locationdetails
        profile = Organization.objects.filter(user=self.request.user)
        context['profiles'] = profile
        organization = Organization.objects.get(user=self.request.user)
        tenant = organization.tenant
        context['tenant_signup_terms'] = tenant.sign_up_terms_and_conditions
        return context

    def form_valid(self, form):
        organization = Organization.objects.get(user=self.request.user)
        organization.is_terms_and_conditions_agreed = True
        organization.status = Organization.IN_PROGRESS
        organization.save()
        messages.success(self.request, SUCCESS_MESSAGES.get('preview'))
        return HttpResponseRedirect(self.success_url)

@method_decorator(login_required, name='dispatch')
class TermsandConditionsView(GroupAccessMixin, FormView):
    template_name = 'org_terms.html'
    form_class = TermsandConditionsForm
    success_url = reverse_lazy('organization_page')
    group_required = ['Organization']

    def get_context_data(self):
        context = super().get_context_data()
        organization = Organization.objects.get(user=self.request.user)
        context[
            'terms_and_conditions'] = organization.tenant.sign_up_terms_and_conditions
        return context

@method_decorator(login_required, name='dispatch')
class TenantTermsandConditionsView(FormView):
    template_name = 'terms.html'
    form_class = TermsandConditionsForm

@method_decorator(login_required, name='dispatch')
class PrivacyPolicyView(GroupAccessMixin, TemplateView):
    template_name = 'privacy_policy.html'
    group_required = ['Organization']

@method_decorator(login_required, name='dispatch')
class StatusView(GroupAccessMixin, TemplateView):
    template_name = 'status.html'
    group_required = ['Organization']

    def get_organization(self):
        try:
            return Organization.objects.get(user=self.request.user)
        except Organization.DoesNotExist:
            raise Http404(ERROR_MESSAGES.get('no_organization'))

    def get_organization_location(self, organization):
        try:
            return OrganizationLocation.objects.filter(organization=organization)
        except OrganizationLocation.DoesNotExist:
            raise Http404(ERROR_MESSAGES.get('no_organization_location'))

    def get_organization_games(self, location):
        return OrganizationLocationGameType.objects.filter(organization_location=location)

    def get_organization_courts(self, location):
        return Court.objects.filter(location=location)

    def get_organization_images(self, location):
        return OrganizationGameImages.objects.filter(organization=location)

    def get_organization_working_days(self, location):
        return OrganizationLocationWorkingDays.objects.filter(organization_location=location)

    def get_organization_amenities(self, location):
        return OrganizationLocationAmenities.objects.filter(organization_location=location)

    def get_organization_slots(self, location):
        return Slot.objects.filter(location=location)

    def get_additional_slots(self, location):
        return AdditionalSlot.objects.filter(location=location)

    def get_unavailable_slots(self, location):
        return UnavailableSlot.objects.filter(location=location)

    def get(self, request, *args, **kwargs):
        try:
            organization = self.get_organization()
            locations = self.get_organization_location(organization)

            context = {
                'organization': organization,
                'locations': locations,
                'location_details': [],
            }

            for location in locations:
                location_detail = {
                    'location': location,
                    'empty_message': {}
                }

                if not self.get_organization_games(location):
                    location_detail['empty_message']['games'] = ERROR_MESSAGES.get('no_games')

                if not self.get_organization_courts(location):
                    location_detail['empty_message']['courts'] = ERROR_MESSAGES.get('no_courts')

                if not self.get_organization_images(location):
                    location_detail['empty_message']['images'] = ERROR_MESSAGES.get('no_images')

                working_days = self.get_organization_working_days(location)
                if not working_days or all(not wd.work_from_time or not wd.work_to_time for wd in working_days):
                    location_detail['empty_message']['working_days'] = ERROR_MESSAGES.get('no_working_days')

                if not self.get_organization_amenities(location):
                    location_detail['empty_message']['amenities'] = ERROR_MESSAGES.get('no_amenities')

                slots = self.get_organization_slots(location)
                additional_slots = self.get_additional_slots(location)
                unavailable_slots = self.get_unavailable_slots(location)

                if not slots and not additional_slots and not unavailable_slots:
                    location_detail['empty_message']['slots'] = ERROR_MESSAGES.get('no_slots')

                context['location_details'].append(location_detail)

            return render(request, self.template_name, context)
        except Http404 as e:
            return render(request, self.template_name, {'error_message': str(e)})

#FOR TENANT USER:

@method_decorator(login_required, name='dispatch')
class TenantEmployeeHomeView(GroupAccessMixin, ListView):
    model = Organization
    template_name = 'tenantuser_page.html'
    context_object_name = 'organizations'
    group_required = ['Tenant']

@method_decorator(login_required, name='dispatch')
class OrganizationListView(GroupAccessMixin, ListView):
    model = Organization
    template_name = 'organization_list.html'
    context_object_name = 'organizations'
    group_required = ['Tenant']

@method_decorator(login_required, name='dispatch')
class ApprovalListView(GroupAccessMixin, ListView):
    template_name = 'approval_list.html'
    context_object_name = 'organizations'
    group_required = ['Tenant']

    def get_queryset(self):
        return Organization.objects.filter(
            tenant=TenantUser.objects.get(user=self.request.user).tenant,
            status=Organization.IN_PROGRESS)

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class ChangeOrganizationStatusView(View):

    def post(self, request, organization_id, new_status):
        organization = get_object_or_404(Organization, id=organization_id)

        reason_for_cancellation = request.POST.get('reason_for_cancellation','')
        if new_status == 1:
            status_text = 'Approved'
        elif new_status == 4:
            status_text = 'Cancelled'
            organization.status_description = reason_for_cancellation
        else:
            status_text = 'Unknown'

        organization.status = new_status
        organization.save()


        subject = 'Organization status'
        message = render_to_string('status_mail.html', {
            'user': organization.user,
            'status': status_text
        })
        from_email = const_email
        recipient_list = [organization.user.email]
        send_mail(subject,
                  message,
                  from_email,
                  recipient_list,
                  fail_silently=False)

        if new_status == 1:
            messages.success(request, SUCCESS_MESSAGES.get('org_approve'))
        elif new_status == 4:
            messages.success(request, SUCCESS_MESSAGES.get('org_cancel'))

        return redirect('organization_list')

class ChangeOrganizationLocationStatusView(View):

    def post(self, request, location_id, new_status):
        organizationLocation = get_object_or_404(OrganizationLocation, id=location_id)

        reason_for_cancellation = request.POST.get('reason_for_cancellation','')

        if new_status == 1:
            status_text = 'Approved'
        elif new_status == 4:
            status_text = 'Cancelled'
            organizationLocation.status_description = reason_for_cancellation
        else:
            status_text = 'Unknown'

        organizationLocation.status = new_status
        organizationLocation.save()

        if new_status == 1:
            messages.success(request, SUCCESS_MESSAGES.get('orglocation_approve'))
        elif new_status == 3:
            messages.success(request, SUCCESS_MESSAGES.get('location'))
        elif new_status == 4:
            messages.success(request, SUCCESS_MESSAGES.get('orglocation_cancel'))

        user = request.user
        org = organizationLocation.organization.user

        subject = 'Location status'
        message = render_to_string('status_mail.html', {
            'user': org,
            'status': status_text
        })
        from_email = const_email
        recipient_list = [org.email]
        send_mail(subject,
                  message,
                  from_email,
                  recipient_list,
                  fail_silently=False)

        if user.groups.filter(name='Organization').exists():
            return redirect('preview')
        elif user.groups.filter(name='Tenant').exists():
            page_url = reverse(
                'organization_preview',
                kwargs={'pk': organizationLocation.organization.pk})
            return redirect(page_url)
        elif user.groups.filter(name='Customer').exists():
            return redirect('error')

@method_decorator(login_required, name='dispatch')
class ChangePasswordView(GroupAccessMixin, PasswordChangeView):
    template_name = 'change_password.html'
    success_url = reverse_lazy('password_change_done')
    group_required = ['Organization']

    def form_valid(self, form):
        messages.success(self.request, SUCCESS_MESSAGES.get('change_password'))
        logout(self.request)
        return super().form_valid(form)

class ResetPasswordView(SuccessMessageMixin, PasswordResetView):
    template_name = 'password_reset.html'
    email_template_name = 'password_reset_email.html'
    subject_template_name = 'password_reset_subject.txt'
    success_url = reverse_lazy('login')
    form_class = CustomPasswordResetForm

    def form_invalid(self, form):
        return self.render_to_response(self.get_context_data(form=form))

class CreateMultipleSlotsView(GroupAccessMixin, View):
    group_required = ['Organization']

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('location_pk')
        courts = Court.objects.filter(location_id=pk)
        form = SlotForm()

        # Check if all working days' times are None
        active_days = OrganizationLocationWorkingDays.objects.filter(
            organization_location=pk,
            is_active=True
        )

        show_warning = all(day.work_from_time is None or day.work_to_time is None for day in active_days)

        if show_warning:
            messages.error(request, ERROR_MESSAGES.get('default_slot_failure'))

        context = {
            'courts': courts,
            'form': form,
            'locationpk': pk,
            'show_warning': show_warning,
        }
        return render(request, 'ml.html', context)

    def post(self, request, *args, **kwargs):
        location_pk = kwargs.get('location_pk')

        courts = Court.objects.filter(location_id=location_pk)

        active_days = OrganizationLocationWorkingDays.objects.filter(
            organization_location=location_pk,
            is_active=True)

        if all(day.work_from_time is None or day.work_to_time is None for day in active_days):
            messages.error(request, ERROR_MESSAGES.get('default_slot_failure'))
            return redirect(reverse('slot-location'))

        Slot.objects.filter(court__location_id=location_pk).delete()

        for court in courts:
            for day in active_days:
                work_from_time = day.work_from_time
                work_to_time = day.work_to_time

                current_datetime = datetime.combine(datetime.now().date(), work_from_time)

                while current_datetime < datetime.combine(datetime.now().date(), work_to_time):
                    Slot.objects.create(
                        start_time=current_datetime.time(),
                        end_time=(current_datetime + timedelta(hours=1)).time(),
                        court=court,
                        location_id=location_pk,
                        days=day.days,
                        is_booked=False
                    )
                    current_datetime += timedelta(hours=1)

        messages.success(request, SUCCESS_MESSAGES.get('create_multipleslot'))
        return redirect(reverse('slot-location'))


@method_decorator(login_required, name='dispatch')
class TenantEmployeeHomeView(GroupAccessMixin, ListView):
    model = Organization
    template_name = 'tenantuser_page.html'
    context_object_name = 'organizations'
    group_required = ['Tenant']

    def get_queryset(self):
        return Organization.objects.filter(tenant = self.request.user.id)

@method_decorator(login_required, name='dispatch')
class BookingListView(GroupAccessMixin, ListView):
    model = Booking
    template_name = 'bookings_list.html'
    context_object_name = 'bookings'
    group_required = ['Tenant']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        customers = Customer.objects.filter(tenant=self.request.user.id)
        bookings = Booking.objects.filter(user__in=customers.values_list('user', flat=True))
        context['bookings'] = bookings
        return context

@method_decorator(login_required, name='dispatch')
class OrganizationListView(GroupAccessMixin, ListView):
    model = Organization
    template_name = 'organization_list.html'
    context_object_name = 'organizations'
    group_required = ['Tenant']

    def get_queryset(self):
        objects =  Organization.objects.filter(tenant__user = self.request.user.id)
        return objects
@method_decorator(login_required, name='dispatch')
class LocationListView(GroupAccessMixin, ListView):
    model = OrganizationLocation
    template_name = 'tenant_location_list2.html'
    context_object_name = 'organizationlocations'
    group_required = ['Tenant']

    def get_queryset(self):
        objects =  OrganizationLocation.objects.filter(organization__tenant__user = self.request.user.id)
        return objects

@method_decorator(login_required, name='dispatch')
class CancelOrganizationListView(GroupAccessMixin, ListView):
    model = Organization
    template_name = 'cancelled_organization.html'
    context_object_name = 'organizations'
    group_required = ['Tenant']

    def get_queryset(self):
        return Organization.objects.filter(tenant__user = self.request.user.id)

@method_decorator(login_required, name='dispatch')
class PendingOrganizationListView(GroupAccessMixin, ListView):
    model = Organization
    template_name = 'pending_organization.html'
    context_object_name = 'organizations'
    group_required = ['Tenant']

    def get_queryset(self):
        return Organization.objects.filter(tenant__user = self.request.user.id)

@method_decorator(login_required, name='dispatch')
class WaitingOrganizationListView(GroupAccessMixin, ListView):
    model = Organization
    template_name = 'waiting_organization.html'
    context_object_name = 'organizations'
    group_required = ['Tenant']

    def get_queryset(self):
        return Organization.objects.filter(tenant__user = self.request.user.id)

@method_decorator(login_required, name='dispatch')
class ConfirmOrganizationListView(GroupAccessMixin, ListView):
    model = Organization
    template_name = 'confirmed_organization.html'
    context_object_name = 'organizations'
    group_required = ['Tenant']

    def get_queryset(self):
        return Organization.objects.filter(tenant__user = self.request.user.id)

class TenantOrganizationPreviewView(GroupAccessMixin, DetailView):
    model = Organization
    template_name = 'tenant_organization_preview.html'
    context_object_name = 'organization'
    success_url = reverse_lazy('organization_preview')
    group_required = ['Tenant']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        organization = self.object

        locations = OrganizationLocation.objects.filter(
            organization=organization)

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
            context_item['courts'] = Court.objects.filter(location=location)
            context_item['happy'] = HappyHourPricing.objects.filter(organization_location=location)
            context_item['images'] = OrganizationGameImages.objects.filter(
                organization=location)
            context_item['slots'] = Slot.objects.filter(location_id=location)
            locationdetails.append(context_item)

        context['all_locations'] = locationdetails
        return context

@method_decorator(login_required, name='dispatch')
class OrganizationsCustomerlist(GroupAccessMixin, LoginRequiredMixin, ListView):
    model = Customer
    template_name = 'org_customers.html'
    context_object_name = 'customers'
    group_required = ['Organization']
    login_url = '/orglogin/'

    def get_queryset(self):
        organization = get_object_or_404(Organization, user=self.request.user)
        organization_locations = OrganizationLocation.objects.filter(organization=organization)
        bookings = Booking.objects.filter(court__location__in=organization_locations)
        booking_users = bookings.values_list('user', flat=True)
        customers = Customer.objects.filter(user__in=booking_users).distinct()
        return customers

@method_decorator(login_required, name='dispatch')
class TenantsCustomerlist(GroupAccessMixin, LoginRequiredMixin, ListView):
    model = Customer
    template_name = 'tenant_customers.html'
    context_object_name = 'customers'
    login_url = '/orglogin/'
    group_required = ['Tenant']

    def get_queryset(self):
        origin = self.request.META.get("HTTP_ORIGIN")
        user_object = User.objects.get(id = self.request.user.id)
        tenant_object = Tenant.objects.get(user = user_object)
        customers = Customer.objects.filter(
            tenant = tenant_object)
        return customers

class AddMultipleTempSlotsView(GroupAccessMixin, View):
    template_name = 'add_temp_slot.html'
    group_required = ['Organization']

    def get(self, request, *args, **kwargs):
        form = TempSlotForm(prefix='0')  # Start with prefix '0' for the first form
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        form_count = int(request.POST.get('form-TOTAL_FORMS', 1))
        forms = [TempSlotForm(request.POST, prefix=str(i)) for i in range(form_count)]

        if all(form.is_valid() for form in forms):
            for form in forms:
                pk = request.session.get('location_pk')
                if pk:
                    location = OrganizationLocation.objects.get(pk=pk)
                    form.instance.location = location
                    form.save()
                else:
                    messages.error(request, ERROR_MESSAGES.get('no_organization_location'))
                    return redirect('error')

            messages.success(request, SUCCESS_MESSAGES.get('create_tempslot'))
            return redirect('temp-slot-list')
        return render(request, self.template_name, {'forms': forms})


class TempSlotListView(GroupAccessMixin, ListView):
    model = AdditionalSlot
    template_name = 'temp-slots-list.html'
    context_object_name = 'tempSlots'
    group_required = ['Organization']

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        if pk:
            self.request.session['location_pk'] = pk
            return AdditionalSlot.objects.filter(location_id=pk)
        return AdditionalSlot.objects.none()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('location_pk')
        return context

    def post(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        id = request.POST.get('slot_id')
        if id:
            try:
                slot = AdditionalSlot.objects.get(id=id)
                slot.delete()
                messages.success(self.request, SUCCESS_MESSAGES.get('delete_additional_slot'))
                return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
            except AdditionalSlot.DoesNotExist:
                print(ERROR_MESSAGES.get('no_slots'))
        else:
            print(ERROR_MESSAGES.get('no_slot_id'))

@method_decorator(login_required, name='dispatch')
class TempSlotCreateView(GroupAccessMixin, CreateView):
    template_name = 'add_temp_slot.html'
    form_class = TempSlotForm
    group_required = ['Organization']

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_invalid(self, form):
        return self.render_to_response(
            self.get_context_data(form=form, error=form.errors.as_text())
        )

    def form_valid(self, form):
        try:
            pk = self.request.session.get('location_pk')
            if not pk:
                raise KeyError(ERROR_MESSAGES.get('no_pk'))
            location = OrganizationLocation.objects.get(pk=pk)
            form.instance.location = location
            messages.success(self.request, SUCCESS_MESSAGES.get('create_additional_slot'))
            response = super().form_valid(form)
            return response
        except KeyError as e:
            return self.render_to_response(
                self.get_context_data(form=form, error=str(e))
            )
        except OrganizationLocation.DoesNotExist:
            return self.render_to_response(
                self.get_context_data(form=form, error='Invalid location PK')
            )

    def get_success_url(self):
        return reverse_lazy('temp-slot-list', kwargs={'pk': self.request.session.get('location_pk')})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('location_pk')
        return context

@method_decorator(login_required, name='dispatch')
class UnavailableSlotListView(GroupAccessMixin, ListView):
    model = UnavailableSlot
    template_name = 'unavailable-slot-list.html'
    context_object_name = 'tempSlots'
    group_required = ['Organization']

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        if pk:
            self.request.session['location_pk'] = pk
            return UnavailableSlot.objects.filter(location_id=pk)
        return UnavailableSlot.objects.none()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['locationpk'] = self.request.session.get('location_pk')
        return context

    def post(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        id = request.POST.get('slot_id')
        if id:
            try:
                slot = UnavailableSlot.objects.get(id=id)
                slot.delete()
                messages.success(self.request, SUCCESS_MESSAGES.get('delete_unavailable_slot'))
                return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
            except UnavailableSlot.DoesNotExist:
                print(ERROR_MESSAGES.get('no_slots'))
        else:
            print(ERROR_MESSAGES.get('no_slot_id'))

@method_decorator(login_required, name='dispatch')
class UnavailableSlotCreateView(GroupAccessMixin, CreateView):
    form_class = unavailableSlotForm
    template_name = 'add-unavailable-slot.html'
    group_required = ['Organization']

    def clean_date(self):
        date = self.cleaned_data.get('date')
        today = datetime.now().date()
        if date < today:
            raise ValidationError(ERROR_MESSAGES.get('past_date'))
        return date

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_invalid(self, form):
        return self.render_to_response(
            self.get_context_data(form=form, error=form.errors.as_text())
        )

    def form_valid(self, form):
        try:
            pk = self.request.session.get('location_pk')
            if not pk:
                raise KeyError(ERROR_MESSAGES.get('no_pk'))
            location = OrganizationLocation.objects.get(pk=pk)
            form.instance.location = location
            response = super().form_valid(form)
            messages.success(self.request, SUCCESS_MESSAGES.get('create_unavailable_slot'))
            return response
        except KeyError as e:
            return self.render_to_response(
                self.get_context_data(form=form, error=str(e))
            )
        except OrganizationLocation.DoesNotExist:
            return self.render_to_response(
                self.get_context_data(form=form, error='Invalid location PK')
            )

    def get_success_url(self):
        return reverse_lazy('unavailable-slot-list', kwargs={'pk': self.request.session.get('location_pk')})

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pk'] = self.kwargs.get('pk')
        return context

@login_required
@group_required('Organization')
@ensure_csrf_cookie
def main_view(request, location_pk=None):
    context = {}
    referrer_url = request.META.get('HTTP_REFERER')
    organization_locations = OrganizationLocation.objects.filter(organization=request.user.organization)
    context['organization_locations'] = organization_locations
    context['referrer_url'] = referrer_url

    if location_pk is not None:
        request.session['location_pk'] = location_pk
        context['locationpk'] = location_pk
        context['location_pk'] = location_pk

    return render(request, 'main_template.html', context)


@login_required
@group_required('Organization')
@require_http_methods(["GET", "POST"])
def update_working_days(request, location_pk):
    queryset = OrganizationLocationWorkingDays.objects.filter(organization_location_id=location_pk)

    if request.method == 'POST':
        formset = OrganizationLocationWorkingDaysFormSet(request.POST, queryset=queryset)
        if formset.is_valid():
            instances = formset.save(commit=False)

            errors = []
            has_active = False

            for form in formset:
                is_active = form.cleaned_data.get('is_active')
                work_from_time = form.cleaned_data.get('work_from_time')
                work_to_time = form.cleaned_data.get('work_to_time')

                if is_active:
                    has_active = True
                    if not work_from_time or not work_to_time:
                        errors.append(ERROR_MESSAGES.get('working_days_time_failure'))
                    elif work_from_time == work_to_time:
                        errors.append(ERROR_MESSAGES.get('working_days_start_time_failure'))
                    elif work_to_time < work_from_time:
                        errors.append(ERROR_MESSAGES.get('working_days_failure'))

            if not has_active:
                errors.append(ERROR_MESSAGES.get('working_days_is_active_failure'))

            if errors:
                return JsonResponse({'status': 'error', 'errors': errors}, status=400)

            for instance in instances:
                instance.save()
            formset.save()
            return JsonResponse({'status': 'success', 'message': SUCCESS_MESSAGES.get('update_workingdays')})
        else:
            errors = {}
            for i, form in enumerate(formset):
                if form.errors:
                    for field, error_list in form.errors.items():
                        errors[f'{form.prefix}-{field}'] = error_list

            return JsonResponse({'status': 'error', 'errors': errors}, status=400)
    else:
        formset = OrganizationLocationWorkingDaysFormSet(queryset=queryset)

    return render(request, 'update_workingdays.html', {'formset': formset, 'locationpk': location_pk})

@login_required
@group_required('Organization')
def update_amenities(request, location_pk):
    amenities = OrganizationLocationAmenities.objects.filter(organization_location_id=location_pk).first()
    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        form = OrganizationLocationAmenitiesForm(request.POST, instance=amenities)
        if form.is_valid():
            form.instance.organization_location_id = location_pk
            form.save()
            return JsonResponse({'status': 'success', 'message': SUCCESS_MESSAGES.get('update_amenities')})
        else:
            error_messages = ''.join([f'{error}' for error in form.errors.values()])
            return JsonResponse({'status': 'error', 'message': format_html(ERROR_MESSAGES('form_validation_failed'), error_messages)}, status=400)
    else:
        form = OrganizationLocationAmenitiesForm(instance=amenities)
    return render(request, 'update_amenities.html', {'form': form, 'locationpk': location_pk})

@method_decorator(login_required, name='dispatch')
class OrganizationLocationRulesListView(GroupAccessMixin, ListView):
    model = OrganizationLocation
    template_name = 'org_location_rules_list.html'
    context_object_name = 'locations'
    group_required = ['Organization']

    def get_queryset(self):
        organization = get_object_or_404(Organization, user=self.request.user)
        return OrganizationLocation.objects.filter(organization=organization)

class OrganizationLocationRulesView(GroupAccessMixin, UpdateView):
    model = OrganizationLocation
    fields = ['rules']
    template_name = 'org_rules.html'
    context_object_name = 'location'
    group_required = ['Organization']

    def get_success_url(self):
        return reverse_lazy('organization_location_list')

    def form_valid(self, form):
        messages.success(self.request, SUCCESS_MESSAGES.get('update_rules'))
        return super().form_valid(form)

@login_required
@group_required('Organization')
def booking_schedule(request):
    organization = get_object_or_404(Organization, user=request.user)
    courts = Court.objects.filter(location__organization=organization)

    court_id = request.GET.get('court')
    if court_id:
        selected_court = get_object_or_404(Court, id=court_id, location__organization=organization)
    else:
        selected_court = courts.first()

    today = datetime.now().date()
    week_offset = int(request.GET.get('week_offset', 0))
    start_of_week = today - timedelta(days=today.weekday()) + timedelta(weeks=week_offset)
    end_of_week = start_of_week + timedelta(days=6)

    week_dates = [start_of_week + timedelta(days=i) for i in range(7)]

    # Generate 24-hour time slots
    time_slots = [f"{hour:02d}:00 to {(hour+1)%24:02d}:00" for hour in range(24)]

    # Initialize availability dictionary
    availability = {day.strftime('%Y-%m-%d'): {slot: 'Not-working' for slot in time_slots} for day in week_dates}

    # Populate availability based on court slots
    for day in week_dates:
        day_name = day.strftime('%A')
        day_slots = Slot.objects.filter(court=selected_court, days=day_name, is_booked=False)
        day_slotz = Slot.objects.filter(court=selected_court, days=day_name, is_booked=True)
        for slot in day_slots:
            slot_str = f"{slot.start_time.strftime('%H:%M')} to {slot.end_time.strftime('%H:%M')}"
            availability[day.strftime('%Y-%m-%d')][slot_str] = 'Available'
        for slot in day_slotz:
            slot_str = f"{slot.start_time.strftime('%H:%M')} to {slot.end_time.strftime('%H:%M')}"
            availability[day.strftime('%Y-%m-%d')][slot_str] = 'Membership Booking'

    additional_slots = AdditionalSlot.objects.filter(
        court=selected_court,
        date__range=[start_of_week, end_of_week],
        is_active=True
    )
    for add_slot in additional_slots:
        slot_str = f"{add_slot.start_time.strftime('%H:%M')} to {add_slot.end_time.strftime('%H:%M')}"
        availability[add_slot.date.strftime('%Y-%m-%d')][slot_str] = 'Available'

    unavailable_slots = UnavailableSlot.objects.filter(
        court=selected_court,
        date__range=[start_of_week, end_of_week],
        is_active=True
    )
    for unavail_slot in unavailable_slots:
        slot_str = f"{unavail_slot.start_time.strftime('%H:%M')} to {unavail_slot.end_time.strftime('%H:%M')}"
        availability[unavail_slot.date.strftime('%Y-%m-%d')][slot_str] = 'Not Working'

    bookings = Booking.objects.filter(
        court=selected_court,
        booking_date__range=[start_of_week, end_of_week],
        booking_status__in=[Booking.CONFIRMED, Booking.PENDING]
    )

    for booking in bookings:
        day = booking.booking_date.strftime('%Y-%m-%d')
        if booking.slot:
            slot_str = f"{booking.slot.start_time.strftime('%H:%M')} to {booking.slot.end_time.strftime('%H:%M')}"
            availability[day][slot_str] = 'Booked'
        elif booking.additional_slot:
            slot_str = f"{booking.additional_slot.start_time.strftime('%H:%M')} to {booking.additional_slot.end_time.strftime('%H:%M')}"
            availability[day][slot_str] = 'Booked'
        else:
            continue

    formatted_availability = {}
    for date, slots in availability.items():
        formatted_availability[date] = {}
        for time_slot, status in slots.items():
            formatted_availability[date][time_slot] = status
            
    context = {
        'courts': courts,
        'selected_court': selected_court,
        'time_slots': time_slots,
        'week_dates': week_dates,
        'availability': formatted_availability,
        'week_offset': week_offset,
        'prev_week': week_offset - 1,
        'next_week': week_offset + 1,
        'start_of_week': start_of_week,
        'end_of_week': end_of_week,
    }
    return render(request, 'org_schedule.html', context)

class CouponCreateView(CreateView):
    model = Coupon
    form_class = CouponForm
    template_name = 'coupon_form.html'
    success_url = reverse_lazy('coupon-list')

    def generate_coupon_code(self, discount_percentage):
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        return f"{random_part}{int(discount_percentage):02}"

    def form_valid(self, form):
        
        form.instance.organization = self.request.user.organization
        customer_number = form.instance.customer.phone_number
        email = form.instance.customer.user.email
        discount_percentage = self.request.POST.get('discount_percentage')
        form.instance.code = self.generate_coupon_code(discount_percentage)
        # send_coupon_sms(customer_number, form.instance.code)
        # send_coupon_whatsapp(customer_number, form.instance.code,discount_percentage)

        subject = MAIL_MESSAGES.get('welcome')
        message = f"Congratulations! You've received a coupon: {form.instance.code}. Use it soon!"

        from_email = EMAIL_HOST_USER
        recipient_list = [email]
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)

        messages.success(self.request, SUCCESS_MESSAGES.get('create_coupon'))
        return super().form_valid(form)

class CouponListView(ListView):
    model = Coupon
    template_name = 'coupon_list.html'
    context_object_name = 'coupons'

    def get_queryset(self):
        return Coupon.objects.filter(organization=self.request.user.organization)

@method_decorator(login_required, name='dispatch')
class HappyhoursLocationListView(GroupAccessMixin, ListView):
    model = OrganizationLocation
    template_name = 'happyhours_location.html'
    context_object_name = 'locations'
    group_required = ['Organization']

    def get_queryset(self):
        organization = get_object_or_404(Organization, user=self.request.user)
        return OrganizationLocation.objects.filter(organization=organization)


class HappyHourPricingManageView(GroupAccessMixin, View):
    template_name = 'happyhours_update.html'
    group_required = ['Organization']
    
    def get(self, request, pk):
        org_loc = get_object_or_404(OrganizationLocation, pk=pk)
        formset = HappyHourPricingFormSet(instance=org_loc, form_kwargs={'org_loc': org_loc})
        return render(request, self.template_name, {'formset': formset, 'org_loc': org_loc})

    def post(self, request, pk):
        org_loc = get_object_or_404(OrganizationLocation, pk=pk)
        formset = HappyHourPricingFormSet(request.POST, instance=org_loc, form_kwargs={'org_loc': org_loc})
        
        if formset.is_valid():
            instances = formset.save(commit=False)
            instances_to_keep = set()

            for instance in instances:
                instance.save()
                instances_to_keep.add(instance.pk)
            
            for form in formset.forms:
                if form.cleaned_data.get('DELETE') and form.instance.pk:
                    form.instance.delete()
                elif form.instance.pk:
                    instances_to_keep.add(form.instance.pk)
            
            HappyHourPricing.objects.filter(organization_location=org_loc).exclude(pk__in=instances_to_keep).delete()

            formset.save_m2m()

            messages.success(request, SUCCESS_MESSAGES.get('update_happy'))
            return HttpResponseRedirect(reverse('manage_happyhours', kwargs={'pk': pk}))
          
        else:
            messages.error(request, ERROR_MESSAGES.get('happy_failure'))
        return render(request, self.template_name, {'formset': formset, 'org_loc': org_loc})