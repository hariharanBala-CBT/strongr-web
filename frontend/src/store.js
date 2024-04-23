import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
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
} from "./reducers/reducers";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  clubList: clubListReducer,
  clubDetails: clubDetailsReducer,
  Location: clubLocationReducer,
  clubGame: clubGameReducer,
  clubAmenities: clubAmenityReducer,
  clubWorking: clubWorkingReducer,
  clubImages: clubImageReducer,
  areaList: areaListReducer,
  gameList: gameListReducer,
  userRegister: userRegisterReducer,
  filterClubLocations: filterclubReducer,
  bookingCreate: bookingCreateReducer,
  bookingDetails: bookingDetailsReducer,
  bookingList: bookingListReducer,
  userBookingsList: userBookingListReducer,
  courtList: courtListReducer,
  court: courtDetailsReducer,
  slot: availableslotsReducer,
  slotDetails: slotReducer,
  customerDetails: customerDetailsReducer,
  userUpdate: userUpdateProfileReducer,
  generateOtp: generateOtpredeucer,
  cancelBooking: cancelBookingreducer,
  resetUserPassword: resetPasswordreducer,
  clubReviews: clubreviewlistreducer,
  clubReviewCreate: clubReviewCreateReducer,
  otp: phoneLoginReducer,
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
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
