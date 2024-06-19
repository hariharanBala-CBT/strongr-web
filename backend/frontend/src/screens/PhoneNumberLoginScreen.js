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
import { LinkContainer } from "react-router-bootstrap";
import "../css/registerscreen.css";
import { User, Eye, EyeOff, Phone } from "react-feather";

const linkStyle = {
  textDecoration: "underline",
  color: "purple",
  cursor: "pointer",
};

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
        console.log("otp error is : ", error);
        // setLoading(false);
        // setTimeout(()=>{
        //   toast.error("OTP not Sent");
        // },5000)
      });
  }

  const dispatchLogin = () => {
    dispatch(loginPhoneNumber(ph));
    setTimeout(() => {
      if (error) {
        toast.error("User not registered");
      }
    }, 1000);
  };

  function onOTPVerify(e) {
    e.preventDefault();
    setOTP("");
    setShowOTPInput(false);
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setLoading(false);
        dispatchLogin();
      })
      .catch((err) => {
        showOTPInput(false);
        console.log(err);
        toast.error("Incorrect OTP. Please try again.");
        setLoading(false);
      });
  }

  return (
    <div className="phonelogin-wrapper">
      {/* <Header location="nav-all" /> */}
      <div className="main-wrapper authendication-pages">
        <div className="content blur-ellipses">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-lg-6 mx-auto vph-100 d-flex align-items-center phone-login">
                <div className="forgot-password w-100">
                  <div className="shadow-card">
                    <h2>Login</h2>
                    <p>Enter Registered Phone Number</p>

                    <form>
                      <div className="form-group">
                        <div className="group-img">
                          <i className="feather-mail"></i>
                          <PhoneInput
                            required
                            country={"in"}
                            placeholder="Enter phone number"
                            value={ph}
                            onChange={setPh}
                          />
                        </div>
                      </div>
                      {showOTPInput && (
                        <div className="form-group">
                          <OTPInput
                            className="otp-input-field"
                            value={otp}
                            onChange={setOTP}
                            numInputs={6}
                            otpType="number"
                            autoFocus
                            renderInput={renderInput}
                          />
                        </div>
                      )}
                      {loading && <CircularProgress className="loader" />}
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
                  </div>
                  <div className="bottom-text text-center">
                    <p>
                      Login through username &nbsp;
                      <LinkContainer
                        to="/login"
                        style={{
                          textDecoration: "underline",
                          color: "white",
                        }}
                      >
                        <span>login</span>
                      </LinkContainer>
                    </p>
                  </div>
                  <div className="bottom-text text-center">
                    <p>
                      Login through username &nbsp;
                      <LinkContainer
                        to="/signup"
                        style={{
                          textDecoration: "underline",
                          color: "white",
                        }}
                      >
                        <span>signup</span>
                      </LinkContainer>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneNumberScreen;
