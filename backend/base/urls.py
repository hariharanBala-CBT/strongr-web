from django.urls import path
from .views import *
from django.contrib.auth import views as auth_views

urlpatterns = [
     path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
     path('register/', registerUser, name='register'),
     path('home/', HomePageView.as_view(),name='home_page'),
     path('signup/', OrganizationSignupView.as_view(), name='signup'),
     path('orglogin/', LoginView.as_view(), name='login'),
     path('logout/', LogoutView.as_view(), name='logout'),
    
     path('organizationpage/',OrganizationHomeView.as_view(), name='organization_page'),
     path('confirmed_bookings/',ListofConfirmBookingView.as_view(), name='confirmed_bookings'),
     path('pending_bookings/',ListofPendingBookingView.as_view(), name='pending_bookings'),
     path('cancelled_bookings/',ListofCancelledBookingView.as_view(), name='cancelled_bookings'),
    
     path('organizationprofile/<int:pk>/' ,OrganizationProfileView.as_view(), name='organization_profile'),
     path('organizationaddlocation/' ,OrganizationAddLocationView.as_view(), name='organization_addlocation'),
     path('organizationupdatelocation/<int:pk>/' , OrganizationUpdateLocationView.as_view(), name='organization_updatelocation'),
     path('organizationlocationlist/' ,OrganizationLocationListView.as_view(), name='organization_locationlist'),
     path('organizationlocationgametype/' ,OrganizationLocationGameTypeView.as_view(), name='organization_locationgametype'),
     path('organizationupdatelocationgametype/<int:pk>/' ,OrganizationUpdateLocationGameTypeView.as_view(), name='organization_updatelocationgametype'),
     path('organizationlocationgamelist/' ,OrganizationLocationGameListView.as_view(), name='organization_locationgamelist'),
     path('organizationlocationimageslist/' ,OrganizationLocationImageListiew.as_view(), name='organization_imageslist'),
     path('organizationlocationimages/', OrganizationLocationImageView.as_view(), name='organization_images'),
     path('organizationupdateimages/<int:pk>/', OrganizationUpdateLocationImageView.as_view(), name='organization_updateimages'),
     path('organizationdeleteimage/<int:pk>/', OrganizationDeleteLocationImageView.as_view(), name='organization_deleteimage'),
     path('add-court/', CourtCreateView.as_view(), name='add-court'),
     path('update-court/<int:pk>', CourtUpdateView.as_view(), name='update-court'),
     path('court-list/', CourtsListView.as_view(), name='court-list'),
     path('delete-court/<int:pk>', CourtDeleteView.as_view(), name='delete-court'),
     path('add-slot/', SlotCreateView.as_view(), name='add-slot'),
     path('slot-list/', SlotListView.as_view(), name='slot-list'),
     path('update-slot/<int:pk>', SlotUpdateView.as_view(), name='update-slot'),
     path('delete-slot/<int:pk>', SlotDeleteView.as_view(), name='delete-slot'),
     path('error/', TemplateView.as_view(template_name='error_template.html'), name='error_view'),
     path('multiple-slot/<int:court_pk>', CreateMultipleSlotsView.as_view(), name='multiple-slot'),
     path('error/', TemplateView.as_view(template_name = 'error.html'), name='error-url'),
     path('organizationlocationamenities/' ,OrganizationLocationAmenitiesView.as_view(), name='organization_locationamenities'),
     path('organizationlocationworkingdays/' , OrganizationWorkingDaysView.as_view(), name='organization_locationworkingdays'),
     path('preview/' ,PreviewView.as_view(), name='preview'),
     path('termsandconditions/' ,TermsandConditionsView.as_view(),name='termsandconditions'),
    
     path('user/' ,TenantEmployeeHomeView.as_view(), name='tenantuser_page'),
     path('organization_list/' ,OrganizationListView.as_view(),name='organization_list'),
     path('organization_preview/<int:pk>/', TenantOrganizationPreviewView.as_view(), name='organization_preview'),
     path('organizations/<int:organization_id>/change_status/<int:new_status>/', ChangeOrganizationStatusView.as_view(), name='change_organization_status'),
    
     
     path('approvallist/' ,ApprovalListView.as_view(),name='approval_list'),
     path('user/' ,TenantEmployeeHomeView.as_view(), name='tenantuser_page'),
     path('organization_list/' ,OrganizationListView.as_view(),name='organization_list'),
     path('cancelled_organization_list/' ,CancelOrganizationListView.as_view(),name='cancelled_organization_list'),
     path('pending_organization_list/' ,PendingOrganizationListView.as_view(),name='pending_organization_list'),
     path('waiting_organization_list/' ,WaitingOrganizationListView.as_view(),name='waiting_organization_list'),
     path('confirmed_organization_list/' ,ConfirmOrganizationListView.as_view(),name='confirmed_organization_list'),
     path('organization_preview/<int:pk>/', TenantOrganizationPreviewView.as_view(), name='organization_preview'),
     path('organizations/<int:organization_id>/change_status/<int:new_status>/', ChangeOrganizationStatusView.as_view(), name='change_organization_status'),
     path('verify/<int:pk>/' ,VerifyView.as_view(),name='verify'),
     path('status/' ,StatusView.as_view(), name='status'),
     path('response/<str:action>/', ApprovalRejectionView.as_view(), name='response'),
     path('success/', TemplateView.as_view(template_name = 'success.html'), name='success'),
     path('reject/', TemplateView.as_view(template_name = 'reject.html'), name='reject'),
     path('change-password/', ChangePasswordView.as_view(), name='change_password'),
     
     
     path('signup/', TemplateView.as_view(template_name = 'signup.html'), name='signup'), 
     path ('org-create/', TemplateView.as_view(template_name = 'org_createlocation.html'),name='org_create'),
     
     path('password-reset/', ResetPasswordView.as_view(), name='password_reset'),
     path('password-reset-confirm/<uidb64>/<token>/',
          auth_views.PasswordResetConfirmView.as_view(template_name='password_reset_confirm.html'),
          name='password_reset_confirm'),
     path('password-reset-complete/',
          auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_complete.html'),
          name='password_reset_complete'),


     ]