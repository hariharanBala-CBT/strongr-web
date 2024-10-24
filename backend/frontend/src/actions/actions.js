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
  AREA_LIST_REQUEST,
  AREA_LIST_SUCCESS,
  AREA_LIST_FAIL,
  GAME_LIST_REQUEST,
  GAME_LIST_SUCCESS,
  GAME_LIST_FAIL,
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
  USER_BOOKING_LIST_REQUEST,
  USER_BOOKING_LIST_SUCCESS,
  USER_BOOKING_LIST_FAIL,
  CUSTOMER_DETAILS_REQUEST,
  CUSTOMER_DETAILS_SUCCESS,
  CUSTOMER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  GENERATE_OTP_REQUEST,
  GENERATE_OTP_SUCCESS,
  GENERATE_OTP_FAIL,
  BOOKING_CANCEL_REQUEST,
  BOOKING_CANCEL_SUCCESS,
  BOOKING_CANCEL_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  CLUB_CREATE_REVIEW_REQUEST,
  CLUB_CREATE_REVIEW_SUCCESS,
  CLUB_CREATE_REVIEW_FAIL,
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
  ADDITIONAL_SLOT_REQUEST,
  ADDITIONAL_SLOT_SUCCESS,
  ADDITIONAL_SLOT_FAIL,
  UNAVAILABLE_SLOT_REQUEST,
  UNAVAILABLE_SLOT_SUCCESS,
  UNAVAILABLE_SLOT_FAIL,
  PHONE_VALIDATE_REQUEST,
  PHONE_VALIDATE_SUCCESS,
  PHONE_VALIDATE_FAIL,
  USERDETAILS_VALIDATE_REQUEST,
  USERDETAILS_VALIDATE_SUCCESS,
  USERDETAILS_VALIDATE_FAIL,
  TOPRATED_CLUBS_REQUEST,
  TOPRATED_CLUBS_SUCCESS,
  TOPRATED_CLUBS_FAIL,
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
import axios from "axios";

export const filterLocation = (areaName, gameName, date, amenities) => async (dispatch) => {
  try {
      dispatch({ type: FILTER_CLUB_REQUEST });

      const amenitiesArray = amenities.map(amenity => amenity.value);

      const { data } = await axios.get("/api/filterclubs/", {
          params: {
              area: areaName,
              game: gameName,
              date: date,
              amenities: amenitiesArray,
          },
      });

      dispatch({
          type: FILTER_CLUB_SUCCESS,
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: FILTER_CLUB_FAIL,
          payload:
              error.response && error.response.data.detail
                  ? error.response.data.detail
                  : error.message,
      });
  }
};


