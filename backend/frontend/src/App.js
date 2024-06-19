import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ClubListScreen from "./screens/ClubListScreen";
import LoginScreen from "./screens/LoginScreen";
import ClubDetailScreen from "./screens/ClubDetailScreen";
import BookingInfoScreen from "./screens/BookingInfoScreen";
import BookingScreen from "./screens/BookingScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UpdateprofileScreen from './screens/UpdateProfileScreen'
import ProfileScreen from "./screens/ProfileScreen";
import UpdatePassword from './screens/UpdatePassword';
import PhoneNumberLoginScreen from './screens/PhoneNumberLoginScreen';
import { HomeProvider } from "./context/HomeContext";
import ClubSearchScreen from "./screens/ClubSearchScreen";
import ErrorScreen from "./screens/ErrorScreen";


function App() {
  return (
    <Router>
      <main>
        <HomeProvider>
          {/* <Container> */}
            <Routes>
              <Route path="/error/" element={<ErrorScreen />} />

              <Route path="/" element={<HomeScreen />} />
              <Route path="/clubs/" element={<ClubListScreen />} />
              <Route path="/clubsearch/" element={<ClubSearchScreen/>} />
              <Route path="/login/" element={<LoginScreen />} />
              <Route path="/updatepassword/" element={<UpdatePassword />} />
              <Route path="/phonenumberlogin/" element={<PhoneNumberLoginScreen />} />
              <Route path="/signup/" element={<RegisterScreen />} />
              <Route path="/checkout/" element={<CheckoutScreen />} />
              <Route path="/profile/" element={<ProfileScreen />} />
              <Route path="/updatepassword/" element={<UpdatePassword />} />
              <Route path="/profile/:id" element={<UpdateprofileScreen />} />
              <Route path="/club/:id" element={<ClubDetailScreen />} />
              <Route path="/bookinginfo/:id" element={<BookingInfoScreen />} />
              <Route path="/booking/:id" element={<BookingScreen />} />
            </Routes>
        </HomeProvider>
      </main>
    </Router>
  );
}

export default App;
