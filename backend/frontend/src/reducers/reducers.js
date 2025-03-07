import {
  CLUB_LIST_REQUEST,
  CLUB_LIST_SUCCESS,
  CLUB_LIST_FAIL,
  CLUB_DETAIL_REQUEST,
  CLUB_DETAIL_SUCCESS,
  CLUB_DETAIL_FAIL,
  CLUB_LOCATION_REQUEST,
  CLUB_LOCATION_SUCCESS,
  CLUB_LOCATION_FAIL,
  CLUB_AMENITIES_REQUEST,
  CLUB_AMENITIES_SUCCESS,
  CLUB_AMENITIES_FAIL,
  CLUB_WORKING_REQUEST,
  CLUB_WORKING_SUCCESS,
  CLUB_WORKING_FAIL,
  CLUB_GAME_REQUEST,
  CLUB_GAME_SUCCESS,
  CLUB_GAME_FAIL,
  CLUB_IMAGE_REQUEST,
  CLUB_IMAGE_SUCCESS,
  CLUB_IMAGE_FAIL,
  GAME_LIST_REQUEST,
  GAME_LIST_SUCCESS,
  GAME_LIST_FAIL,
  AREA_LIST_REQUEST,
  AREA_LIST_SUCCESS,
  AREA_LIST_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  FILTER_CLUB_REQUEST,
  FILTER_CLUB_SUCCESS,
  FILTER_CLUB_FAIL,
  BOOKING_CREATE_REQUEST,
  BOOKING_CREATE_SUCCESS,
  BOOKING_CREATE_FAIL,
  BOOKING_CREATE_RESET,
  BOOKING_DETAILS_REQUEST,
  BOOKING_DETAILS_SUCCESS,
  BOOKING_DETAILS_FAIL,
  BOOKING_LIST_REQUEST,
  BOOKING_LIST_SUCCESS,
  BOOKING_LIST_FAIL,
  COURT_LIST_REQUEST,
  COURT_LIST_SUCCESS,
  COURT_LIST_FAIL,
  COURT_DETAILS_REQUEST,
  COURT_DETAILS_SUCCESS,
  COURT_DETAILS_FAIL,
  AVAILABLE_SLOT_REQUEST,
  AVAILABLE_SLOT_SUCCESS,
  AVAILABLE_SLOT_FAIL,
  SLOT_REQUEST,
  SLOT_SUCCESS,
  SLOT_FAIL,
  USER_BOOKING_LIST_SUCCESS,
  USER_BOOKING_LIST_REQUEST,
  USER_BOOKING_LIST_FAIL,
  CUSTOMER_DETAILS_REQUEST,
  CUSTOMER_DETAILS_SUCCESS,
  CUSTOMER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
  GENERATE_OTP_REQUEST,
  GENERATE_OTP_SUCCESS,
  GENERATE_OTP_FAIL,
  BOOKING_DETAILS_RESET,
  BOOKING_CANCEL_REQUEST,
  BOOKING_CANCEL_SUCCESS,
  BOOKING_CANCEL_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_RESET,
  USER_LOGIN_RESET,
  CLUB_CREATE_REVIEW_REQUEST,
  CLUB_CREATE_REVIEW_SUCCESS,
  CLUB_CREATE_REVIEW_FAIL,
  CLUB_CREATE_REVIEW_RESET,
  CLUB_REVIEW_REQUEST,
  CLUB_REVIEW_SUCCESS,
  CLUB_REVIEW_FAIL,
  SEARCH_ORGANIZATIONS_REQUEST,
  SEARCH_ORGANIZATIONS_SUCCESS,
  SEARCH_ORGANIZATIONS_FAIL,
  RECENT_SEARCH_REQUEST,
  RECENT_SEARCH_SUCCESS,
  RECENT_SEARCH_FAIL,
  SUGGESTED_CLUB_REQUEST,
  SUGGESTED_CLUB_SUCCESS,
  SUGGESTED_CLUB_FAIL,
  SUGGESTED_CLUBGAME_REQUEST,
  SUGGESTED_CLUBGAME_SUCCESS,
  SUGGESTED_CLUBGAME_FAIL,
  USER_VALIDATE_REQUEST,
  USER_VALIDATE_SUCCESS,
  USER_VALIDATE_FAIL,
  USER_VALIDATE_RESET,
  ADDITIONAL_SLOT_REQUEST,
  ADDITIONAL_SLOT_SUCCESS,
  ADDITIONAL_SLOT_FAIL,
  UNAVAILABLE_SLOT_REQUEST,
  UNAVAILABLE_SLOT_SUCCESS,
  UNAVAILABLE_SLOT_FAIL,
  PHONE_VALIDATE_REQUEST,
  PHONE_VALIDATE_SUCCESS,
  PHONE_VALIDATE_FAIL,
  PHONE_VALIDATE_RESET,
  USERDETAILS_VALIDATE_REQUEST,
  USERDETAILS_VALIDATE_SUCCESS,
  USERDETAILS_VALIDATE_FAIL,
  USERDETAILS_VALIDATE_RESET,
  TOPRATED_CLUBS_REQUEST,
  TOPRATED_CLUBS_SUCCESS,
  TOPRATED_CLUBS_FAIL,
  TOPRATED_CLUBS_RESET,
  NEAREST_SLOT_REQUEST,
  NEAREST_SLOT_SUCCESS,
  NEAREST_SLOT_FAIL,
  CLUB_RULES_REQUEST,
  CLUB_RULES_SUCCESS,
  CLUB_RULES_FAIL,
  VALIDATE_COUPON_REQUEST,
  VALIDATE_COUPON_SUCCESS,
  VALIDATE_COUPON_FAILURE,
  CHECK_HAPPY_HOURS_SLOT_REQUEST,
  CHECK_HAPPY_HOURS_SLOT_SUCCESS,
  CHECK_HAPPY_HOURS_SLOT_FAIL,
  HAPPY_HOURS_TABLE_REQUEST,
  HAPPY_HOURS_TABLE_SUCCESS,
  HAPPY_HOURS_TABLE_FAIL,
} from "../constants/constants";

