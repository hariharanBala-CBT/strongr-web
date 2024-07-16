import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { LinkContainer } from "react-router-bootstrap";
import PhoneInput from "react-phone-input-2";
import OTPInput from "react-otp-input";
import "react-phone-input-2/lib/style.css";

import { CircularProgress } from "@mui/material";

import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { loginPhoneNumber, validatePhone } from "../actions/actions";
import logoImage from "../images/logo-color.png";
import "../css/phonenumscreen.css";

function PhoneNumberScreen() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOTP] = useState("");
  const [ph, setPh] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [otpTimestamp, setOtpTimestamp] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const { userInfo } = useSelector((state) => state.userLogin);
  const { phoneValidate, phoneValidateError } = useSelector(
    (state) => state.phoneValidator
  );

  const dispatchLogin = () => {
    dispatch(loginPhoneNumber(ph));
  };

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

  const handlePhoneNumberChange = () => {
    setOTP("");
    setShowOTPInput(false);
    setLoading(false);
    setSubmit(false);
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
    setSubmit(true);
    if (ph.length < 10) {
      toast.error("Please enter a phone number!");
      return;
    }
    setLoading(true);
    dispatch(validatePhone(ph));
  }

  function onOTPVerify(e) {
    e.preventDefault();
    setLoading(true);

    // Check if OTP has expired (2 minutes)
    const currentTime = Date.now();
    if (currentTime - otpTimestamp > 2 * 60 * 1000) {
      toast.error("OTP has expired. Please request a new one.");
      setLoading(false);
      setShowOTPInput(false);
      return;
    }

    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setLoading(false);
        dispatchLogin();
      })
      .catch((err) => {
        setShowOTPInput(false);
        console.log(err);
        toast.error("Incorrect OTP. Please try again.");
        setLoading(false);
      });
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    if (phoneValidateError && submit) {
      setSubmit(false);
      setLoading(false);
      toast.error("User does not exist.");
    } else if (phoneValidate && submit) {
      setSubmit(false);
      onCaptchVerify();
      const appVerifier = window.recaptchaVerifier;
      const formatPh = "+" + ph;
      signInWithPhoneNumber(auth, formatPh, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setOtpTimestamp(Date.now()); // Store the OTP timestamp
          setTimeLeft(120); // Reset the timer to 2 minutes
          toast.success("OTP Sent Successfully");
          setShowOTPInput(true);
        })
        .catch((error) => {
          console.log("OTP error:", error);
          toast.error("Failed to send OTP. Please refresh page and try again.");
          setTimeout(() => {
            window.location.reload();
          }, 500);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [ph, phoneValidate, phoneValidateError, submit]);

  useEffect(() => {
    if (showOTPInput && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showOTPInput, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="phonelogin-wrapper">
      <Toaster />
      <div className="main-wrapper authendication-pages">
        <div className="register-content">
          <div className="container wrapper no-padding">
            <div className="row no-margin vph-100">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 no-padding toppage-container">
                <div className="banner-bg phone-login">
                  <div className="row no-margin h-100">
                    <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                      <div className="h-100 d-flex justify-content-center align-items-center">
                        <div className="text-bg register text-center image-color-wrapper">
                          <button
                            type="button"
                            className="btn btn-limegreen text-capitalize"
                          >
                            <i className="fa-solid fa-thumbs-up me-3"></i>Login
                            User
                          </button>
                          <p>
                            Log in right away for our advanced sports software
                            solutions, created to address issues in regular
                            sporting events and activities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 no-padding">
                <div className="dull-pg">
                  <div className="row no-margin vph-100 d-flex align-items-center justify-content-center phone-login-right-banner">
                    <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                      <header className="text-center">
                        <LinkContainer to="/">
                          <a href="#">
                            <img
                              src={logoImage}
                              className="img-fluid"
                              alt="Logo"
                            />
                          </a>
                        </LinkContainer>
                      </header>
                      <div className="shadow-card">
                        <div id="recaptcha-container"></div>
                        <h2 className="login-title">
                          Get Started With Strongr
                        </h2>
                        <form>
                          <label className="phone-textp">
                            Enter Registered Phone Number
                          </label>
                          <PhoneInput
                            required
                            country={"in"}
                            placeholder="Enter phone number"
                            value={ph}
                            onChange={(value) => {
                              handlePhoneNumberChange();
                              setPh(value);
                            }}
                          />
                          {showOTPInput && (
                            <div className="OTP">
                              <label>Enter OTP</label>
                              <OTPInput
                                className="otp-input-field"
                                value={otp}
                                onChange={setOTP}
                                numInputs={6}
                                otpType="number"
                                autoFocus
                                renderInput={renderInput}
                              />
                              <div className="otp-timer">
                                OTP expires in: {formatTime(timeLeft)}
                              </div>
                            </div>
                          )}
                          {loading && (
                            <div className="otp-loader">
                              <CircularProgress className="loader" />{" "}
                            </div>
                          )}
                          {!showOTPInput && (
                            <div className="my-buttons">
                              <button
                                className="generate-btn"
                                onClick={onSignup}
                              >
                                Generate OTP
                              </button>
                            </div>
                          )}
                          {showOTPInput && (
                            <div className="my-buttons">
                              <button
                                className="login-btn"
                                onClick={onOTPVerify}
                              >
                                Login
                              </button>
                            </div>
                          )}
                        </form>
                        <div className="bottom-paras">
                          <p>
                            Login through Username &nbsp;
                            <LinkContainer to="/login" className="links">
                              <span>Login</span>
                            </LinkContainer>
                          </p>
                          <p>
                            Don't have an Account?&nbsp;
                            <LinkContainer to="/signup" className="links">
                              <span>Signup</span>
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
        </div>
      </div>
    </div>
  );
}

export default PhoneNumberScreen;