export const listClubs = () => async (dispatch) => {
  try {
    dispatch({ type: CLUB_LIST_REQUEST });

    const { data } = await axios.get("/api/clubs/");

    dispatch({
      type: CLUB_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CLUB_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listclubDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: CLUB_DETAIL_REQUEST });

    const { data } = await axios.get(`/api/${id}`);

    dispatch({
      type: CLUB_DETAIL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CLUB_DETAIL_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listclubLocation = (id) => async (dispatch) => {
  try {
    dispatch({ type: CLUB_LOCATION_REQUEST });

    const { data } = await axios.get(`/api/clublocation/${id}`);

    dispatch({
      type: CLUB_LOCATION_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CLUB_LOCATION_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listclubGame = (id) => async (dispatch) => {
  try {
    dispatch({ type: CLUB_GAME_REQUEST });

    const { data } = await axios.get(`/api/clubgame/${id}`);

    dispatch({
      type: CLUB_GAME_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CLUB_GAME_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listclubAmenities = (id) => async (dispatch) => {
  try {
    dispatch({ type: CLUB_AMENITIES_REQUEST });

    const { data } = await axios.get(`/api/clubamenities/${id}`);

    dispatch({
      type: CLUB_AMENITIES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CLUB_AMENITIES_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listclubWorking = (id) => async (dispatch) => {
  try {
    dispatch({ type: CLUB_WORKING_REQUEST });

    const { data } = await axios.get(`/api/clubworking/${id}`);

    dispatch({
      type: CLUB_WORKING_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CLUB_WORKING_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listclubRules = (id) => async (dispatch) => {
  try {
    dispatch({ type: CLUB_RULES_REQUEST });

    const { data } = await axios.get(`/api/clubrules/${id}`);

    dispatch({
      type: CLUB_RULES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CLUB_RULES_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listClubImages = (id) => async (dispatch) => {
  try {
    dispatch({ type: CLUB_IMAGE_REQUEST });

    const { data } = await axios.get(`/api/clubimages/${id}`);

    dispatch({
      type: CLUB_IMAGE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CLUB_IMAGE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listAreas = () => async (dispatch) => {
  try {
    dispatch({ type: AREA_LIST_REQUEST });

    const { data } = await axios.get("/api/areas/");

    dispatch({
      type: AREA_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: AREA_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listGames = () => async (dispatch) => {
  try {
    dispatch({ type: GAME_LIST_REQUEST });

    const { data } = await axios.get("/api/games/");

    dispatch({
      type: GAME_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GAME_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const login = (username, password, phoneNumber) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/login/",
      { username: username, password: password, phoneNumber: phoneNumber },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
};

export const register =
  (email, name, otp, password, phoneNumber) => async (dispatch) => {
    try {
      dispatch({
        type: USER_REGISTER_REQUEST,
      });

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/register/",
        {
          email: email,
          name: name,
          otp: otp,
          password: password,
          phone: phoneNumber,
        },
        config
      );

      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      });

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const createBooking = (booking) => async (dispatch, getState) => {
  try {
    dispatch({ type: BOOKING_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/booking/create/`, booking, config);

    dispatch({
      type: BOOKING_CREATE_SUCCESS,
      payload: data,
    });
    localStorage.removeItem('appliedCoupon');
  } catch (error) {
    dispatch({
      type: BOOKING_CREATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getBookingDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: BOOKING_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/booking/details/${id}/`, config);

    dispatch({
      type: BOOKING_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BOOKING_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listBookings = () => async (dispatch, getState) => {
  try {
    dispatch({ type: BOOKING_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/bookings/mybookings/", config);

    dispatch({
      type: BOOKING_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BOOKING_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listUserBookings = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_BOOKING_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/userbookings/${id}/`, config);

    dispatch({
      type: USER_BOOKING_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_BOOKING_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listCourts = (id, gameName) => async (dispatch) => {
  try {
    dispatch({ type: COURT_LIST_REQUEST });

    const { data } = await axios.get(`/api/courts/${id}/`, {
      params: { game: gameName },
    });

    dispatch({
      type: COURT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COURT_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getCourt = (id) => async (dispatch) => {
  try {
    dispatch({ type: COURT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/court/${id}/`);

    dispatch({
      type: COURT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COURT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const fetchAvailableSlots = (courtId, date) => async (dispatch) => {
  try {
    dispatch({ type: AVAILABLE_SLOT_REQUEST });

    const { data } = await axios.get(`/api/slots/`, {
      params: { courtId: courtId, date: date },
    });

    dispatch({
      type: AVAILABLE_SLOT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);

    dispatch({
      type: AVAILABLE_SLOT_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const fetchAdditionalSlots = (courtId, date) => async (dispatch) => {
  try {
    dispatch({ type: ADDITIONAL_SLOT_REQUEST });

    const { data } = await axios.get(`/api/slots/additional/`, {
      params: { courtId: courtId, date: date },
    });

    dispatch({
      type: ADDITIONAL_SLOT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Error fetching additonal slots:", error);

    dispatch({
      type: ADDITIONAL_SLOT_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const fetchUnAvailableSlots = (courtId, date) => async (dispatch) => {
  try {
    dispatch({ type: UNAVAILABLE_SLOT_REQUEST });

    const { data } = await axios.get(`/api/slots/unavailable/`, {
      params: { courtId: courtId, date: date },
    });

    dispatch({
      type: UNAVAILABLE_SLOT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Error fetching unavailable slots:", error);

    dispatch({
      type: UNAVAILABLE_SLOT_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listOrganizations = (keyword) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_ORGANIZATIONS_REQUEST });

    const { data } = await axios.get("/api/search/", {
      params: { keyword: keyword },
    });


    dispatch({
      type: SEARCH_ORGANIZATIONS_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: SEARCH_ORGANIZATIONS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getSlotDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: SLOT_REQUEST });

    const { data } = await axios.get(`/api/slot/${id}`);

    dispatch({
      type: SLOT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);

    dispatch({
      type: SLOT_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listcustomerDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: CUSTOMER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/customer/${id}`);

    dispatch({
      type: CUSTOMER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CUSTOMER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token} `,
      },
    };

    const { data } = await axios.put(`/api/profile/update/`, user, config);

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const resetUserPassword = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: RESET_PASSWORD_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token} `,
      },
    };

    const { data } = await axios.put(
      `/api/resetpassword/`,
      user,
      config
    );

    dispatch({
      type: RESET_PASSWORD_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));

  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};


export const generateOTP = (email) => async (dispatch) => {
  try {
    dispatch({ type: GENERATE_OTP_REQUEST });

    const { data } = await axios.get(`/sendotp/`, {
      params: { email: email},
    });

    dispatch({
      type: GENERATE_OTP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GENERATE_OTP_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const generateUpdateOTP = (email, id) => async (dispatch) => {
  try {
    dispatch({ type: GENERATE_OTP_REQUEST });

    const { data } = await axios.get(`/sendotp/update/`, {
      params: { email: email, id: id },
    });

    dispatch({
      type: GENERATE_OTP_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GENERATE_OTP_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const bookingCancel = (id) => async (dispatch) => {
  try {
    dispatch({ type: BOOKING_CANCEL_REQUEST });

    const { data } = await axios.put(`/api/booking/cancel/${id}/`);

    dispatch({
      type: BOOKING_CANCEL_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BOOKING_CANCEL_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const createClubReview = (id, review) => async (dispatch, getState) => {
  try {
      dispatch({
          type: CLUB_CREATE_REVIEW_REQUEST
      })

      const {
          userLogin: { userInfo },
      } = getState()

      const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`
          }
      }

      const { data } = await axios.post(
          `/api/club/reviews/${id}`,
          review,
          config
      )
      dispatch({
          type: CLUB_CREATE_REVIEW_SUCCESS,
          payload: data,
      })



  } catch (error) {
      dispatch({
          type: CLUB_CREATE_REVIEW_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      })
  }
}

export const listClubReviews = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CLUB_REVIEW_REQUEST });

    const { data } = await axios.get(`/api/club/reviewslist/${id}/`);

    dispatch({
      type: CLUB_REVIEW_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CLUB_REVIEW_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};


export const loginPhoneNumber = (phoneNumber) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/login/phone/",
      { phone_number: phoneNumber },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const RecentSearch = (storedKeywords) => async (dispatch) => {
  try {
    dispatch({ type: RECENT_SEARCH_REQUEST });

    const { data } = await axios.get("/api/recentsearch/", {
      params: {
        storedKeywords: storedKeywords,
      },
    });

    dispatch({
      type: RECENT_SEARCH_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: RECENT_SEARCH_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};

export const listSuggestedClub = (areaName) => async (dispatch) => {
  try {
    dispatch({ type: SUGGESTED_CLUB_REQUEST });

    const { data } = await axios.get("/api/club/suggested/", {
      params: {
        area: areaName,
       },
    });


    dispatch({
      type: SUGGESTED_CLUB_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: SUGGESTED_CLUB_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listSuggestedClubGame = (gameName) => async (dispatch) => {
  try {
    dispatch({ type: SUGGESTED_CLUBGAME_REQUEST });

    const { data } = await axios.get("/api/club/suggestedgame/", {
      params: {
        game: gameName,
       },
    });


    dispatch({
      type: SUGGESTED_CLUBGAME_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: SUGGESTED_CLUBGAME_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const validateUser = (username) => async (dispatch) => {
  try {
    dispatch({ type: USER_VALIDATE_REQUEST });

    const { data } = await axios.get("/api/username/validate/", {
      params: {
        username: username,
       },
    });


    dispatch({
      type: USER_VALIDATE_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: USER_VALIDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const validateUserDetails = (email, phone) => async (dispatch) => {
  try {
    dispatch({ type: USERDETAILS_VALIDATE_REQUEST });

    const { data } = await axios.get("/api/userdetails/validate/", {
      params: {
        email: email,
        phone: phone,
       },
    });


    dispatch({
      type: USERDETAILS_VALIDATE_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: USERDETAILS_VALIDATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.detail,
    });
  }
};

export const validatePhone = (phone) => async (dispatch) => {
  try {
    dispatch({ type: PHONE_VALIDATE_REQUEST });

    const { data } = await axios.get("/api/phone/validate/", {
      params: {
        phone: phone,
       },
    });

    dispatch({
      type: PHONE_VALIDATE_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: PHONE_VALIDATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getTopRatedClubs = () => async (dispatch) => {
  try {
    dispatch({ type: TOPRATED_CLUBS_REQUEST });

    const { data } = await axios.get("/api/clubs/rated/");

    dispatch({ type: TOPRATED_CLUBS_SUCCESS, payload: data });

  } catch (error) {

    dispatch({
      type: TOPRATED_CLUBS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getNearestSlot = (courtId, date) => async (dispatch) => {
  try {
    dispatch({ type: NEAREST_SLOT_REQUEST });

    const { data } = await axios.get(`/api/slots/nearest/`, {
      params: { courtId: courtId, date: date },
    });

    dispatch({
      type: NEAREST_SLOT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);

    dispatch({
      type: NEAREST_SLOT_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const validateCoupon = (organizationId, code) => async (dispatch) => {
  try {
    dispatch({ type: VALIDATE_COUPON_REQUEST });

    const { data } = await axios.get(`/api/coupon/${organizationId}/`, {
      params: { code: code },
    });

    dispatch({
      type: VALIDATE_COUPON_SUCCESS,
      payload: data,
    });

    return { success: true, data };  // Return success and data
  } catch (error) {
    console.error("Error validating coupon:", error);

    const errorMsg = error.response && error.response.data && error.response.data.error
      ? error.response.data.error
      : error.message;

    dispatch({
      type: VALIDATE_COUPON_FAILURE,
      payload: errorMsg,
    });

    return { success: false, error: errorMsg };  // Return failure and error
  }
};

export const checkHappyHoursSlot = (slotId) => async (dispatch) => {
  try {
    dispatch({ type: CHECK_HAPPY_HOURS_SLOT_REQUEST });

    // const { data } = await axios.get(`/api/check-happy-hour/`, { params: { slotId }, });
    const { data } = await axios.get(`/api/check-happy-hour/${slotId}/`);

    dispatch({
      type: CHECK_HAPPY_HOURS_SLOT_SUCCESS,
      payload: {
        isHappyHours: data.isHappyHours,
        price: data.price,  // Ensure price is returned in the response
      },
    });
  } catch (error) {
    dispatch({
      type: CHECK_HAPPY_HOURS_SLOT_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};

export const getHappyHoursTable = (organizationLocationId) => async (dispatch) => {
  try {
    dispatch({ type: HAPPY_HOURS_TABLE_REQUEST });

    const { data } = await axios.get(`/api/clubhappyhours/${organizationLocationId}/`);

    dispatch({
      type: HAPPY_HOURS_TABLE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: HAPPY_HOURS_TABLE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