export const filterclubReducer = (
  state = { clubLocationDetails: [] },
  action
) => {
  switch (action.type) {
    case FILTER_CLUB_REQUEST:
      return { ...state, clubFilterLoading: true, clubLocationDetails: [] };

    case FILTER_CLUB_SUCCESS:
      return {
        ...state,
        clubFilterLoading: false,
        clubLocationDetails: action.payload,
      };

    case FILTER_CLUB_FAIL:
      return {
        ...state,
        clubFilterLoading: false,
        clubFilterError: action.payload,
      };

    default:
      return state;
  }
};

export const clubListReducer = (state = { clubs: [] }, action) => {
  switch (action.type) {
    case CLUB_LIST_REQUEST:
      return { ...state, loading: true };

    case CLUB_LIST_SUCCESS:
      return { ...state, loading: false, clubs: action.payload };

    case CLUB_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const clubDetailsReducer = (state = { clubdetails: [] }, action) => {
  switch (action.type) {
    case CLUB_DETAIL_REQUEST:
      return { loading: true, state };

    case CLUB_DETAIL_SUCCESS:
      return { loading: false, clubdetails: action.payload };

    case CLUB_DETAIL_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const clubLocationReducer = (state = { clubLocation: [] }, action) => {
  switch (action.type) {
    case CLUB_LOCATION_REQUEST:
      return { loading: true, state };

    case CLUB_LOCATION_SUCCESS:
      return { loading: false, clubLocation: action.payload };

    case CLUB_LOCATION_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const clubGameReducer = (state = { clubGame: [] }, action) => {
  switch (action.type) {
    case CLUB_GAME_REQUEST:
      return { loading: true, state };

    case CLUB_GAME_SUCCESS:
      return { loading: false, clubGame: action.payload };

    case CLUB_GAME_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const clubAmenityReducer = (state = { clubAmenity: [] }, action) => {
  switch (action.type) {
    case CLUB_AMENITIES_REQUEST:
      return { loading: true, state };

    case CLUB_AMENITIES_SUCCESS:
      return { loading: false, clubAmenity: action.payload };

    case CLUB_AMENITIES_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const clubWorkingReducer = (state = { clubWorking: [] }, action) => {
  switch (action.type) {
    case CLUB_WORKING_REQUEST:
      return { loading: true, state };

    case CLUB_WORKING_SUCCESS:
      return { loading: false, clubWorking: action.payload };

    case CLUB_WORKING_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const clubRulesReducer = (state = { clubRules: [] }, action) => {
  switch (action.type) {
    case CLUB_RULES_REQUEST:
      return { loading: true, state };

    case CLUB_RULES_SUCCESS:
      return { loading: false, clubRules: action.payload };

    case CLUB_RULES_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

 const initialState = {
  isLoading: false,
  coupon: null,
  error: null
};


export const couponReducer = (state = initialState, action) => {
  switch (action.type) {
      case VALIDATE_COUPON_REQUEST:
          return {
              ...state,
              isLoading: true,
              error: null
          };
      case VALIDATE_COUPON_SUCCESS:
          return {
              ...state,
              isLoading: false,
              coupon: action.payload,
              error: null
          };
      case VALIDATE_COUPON_FAILURE:
          return {
              ...state,
              isLoading: false,
              coupon: null,
              error: action.payload.error || action.payload
          };
      default:
          return state;
  }
};

export const clubImageReducer = (state = { clubImage: [] }, action) => {
  switch (action.type) {
    case CLUB_IMAGE_REQUEST:
      return { loading: true, state };

    case CLUB_IMAGE_SUCCESS:
      return { loading: false, clubImage: action.payload };

    case CLUB_IMAGE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const areaListReducer = (state = { areas: [] }, action) => {
  switch (action.type) {
    case AREA_LIST_REQUEST:
      return { ...state, areaLoading: true };

    case AREA_LIST_SUCCESS:
      return { ...state, areaLoading: false, areas: action.payload };

    case AREA_LIST_FAIL:
      return { ...state, areaLoading: false, areaError: action.payload };

    default:
      return state;
  }
};

export const gameListReducer = (state = { games: [] }, action) => {
  switch (action.type) {
    case GAME_LIST_REQUEST:
      return { ...state, gameLoading: true };

    case GAME_LIST_SUCCESS:
      return { ...state, gameLoading: false, games: action.payload };

    case GAME_LIST_FAIL:
      return { ...state, gameLoading: false, gameError: action.payload };

    default:
      return state;
  }
};

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };

    case USER_LOGIN_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload,
        userLoginSuccess: true,
      };

    case USER_LOGIN_FAIL:
      return { loading: false, LoginError: action.payload };

    case USER_LOGIN_RESET:
      return {};

    case USER_LOGOUT:
      return {};

    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { registerUserLoading: true };

    case USER_REGISTER_SUCCESS:
      return { registerUserLoading: false, userinfo: action.payload };

    case USER_REGISTER_FAIL:
      return { registerUserLoading: false, registerError: action.payload };

    case USER_LOGOUT:
      return {};

    default:
      return state;
  }
};

export const bookingCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case BOOKING_CREATE_REQUEST:
      return {
        createBookingLoading: true,
      };

    case BOOKING_CREATE_SUCCESS:
      return {
        createBookingLoading: false,
        success: true,
        booking: action.payload,
      };

    case BOOKING_CREATE_FAIL:
      return {
        createBookingLoading: false,
        createBookingError: action.payload,
      };

    case BOOKING_CREATE_RESET:
      return {};

    default:
      return state;
  }
};

export const bookingDetailsReducer = (
  state = { loading: true, booking: {} },
  action
) => {
  switch (action.type) {
    case BOOKING_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case BOOKING_DETAILS_SUCCESS:
      return {
        loading: false,
        bookingDetails: action.payload,
        bookingDetailsSuccess: true,
      };

    case BOOKING_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case BOOKING_DETAILS_RESET:
      return {};

    default:
      return state;
  }
};

export const bookingListReducer = (state = { bookings: [] }, action) => {
  switch (action.type) {
    case BOOKING_LIST_REQUEST:
      return {
        loading: true,
      };

    case BOOKING_LIST_SUCCESS:
      return {
        loading: false,
        bookings: action.payload,
      };

    case BOOKING_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const courtListReducer = (state = { courts: [] }, action) => {
  switch (action.type) {
    case COURT_LIST_REQUEST:
      return { loading: true };
    case COURT_LIST_SUCCESS:
      return { loading: false, courts: action.payload };
    case COURT_LIST_FAIL:
      return { loading: false, error: action.payload, courts: [] };
    default:
      return state;
  }
};

export const courtDetailsReducer = (state = { court: [] }, action) => {
  switch (action.type) {
    case COURT_DETAILS_REQUEST:
      return { loading: true };
    case COURT_DETAILS_SUCCESS:
      return { loading: false, court: action.payload };
    case COURT_DETAILS_FAIL:
      return { loading: false, error: action.payload, court: [] };
    default:
      return state;
  }
};

export const availableslotsReducer = (state = { slots: [] }, action) => {
  switch (action.type) {
    case AVAILABLE_SLOT_REQUEST:
      return { loading: true };
    case AVAILABLE_SLOT_SUCCESS:
      return { loading: false, slots: action.payload };
    case AVAILABLE_SLOT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const additionalslotsReducer = (state = { additionalSlots: [] }, action) => {
  switch (action.type) {
    case ADDITIONAL_SLOT_REQUEST:
      return { loading: true };
    case ADDITIONAL_SLOT_SUCCESS:
      return { loading: false, additionalSlots: action.payload };
    case ADDITIONAL_SLOT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const unavailableslotsReducer = (state = { unavailableSlots: [] }, action) => {
  switch (action.type) {
    case UNAVAILABLE_SLOT_REQUEST:
      return { loading: true };
    case UNAVAILABLE_SLOT_SUCCESS:
      return { loading: false, unavailableSlots: action.payload };
    case UNAVAILABLE_SLOT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const phoneLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };

    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };

    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };

    case USER_LOGOUT:
      return {};

    default:
      return state;
  }
};

export const slotReducer = (state = { slot: [] }, action) => {
  switch (action.type) {
    case SLOT_REQUEST:
      return { loading: true };
    case SLOT_SUCCESS:
      return { loading: false, slot: action.payload };
    case SLOT_FAIL:
      return { loading: false, error: action.payload, slot: [] };
    default:
      return state;
  }
};

export const userBookingListReducer = (
  state = { userbookings: [] },
  action
) => {
  switch (action.type) {
    case USER_BOOKING_LIST_REQUEST:
      return {
        loading: true,
      };

    case USER_BOOKING_LIST_SUCCESS:
      return {
        loading: false,
        userbookings: action.payload,
      };

    case USER_BOOKING_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const customerDetailsReducer = (
  state = { customerDetails: [] },
  action
) => {
  switch (action.type) {
    case CUSTOMER_DETAILS_REQUEST:
      return { loading: true };
    case CUSTOMER_DETAILS_SUCCESS:
      return { loading: false, customerDetails: action.payload };
    case CUSTOMER_DETAILS_FAIL:
      return { loading: false, error: action.payload, customerDetails: [] };
    default:
      return state;
  }
};

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true };

    case USER_UPDATE_PROFILE_SUCCESS:
      return {
        loading: false,
        userUpdateSuccess: true,
        userInfo: action.payload,
      };

    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, userUpdateError: action.payload };

    case USER_UPDATE_PROFILE_RESET:
      return {};

    default:
      return state;
  }
};

export const generateOtpredeucer = (state = {}, action) => {
  switch (action.type) {
    case GENERATE_OTP_REQUEST:
      return {
        otpLoading: true,
      };

    case GENERATE_OTP_SUCCESS:
      return {
        otpLoading: false,
        otpSuccess: true,
      };

    case GENERATE_OTP_FAIL:
      return {
        otpLoading: false,
        otpSuccess: false,
      };

    default:
      return state;
  }
};

export const cancelBookingreducer = (state = {}, action) => {
  switch (action.type) {
    case BOOKING_CANCEL_REQUEST:
      return {
        cancelBookingLoading: true,
      };

    case BOOKING_CANCEL_SUCCESS:
      return {
        cancelBookingLoading: false,
        cancelBooking: true,
      };

    case BOOKING_CANCEL_FAIL:
      return {
        cancelBookingLoading: false,
        cancelBooking: false,
      };

    default:
      return state;
  }
};

export const resetPasswordreducer = (state = {}, action) => {
  switch (action.type) {
    case RESET_PASSWORD_REQUEST:
      return {
        resetPasswordLoading: true,
      };

    case RESET_PASSWORD_SUCCESS:
      return {
        resetPasswordLoading: false,
        resetPsuccess: true,
      };

    case RESET_PASSWORD_FAIL:
      return {
        resetPasswordLoading: false,
        resetPsuccess: false,
      };

    case RESET_PASSWORD_RESET:
      return {};

    default:
      return state;
  }
};

export const clubReviewCreateReducer = (state = { review: [] }, action) => {
  switch (action.type) {
    case CLUB_CREATE_REVIEW_REQUEST:
      return { loading: true };

    case CLUB_CREATE_REVIEW_SUCCESS:
      return { loading: false, review: action.payload, success: true };

    case CLUB_CREATE_REVIEW_FAIL:
      return { loading: false, error: action.payload };

    case CLUB_CREATE_REVIEW_RESET:
      return {};

    default:
      return state;
  }
};

export const clubreviewlistreducer = (state = { clubReviews: [] }, action) => {
  switch (action.type) {
    case CLUB_REVIEW_REQUEST:
      return { loading: true };
    case CLUB_REVIEW_SUCCESS:
      return { loading: false, clubReviews: action.payload };
    case CLUB_REVIEW_FAIL:
      return { loading: false, error: action.payload, clubReviews: [] };
    default:
      return state;
  }
};

export const searchOrganizationListReducer = (
  state = { filteredClubLocations: [] },
  action
) => {
  switch (action.type) {
    case SEARCH_ORGANIZATIONS_REQUEST:
      return { loadingSearchLocations: true, filteredClubLocations: [] };
    case SEARCH_ORGANIZATIONS_SUCCESS:
      return { loadingSearchLocations: false, filteredClubLocations: action.payload, searchSuccess: true };
    case SEARCH_ORGANIZATIONS_FAIL:
      return { loadingSearchLocations: false, error: action.payload };
    default:
      return state;
  }
};

export const RecentSearchReducer = (state = { filteredData: [] }, action) => {
  switch (action.type) {
    case RECENT_SEARCH_REQUEST:
      return { loadingSearchClubs: true, filteredData: [] };
    case RECENT_SEARCH_SUCCESS:
      return { loadingSearchClubs: false, filteredData: action.payload };
    case RECENT_SEARCH_FAIL:
      return { loadingSearchClubs: false, error: action.payload };
    default:
      return state;
  }
};

export const suggestedClubListReducer = (
  state = { suggestedClubList: [] },
  action
) => {
  switch (action.type) {
    case SUGGESTED_CLUB_REQUEST:
      return { loadingSuggestedClub: true, suggestedClubList: [] };
    case SUGGESTED_CLUB_SUCCESS:
      return { loadingSuggestedClub: false, suggestedClubList: action.payload };
    case SUGGESTED_CLUB_FAIL:
      return { loadingSuggestedClub: false, suggestedClubListerror: action.payload };
    default:
      return state;
  }
};

export const suggestedClubGameListReducer = (
  state = { suggestedClubGameList: [] },
  action
) => {
  switch (action.type) {
    case SUGGESTED_CLUBGAME_REQUEST:
      return { loadingSuggestedClubGame: true, suggestedClubGameList: [] };
    case SUGGESTED_CLUBGAME_SUCCESS:
      return { loadingSuggestedClubGame: false, suggestedClubGameList: action.payload };
    case SUGGESTED_CLUBGAME_FAIL:
      return { loadingSuggestedClubGame: false, error: action.payload };
    default:
      return state;
  }
};

export const validateUserReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_VALIDATE_REQUEST:
      return { loading: true };
    case USER_VALIDATE_SUCCESS:
      return { loading: false, userValidate: true };
    case USER_VALIDATE_FAIL:
      return { loading: false, userValidateError: true };
    case USER_VALIDATE_RESET:
      return { };
    default:
      return state;
  }
};

export const validateUserDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case USERDETAILS_VALIDATE_REQUEST:
      return { loading: true };
    case USERDETAILS_VALIDATE_SUCCESS:
      return { loading: false, userDetailsValidate: action.payload };
    case USERDETAILS_VALIDATE_FAIL:
      return { loading: false, userDetailsValidateError: action.payload };
    case USERDETAILS_VALIDATE_RESET:
      return { };
    default:
      return state;
  }
};

export const validatePhoneReducer = (state = {}, action) => {
  switch (action.type) {
    case PHONE_VALIDATE_REQUEST:
      return { loading: true };
    case PHONE_VALIDATE_SUCCESS:
      return { loading: false, phoneValidate: true };
    case PHONE_VALIDATE_FAIL:
      return { loading: false, phoneValidateError: true };
    case PHONE_VALIDATE_RESET:
      return { };
    default:
      return state;
  }
};

export const topRatedClubsReducer = (state = {}, action) => {
  switch (action.type) {
    case TOPRATED_CLUBS_REQUEST:
      return { loadingTopRatedClubs: true };
    case TOPRATED_CLUBS_SUCCESS:
      return { loadingTopRatedClubs: false, topRatedClubs: action.payload }
    case TOPRATED_CLUBS_FAIL:
      return { loadingTopRatedClubs: false, errorTopRatedClubs: action.payload }
    case TOPRATED_CLUBS_RESET:
      return { };
    default:
      return state;
  }
}

export const nearestSlotReducer = (state = { nearestSlot: [] }, action) => {
  switch (action.type) {
    case NEAREST_SLOT_REQUEST:
      return { loading: true };
    case NEAREST_SLOT_SUCCESS:
      return { loading: false, nearestSlot: action.payload };
    case NEAREST_SLOT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const happyHoursReducer = (state = { isHappyHours: false, price: 0 }, action) => {
  switch (action.type) {
    case CHECK_HAPPY_HOURS_SLOT_REQUEST:
      return { ...state, loading: true };
    case CHECK_HAPPY_HOURS_SLOT_SUCCESS:
      return {
        ...state,
        loading: false,
        isHappyHours: action.payload.isHappyHours,
        price: action.payload.price || 0,
      };
    case CHECK_HAPPY_HOURS_SLOT_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const happyHoursTableReducer = (state = { happyHoursTable: [] }, action) => {
  switch (action.type) {
    case HAPPY_HOURS_TABLE_REQUEST:
      return { loading: true };
    case HAPPY_HOURS_TABLE_SUCCESS:
      return { loading: false, happyHoursTable: action.payload };
    case HAPPY_HOURS_TABLE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
