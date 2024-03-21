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
} from "./reducers/reducers";

const reducer = combineReducers({
  clubList: clubListReducer,
  clubDetails: clubDetailsReducer,
  Location: clubLocationReducer,
  clubGame: clubGameReducer,
  clubAmenities: clubAmenityReducer,
  clubWorking: clubWorkingReducer,
  clubImages: clubImageReducer,
  areaList: areaListReducer,
  gameList: gameListReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  filterClubLocations: filterclubReducer,
  bookingCreate: bookingCreateReducer,
  bookingDetails: bookingDetailsReducer,
  bookingList: bookingListReducer,
  courtList: courtListReducer,
  slot: slotReducer,
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
