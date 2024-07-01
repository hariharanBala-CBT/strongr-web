from django.urls import path
from . import views 

urlpatterns = [
    path('areas/', views.getAreas, name='areas'),
    path('clubs/', views.getClubs, name='clubs'),
    path('filterclubs/',views.filterClubs, name='filter-clubs'),
    path('games/', views.getGameTypes, name='games'),
    path('recentsearch/', views.recentSearch, name='recent_search'),
    path('resetpassword/', views.resetPassword, name="reset-password"),
    path('search/', views.search, name='search'),
    path('slots/', views.getAvailableSlots, name='get-slots'),
    path('booking/create/', views.createBooking, name='create-booking'),
    path('login/phone/', views.PhoneLoginView, name='phone_login'),
    path('profile/update/', views.updateUserProfile, name="user-profile-update"),
    path('slots/unavailable/', views.getUnavailableSlots, name='get-slots'),
    path('slots/additional/', views.getAdditionalSlots, name='get-slots'),
    path('username/validate/', views.ValidateUser, name='user-validate'),
    path('userdetails/validate/', views.ValidateUserDetails, name='user-details-validate'),
    path('phone/validate/', views.ValidatePhone, name='phone-validate'),
    path('<str:pk>/', views.getClub, name="club"),
    path('booking/details/<str:pk>/', views.getBookingDetails, name='booking-details'),
    path('booking/cancel/<str:pk>/', views.cancelBooking, name='cancel-booking'),
    path('court/<str:pk>/', views.getCourt, name='get-court'),
    path('courts/<str:pk>/', views.getCourts, name='get-courts'),
    path('customer/<str:pk>/', views.getCustomer, name='get-customer'),
    path('clubamenities/<str:pk>/', views.getClubAmenities, name="club-amenities"),
    path('clublocation/<str:pk>/', views.getClubLocation, name="club-location"),
    path('clubgame/<str:pk>/', views.getClubGame, name="club-game"),
    path('clubimages/<str:pk>/', views.getClubImages, name="club-images"),
    path('club/reviewslist/<str:pk>/', views.getClubReviews, name='get-reviews'),
    path('club/reviews/<str:pk>', views.createProductReview, name="club-review"),
    path('club/suggested/', views.getSuggestedClub, name="suggested-club"),
    path('club/suggestedgame/', views.getSuggestedClubGame, name="suggested-club"),
    path('clubs/rated/', views.getHighRatedClubs, name="rated-clubs"),
    path('clubworking/<str:pk>/', views.getClubWorkingDays, name="club-working-days"),
    path('slot/<str:pk>/', views.getSlot, name='get-slot'),
    path('userbookings/<str:pk>/', views.getUserBookings, name='user-bookings'),
]                                                                        