import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

import {
  clubListReducer,
  areaListReducer,
  gameListReducer,
  userLoginReducer,
  userRegisterReducer,
  filterclubReducer,
  clubDetailsReducer,
  clubLocationReducer,
  clubGameReducer,
  clubAmenityReducer,
  clubWorkingReducer,
  clubImageReducer,
  bookingCreateReducer,
  bookingDetailsReducer,
  bookingListReducer,
  courtListReducer,
  slotReducer,
  courtDetailsReducer,
  availableslotsReducer,
  userBookingListReducer,
  customerDetailsReducer,
  userUpdateProfileReducer,
  generateOtpredeucer,
  cancelBookingreducer,
  resetPasswordreducer,
  clubreviewlistreducer,
  clubReviewCreateReducer,
  phoneLoginReducer,
  searchOrganizationListReducer,
  RecentSearchReducer,
  suggestedClubListReducer,
  suggestedClubGameListReducer,
  validateUserReducer,
  additionalslotsReducer,
  unavailableslotsReducer,
  validatePhoneReducer,
  validateUserDetailsReducer,
  topRatedClubsReducer,
  nearestSlotReducer,
} from "./reducers/reducers";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  clubList: clubListReducer,
  clubDetails: clubDetailsReducer,
  Location: clubLocationReducer,
  clubGame: clubGameReducer,
  clubAmenities: clubAmenityReducer,
  clubWorking: clubWorkingReducer,
  clubImages: clubImageReducer,
  areaList: areaListReducer,
  gameList: gameListReducer,
  filterClubLocations: filterclubReducer,
  bookingCreate: bookingCreateReducer,
  bookingDetails: bookingDetailsReducer,
  bookingList: bookingListReducer,
  userBookingsList: userBookingListReducer,
  courtList: courtListReducer,
  court: courtDetailsReducer,
  slot: availableslotsReducer,
  additionalSlot: additionalslotsReducer,
  unavailableSlot: unavailableslotsReducer,
  slotDetails: slotReducer,
  customerDetails: customerDetailsReducer,
  userUpdate: userUpdateProfileReducer,
  generateOtp: generateOtpredeucer,
  cancelBooking: cancelBookingreducer,
  resetUserPassword: resetPasswordreducer,
  clubReviews: clubreviewlistreducer,
  clubReviewCreate: clubReviewCreateReducer,
  otp: phoneLoginReducer,
  listOrganizations:searchOrganizationListReducer,
  RecentSearch:RecentSearchReducer,
  suggestedClubs: suggestedClubListReducer,
  suggestedClubsGame : suggestedClubGameListReducer,
  userValidator : validateUserReducer,
  userDetailsValidator : validateUserDetailsReducer,
  phoneValidator : validatePhoneReducer,
  topRatedClubs: topRatedClubsReducer,
  nearestSlot: nearestSlotReducer
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  (applyMiddleware(...middleware)),
);

export default store;