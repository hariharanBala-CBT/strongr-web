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

  return (
    <div className="phonelogin-wrapper">
      <div className="main-wrapper authendication-pages">
        <div className="content blur-ellipses">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-lg-6 mx-auto vph-100 d-flex align-items-center phone-login">
                <div className="forgot-password w-100">
                  <div className="shadow-card">
                    <Toaster toastOptions={{ duration: 4000 }} />
                    <div id="recaptcha-container"></div>
                    <h2 className="login-title">Login</h2>
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
                        </div>
                      )}
                      {loading && (
                        <div className="otp-loader">
                          <CircularProgress className="loader" />{" "}
                        </div>
                      )}
                      {!showOTPInput && (
                        <div className="my-buttons">
                          <button className="generate-btn" onClick={onSignup}>
                            Generate OTP
                          </button>
                        </div>
                      )}
                      {showOTPInput && (
                        <div className="my-buttons">
                          <button className="login-btn" onClick={onOTPVerify}>
                            Login
                          </button>
                        </div>
                      )}
                    </form>
                    <div className="bottom-paras">
                      <p>
                        Login through username &nbsp;
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
  );
}

export default PhoneNumberScreen;
