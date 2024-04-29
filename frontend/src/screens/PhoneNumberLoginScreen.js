import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginPhoneNumber } from "../actions/actions";
// import Loader from "../components/Loader";
// import Message from "../components/Message";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../css/phonenumscreen.css";
import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import OTPInput from "react-otp-input";
import { CircularProgress } from "@mui/material";

function PhoneNumberScreen() {
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ph, setPh] = useState("");

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  // const handleGenerateOTP = (e) => {
  //   e.preventDefault();
  //   if (!ph) {
  //     alert("Please enter a phone number!");
  //     return;
  //   }
  //   setPhoneNumber(ph);
  //   dispatch(fetchOTP(ph));
  //   setShowOTPInput(true);
  //   onCaptchVerify();
  // };

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   if (!otp) {
  //     alert("Please enter the OTP!");
  //     return;
  //   }
  //   dispatch(login(phoneNumber, otp));
  // };

  const renderInput = (inputProps) => {
    return (
      <input
        {...inputProps}
        className="otp-input-field"
        autoComplete="o"
        maxLength={1}
      />
    );
  };

  function onCaptchVerify() {
    if (!window.RecaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
          auth,
        }
      );
    }
  }

  function onSignup(e) {
    e.preventDefault();
    if (ph.length < 10) {
      alert("Please enter a phone number!");
      return;
    }
    setLoading(true);
    onCaptchVerify();
    // setShowOTPInput(true);
    const appVerifier = window.recaptchaVerifier;  
    const formatPh = "+" + ph;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success("OTP Sent Successfully");
        setLoading(false);
        setShowOTPInput(true);
      })
      .catch((error) => {
        console.log("otp error is : ",error);
        // setLoading(false);
        // setTimeout(()=>{
        //   toast.error("OTP not Sent");
        // },5000)
      });
  }

  const dispatchLogin = () => {
    dispatch(loginPhoneNumber(ph))
    setTimeout(() => {
      if(error){
        toast.error('User not registered');
      }
    },1000)

  };
  

function onOTPVerify(e) {
  e.preventDefault();
  setOTP('');
  setShowOTPInput(false)
  setLoading(true);
  window.confirmationResult
    .confirm(otp)
    .then(async (res) => {
      console.log(res);
      setLoading(false);
      dispatchLogin();
    })
    .catch((err) => {
      showOTPInput(false)
      console.log(err);
      toast.error("Incorrect OTP. Please try again.");
      setLoading(false);
    });
}


  return (
    <div>
      <Header location="nav-all" />
      <div className="logins-page">
        <div className="logins-form">
          <Toaster toastOptions={{ duration: 4000 }} />
          <div id="recaptcha-container"></div>
          <h1 className="login-title">LOGIN</h1>
          {/* {error && <Message variant="danger">{error}</Message>}
          {(loading || loginLoading) && <Loader />} */}
          <form>
            <label>Phone Number</label>
            <PhoneInput
              required
              country={"in"}
              placeholder="Enter phone number"
              value={ph}
              onChange={setPh}
            />
            {showOTPInput && (
              <div className="OTP">
                <label>Enter OTP</label>
                <OTPInput
                  className='otp-input-field'
                  value={otp}
                  onChange={setOTP}
                  numInputs={6}
                  otpType="number"
                  autoFocus
                  // isInputNum
                  // separator={<span>-</span>}
                  renderInput={renderInput}
                />
              </div>
            )}

            {loading && <CircularProgress className="loader"/>}
            {!showOTPInput && (
              <button className="generate-btn" onClick={onSignup}>
                Generate OTP
              </button>
            )}
            {showOTPInput && (
              <button className="login-btn" onClick={onOTPVerify}>
                Login
              </button>
            )}
          </form>
          <span>
            Login through username &nbsp;
            <a href="/login">Login</a>
          </span>
          <span>
            Don't have an Account?&nbsp;
            <a href="/signup">SignUp</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default PhoneNumberScreen;