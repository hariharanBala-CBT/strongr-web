from django.urls import path
from . import views 

urlpatterns = [
    path('areas/', views.getAreas, name='areas'),
    path('games/', views.getGameTypes, name='games'),
    path('clubs/', views.getClubs, name='clubs'),
    path('filterclubs/',views.filterClubs, name='filter-clubs'),
    path('sendotp/', views.generateOtp, name="generate-otp"),
    path('slots/', views.getAvailableSlots, name='get-slots'),
    path('booking/create/', views.createBooking, name='create-booking'),
    path('profile/update/', views.updateUserProfile, name="user-profile-update"),
    path('resetpassword/', views.resetPassword, name="reset-password"),
    path('login/phone/', views.PhoneLoginView, name='phone_login'),
    path('<str:pk>/', views.getClub, name="club"),
    path('slot/<str:pk>/', views.getSlot, name='get-slot'),
    path('court/<str:pk>/', views.getCourt, name='get-court'),
    path('customer/<str:pk>/', views.getCustomer, name='get-customer'),
    path('userbookings/<str:pk>/', views.getUserBookings, name='user-bookings'),
    path('clublocation/<str:pk>/', views.getClubLocation, name="club-location"),
    path('clubgame/<str:pk>/', views.getClubGame, name="club-game"),
    path('clubamenities/<str:pk>/', views.getClubAmenities, name="club-amenities"),
    path('clubworking/<str:pk>/', views.getClubWorkingDays, name="club-working-days"),
    path('clubimages/<str:pk>/', views.getClubImages, name="club-images"),
    path('courts/<str:pk>/', views.getCourts, name='get-courts'),
    path('booking/details/<str:pk>/', views.getBookingDetails, name='booking-details'),
    path('booking/cancel/<str:pk>/', views.cancelBooking, name='cancel-booking'),
    path('club/reviewslist/<str:pk>/', views.getClubReviews, name='get-reviews'),
    path('club/reviews/<str:pk>', views.createProductReview, name="club-review"),

]