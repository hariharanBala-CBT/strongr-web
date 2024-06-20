import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "react-hot-toast";
import { LinkContainer } from "react-router-bootstrap";
import PhoneInput from "react-phone-input-2";
import OTPInput from "react-otp-input";

import Header from "../components/Header";

import { CircularProgress } from "@mui/material";

import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { loginPhoneNumber, validatePhone } from "../actions/actions";

import "../css/phonenumscreen.css";
import "react-phone-input-2/lib/style.css";

const linkStyle = {
  textDecoration: "underline",
  color: "purple",
  cursor: "pointer",
};

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
    <div>
      <Header location="nav-all" />
      <div className="logins-page">
        <div className="logins-form">
          <Toaster toastOptions={{ duration: 4000 }} />
          <div id="recaptcha-container"></div>
          <h1 className="login-title">LOGIN</h1>
          <form>
            <label id="phone">
              Phone Number
              <PhoneInput
                id="phone"
                required
                country={"in"}
                placeholder="Enter phone number"
                value={ph}
                onChange={(value) => {
                  handlePhoneNumberChange();
                  setPh(value);
                }}
              />
            </label>
            {showOTPInput && (
              <div className="otp-box">
                <label id="otp">
                  Enter OTP
                  <OTPInput
                    id="otp"
                    className="otp-input-field"
                    value={otp}
                    onChange={setOTP}
                    numInputs={6}
                    otpType="number"
                    autoFocus
                    renderInput={renderInput}
                  />
                </label>
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
          <span>
            Login through username &nbsp;
            <LinkContainer to="/login" style={linkStyle}>
              <span>login</span>
            </LinkContainer>
          </span>
          <span>
            Don't have an Account?&nbsp;
            <LinkContainer to="/signup" style={linkStyle}>
              <span>signup</span>
            </LinkContainer>
          </span>
        </div>
      </div>
    </div>
  );
}

export default PhoneNumberScreen;
