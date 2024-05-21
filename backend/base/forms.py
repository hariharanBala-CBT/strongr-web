import datetime
from django.utils import timezone
from django import forms
from django.db.models.base import Model 
from django.forms import ClearableFileInput, DateInput, ValidationError, ModelForm, modelformset_factory
from .models import *
from booking.models import *
from django.contrib.auth.models import User
from django import forms
from django.core.validators import MaxValueValidator, MinValueValidator


class OrganizationSignupForm(forms.Form): 
    phone_number = forms.IntegerField() 
    organization_name =forms.CharField(max_length=150)
    first_name= forms.CharField(max_length=150)  
    last_name = forms.CharField(max_length=150)   
    email = forms.EmailField(label='Organization Email')   

    def generate_password(request):    
     password = User.objects.make_random_password(length=6, allowed_chars="qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890")  
     return password
    
    def username_clean(self):    
        username = self.cleaned_data['username'].lower()     
        new = User.objects.filter(username = username)     
        if new.count():       
            raise ValidationError("User Already Exist")   
        return username 

    def email_clean(self):     
        email = self.cleaned_data['email'].lower()     
        new = User.objects.filter(email=email)     
        if new.count():       
            raise ValidationError(" Email Already Exist")     
        return email   
    
    def save(self, pwd, commit = True):     
        user = User.objects.create_user(       
            username = self.cleaned_data['email'],       
            email=self.cleaned_data['email'],       
            password = pwd,      
            first_name=self.cleaned_data['first_name'],      
            last_name=self.cleaned_data['last_name']
            )    
        return user

class LoginForm(forms.Form):
    username = forms.CharField(max_length=254, widget=forms.TextInput(attrs={'placeholder':'username'}))
    password = forms.CharField(max_length=100, widget=forms.PasswordInput(attrs={'placeholder': 'password'}))

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not User.objects.filter(username=username).exists():
            raise ValidationError("Username does not exist.")
        return username

    def clean_password(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        user = User.objects.filter(username=username).first()
        if user and not user.check_password(password):
            raise ValidationError("Password is incorrect.")
        return password  

class OrganizationProfileForm(forms.ModelForm):
    organization_name = forms.CharField(max_length=50,disabled=True)
    class Meta:
        model = Organization
        fields = ['organization_name','phone_number', 'alt_number', 'description']
        widgets = {
            'description':forms.Textarea(attrs={'rows':2 , 'cols':25})
        }


class OrganizationLocationForm(ModelForm):
     pincode = forms.IntegerField(validators=[MinValueValidator(100000, message='Make sure pincode is 6-digits'), MaxValueValidator(999999, message='Make sure pincode is 6-digits')])
     class Meta:
         model = OrganizationLocation
         fields = ['address_line_1', 'address_line_2', 'area', 'pincode', 'phone_number']
         widgets = {
            'address_line_1':forms.Textarea(attrs={'rows':2 , 'cols':20}),
            'address_line_2':forms.Textarea(attrs={'rows':2 , 'cols':20})

            }
                
class OrganizationLocationGameTypeForm(ModelForm):

    class Meta:
        model = OrganizationLocationGameType
        fields = ['game_type', 'pricing','description']
        widgets = {
            'description':forms.Textarea(attrs={'rows':2 , 'cols':25})
        }

class OrganizationLocationGameTypeCreateForm(ModelForm):
    class Meta:
        model = OrganizationLocationGameType
        fields = ['game_type', 'pricing', 'number_of_courts', 'description']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 2, 'cols': 25})
        }

    def __init__(self, *args, **kwargs):
        organization_location = kwargs.pop('organization_location', None)
        super().__init__(*args, **kwargs)
        if organization_location:
            existing_game_types = OrganizationLocationGameType.objects.filter(
                organization_location=organization_location
            ).values_list('game_type', flat=True)
            self.fields['game_type'].queryset = GameType.objects.exclude(pk__in=existing_game_types)

class OrganizationGameImagesForm(forms.ModelForm):
    clear_image = forms.BooleanField(required=False)
    class Meta:
        model = OrganizationGameImages
        fields = ['image']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['image'].required = True
 

class OrganizationLocationAmenitiesForm(ModelForm):
    
    class Meta:
        model = OrganizationLocationAmenities
        fields = ['is_parking', 'is_restrooms', 'is_changerooms', 'is_powerbackup', 'is_beverages_facility', 'is_coaching_facilities', 'description']
        widgets = {
            'description':forms.Textarea(attrs={'rows':2 , 'cols':25})
        }

class OrganizationLocationWorkingDaysForm(ModelForm):
      
      class Meta:
        model = OrganizationLocationWorkingDays
        fields = ['work_from_time', 'work_to_time','is_active']
        widgets = {
          'work_from_time': forms.TimeInput(attrs={'type': 'time'}),
          'work_to_time': forms.TimeInput(attrs={'type': 'time' }),
          
            }
