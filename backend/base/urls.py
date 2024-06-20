from django.urls import path
from .views import *
from django.contrib.auth import views as auth_views

urlpatterns = [
     path('', TemplateView.as_view(template_name = 'cover.html'), name='home'),
     path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
     path('login/phone/', PhoneLoginView, name='phone_login'),
     path('register/', registerUser, name='register'),
     path('home/', TemplateView.as_view(template_name = 'getstarted.html'), name='home_page'),
     path('orgsignup/', OrganizationSignupView.as_view(), name='signup'),
     path('orglogin/', LoginView.as_view(), name='login'),
     path('logout/', LogoutView.as_view(), name='logout'),
     path('organizationpage/',OrganizationHomeView.as_view(), name='organization_page'),
     path('confirmed_bookings/',ListofConfirmBookingView.as_view(), name='confirmed_bookings'),
     path('pending_bookings/',ListofPendingBookingView.as_view(), name='pending_bookings'),
     path('cancelled_bookings/',ListofCancelledBookingView.as_view(), name='cancelled_bookings'),

     path('sendotp/', generateOtp, name="generate-otp"),
     path('sendotp/update/', generateUpdateOtp, name="generate-update-otp"),


     path('organizationprofile/<int:pk>/' ,OrganizationProfileView.as_view(), name='organization_profile'),
     path('organizationaddlocation/' ,OrganizationAddLocationView.as_view(), name='organization_addlocation'),
     path('organizationupdatelocation/<int:pk>/', update_location, name='organization_updatelocation'),
     path('organizationlocationlist/' ,OrganizationLocationListView.as_view(), name='organization_locationlist'),
     path('organizationlocationgametype/<int:locationpk>/' ,OrganizationLocationGameTypeView.as_view(), name='organization_locationgametype'),
     path('organizationupdatelocationgametype/<int:locationpk>/<int:gamepk>/' ,OrganizationUpdateLocationGameTypeView.as_view(), name='organization_updatelocationgametype'),
     path('organizationlocationgamelist/<int:locationpk>/' ,OrganizationLocationGameListView.as_view(), name='organization_locationgamelist'),
     path('organizationlocationimageslist/<int:locationpk>/' ,OrganizationLocationImageListView.as_view(), name='organization_imageslist'),
     path('organizationlocationimages/<int:locationpk>/', OrganizationLocationImageView.as_view(), name='organization_images'),
     path('organizationupdateimages/<int:pk>/', OrganizationUpdateLocationImageView.as_view(), name='organization_updateimages'),
     path('organizationdeleteimage/<int:pk>/', OrganizationDeleteLocationImageView.as_view(), name='organization_deleteimage'),
     path('add-court/', CourtCreateView.as_view(), name='add-court'),
     path('update-court/<int:locationpk>/<int:courtpk>/', CourtUpdateView.as_view(), name='update-court'),
     path('court-list/<int:locationpk>/', CourtsListView.as_view(), name='court-list'),
     path('delete-court/<int:pk>', CourtDeleteView.as_view(), name='delete-court'),
     path('add-slot/<int:pk>/', SlotCreateView.as_view(), name='add-slot'),
     path('add-temp-slot/<int:pk>/', TempSlotCreateView.as_view(), name='add-temp-slot'),
     path('temp-slot-location/', TempslotLocationListView.as_view(), name='temp-slot-location'),
     path('temp-unavailableslot-location/', TempdeslotLocationListView.as_view(), name='temp-deslot-location'),
     path('temp-slot-list/<int:pk>/', TempSlotListView.as_view(), name='temp-slot-list'),
     path('temp-slot-list/<int:id>', TempSlotListView.as_view(), name='temp-slot-list'),
     path('add-unavailable-slot/<int:pk>/', UnavailableSlotCreateView.as_view(), name='add-unavailable-slot'),
     path('unavailable-slot-list/<int:pk>/', UnavailableSlotListView.as_view(), name='unavailable-slot-list'),

     path('slot-list/<int:locationpk>/', SlotListView.as_view(), name='slot-list'),
     path('tenant-slot-list/<int:locationpk>/', TenantSlotListView.as_view(), name='tenant-slot-list'),
     path('slot/location/', SlotLocationListView.as_view(), name='slot-location' ),
     path('update-slot/<int:pk>/', SlotUpdateView.as_view(), name='update-slot'),
     path('delete-slot/<int:pk>/', SlotDeleteView.as_view(), name='delete-slot'),

     path('error/', TemplateView.as_view(template_name='error.html'), name='error'),
     path('multiple-slot/<int:location_pk>', CreateMultipleSlotsView.as_view(), name='multiple-slot'),
     path('organizationlocationamenities/<int:location_pk>/' ,update_amenities, name='organization_locationamenities'),
     path('organizationlocationworkingdays/<int:location_pk>/' , update_working_days, name='organization_locationworkingdays'),
     path('preview/' ,PreviewView.as_view(), name='preview'),
     path('termsandconditions/' ,TermsandConditionsView.as_view(),name='termsandconditions'),
     path('terms-conditions/' ,TenantTermsandConditionsView.as_view(),name='termsconditions'),
     path('privacy-policy/' ,PrivacyPolicyView.as_view(), name='privacypolicy'),

     path('user/' ,TenantEmployeeHomeView.as_view(), name='tenantuser_page'),
     path('organization_list/' ,OrganizationListView.as_view(),name='organization_list'),
     path('location_list/' ,LocationListView.as_view(),name='location_list'),
     path('organization_preview/<int:pk>/', TenantOrganizationPreviewView.as_view(), name='organization_preview'),
     path('organizations/<int:organization_id>/change_status/<int:new_status>/', ChangeOrganizationStatusView.as_view(), name='change_organization_status'),
     path('organizationlocation/<int:location_id>/change_status/<int:new_status>/', ChangeOrganizationLocationStatusView.as_view(), name='change_location_status'),
     path('booking_list/' ,BookingListView.as_view(),name='booking_list'),


     path('approvallist/' ,ApprovalListView.as_view(),name='approval_list'),
     path('user/' ,TenantEmployeeHomeView.as_view(), name='tenantuser_page'),
     path('organization_list/' ,OrganizationListView.as_view(),name='organization_list'),
     path('cancelled_organization_list/' ,CancelOrganizationListView.as_view(),name='cancelled_organization_list'),
     path('pending_organization_list/' ,PendingOrganizationListView.as_view(),name='pending_organization_list'),
     path('waiting_organization_list/' ,WaitingOrganizationListView.as_view(),name='waiting_organization_list'),
     path('confirmed_organization_list/' ,ConfirmOrganizationListView.as_view(),name='confirmed_organization_list'),
     path('organization_preview/<int:pk>/', TenantOrganizationPreviewView.as_view(), name='organization_preview'),
     path('organizations/<int:organization_id>/change_status/<int:new_status>/', ChangeOrganizationStatusView.as_view(), name='change_organization_status'),
     path('status/' ,StatusView.as_view(), name='status'),
     path('organization/location/<int:location_pk>/', main_view, name='mainview'),

     # path('success/', TemplateView.as_view(template_name = 'success.html'), name='success'),
     # path('reject/', TemplateView.as_view(template_name = 'reject.html'), name='reject'),
     path('change-password/', ChangePasswordView.as_view(), name='change_password'),

     # path('signup/', TemplateView.as_view(template_name = 'signup.html'), name='signup'),
     # path ('org-create/', TemplateView.as_view(template_name = 'org_createlocation.html'),name='org_create'),

     path('password-reset/', ResetPasswordView.as_view(), name='password_reset'),
     path('password-reset-confirm/<uidb64>/<token>/',
          auth_views.PasswordResetConfirmView.as_view(template_name='password_reset_confirm.html'),
          name='password_reset_confirm'),
     path('password-reset-complete/',
          auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_complete.html'),
          name='password_reset_complete'),

     path('organization/customers/', OrganizationsCustomerlist.as_view(), name='org_customers_list'),
     path('tenant/customers/', TenantsCustomerlist.as_view(), name='tenant_customers_list'),


     ]