OrganizationLocationWorkingDaysFormSet = modelformset_factory(OrganizationLocationWorkingDays, form = OrganizationLocationWorkingDaysForm,extra=0)

class TermsandConditionsForm(forms.Form):

    agree=forms.BooleanField(required=True)

class CourtForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None) 
        super(CourtForm, self).__init__(*args, **kwargs)
        if self.request:
            key = self.request.session.get('location_pk')
            if key:
                self.fields['game'].queryset = OrganizationLocationGameType.objects.filter(organization_location_id=key)

    class Meta:
        model = Court
        exclude = ('location',)
        widgets = {
            'description': forms.Textarea(attrs={'rows': 2, 'cols': 21})
        }


class SlotForm(forms.ModelForm):
    start_time = forms.TimeField(widget=forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}))
    end_time = forms.TimeField(widget=forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}))

    class Meta:
        model = Slot
        fields = ['start_time', 'end_time', 'court', 'days']

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(SlotForm, self).__init__(*args, **kwargs)
        if self.request:
            key = self.request.session.get('location_pk')
            if key:
                self.fields['court'].queryset = Court.objects.filter(location_id=key)
                self.fields['days'].queryset = OrganizationLocationWorkingDays.objects.filter(organization_location=key, is_active=True)

    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("start_time")
        end_time = cleaned_data.get("end_time")
        court = cleaned_data.get("court")
        days = cleaned_data.get("days")

        # Check if a slot with the same start_time, end_time, court, and days already exists
        if Slot.objects.filter(start_time=start_time, end_time=end_time, court=court, days=days).exists():
            raise forms.ValidationError("A slot with the same details already exists.")
        
        time_diff_seconds = (end_time.hour * 3600 + end_time.minute * 60 + end_time.second) - \
                            (start_time.hour * 3600 + start_time.minute * 60 + start_time.second)
        time_diff_minutes = time_diff_seconds / 60

        # Check if the time difference exceeds one hour
        if time_diff_minutes > 60:
            raise forms.ValidationError("Time difference between slots cannot exceed one hour.")

        return cleaned_data

class SlotUpdateForm(forms.ModelForm):
    start_time = forms.TimeField(widget=forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}))
    end_time = forms.TimeField(widget=forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}))
    days = forms.CharField(disabled=True)


    class Meta:
        model = Slot
        fields = ['start_time', 'end_time', 'is_booked', 'days', 'court']


    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(SlotUpdateForm, self).__init__(*args, **kwargs)
        if self.request:
            key = self.request.session.get('location_pk')
    
    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("start_time")
        end_time = cleaned_data.get("end_time")
        court = cleaned_data.get("court")
        days = cleaned_data.get("days")

        # Check if a slot with the same start_time, end_time, court, and days already exists
        if Slot.objects.filter(start_time=start_time, end_time=end_time, court=court, days=days).exists():
            raise forms.ValidationError("A slot with the same details already exists.")
        
        time_diff_seconds = (end_time.hour * 3600 + end_time.minute * 60 + end_time.second) - \
                            (start_time.hour * 3600 + start_time.minute * 60 + start_time.second)
        time_diff_minutes = time_diff_seconds / 60

        # Check if the time difference exceeds one hour
        if time_diff_minutes > 60:
            raise forms.ValidationError("Time difference between slots cannot exceed one hour.")

        return cleaned_data

class TempSlotForm(forms.ModelForm):
    start_time = forms.TimeField(label='Select start time', widget=forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}))
    end_time = forms.TimeField(label='Select end time', widget=forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}))
    date = forms.DateField(label='Select date', widget=forms.DateInput(attrs={'type': 'date'}))

    class Meta:
        model = AdditionalSlot
        fields = ['start_time', 'end_time', 'court', 'date']

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(TempSlotForm, self).__init__(*args, **kwargs)
        if self.request:
            key = self.request.session.get('location_pk')
            if key:
                self.fields['court'].queryset = Court.objects.filter(location_id=key)


class unavailableSlotForm(forms.ModelForm):
    start_time = forms.TimeField(label='Select start time', widget=forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}))
    end_time = forms.TimeField(label='Select end time', widget=forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}))
    date = forms.DateField(label='Select date', widget=forms.DateInput(attrs={'type': 'date'}))

    class Meta:
        model = UnavailableSlot
        fields = ['start_time', 'end_time', 'court', 'date']

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(unavailableSlotForm, self).__init__(*args, **kwargs)
        if self.request:
            key = self.request.session.get('location_pk')
            if key:
                self.fields['court'].queryset = Court.objects.filter(location_id=key)
    