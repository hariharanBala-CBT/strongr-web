import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Header from "../components/Header";
import Button from "../components/Button";
import OTPInput, { ResendOTP } from "otp-input-react";
import { Box, CircularProgress, Modal } from "@mui/material";
// import Message from "../components/Message";

import { generateOTP, register, validateUser } from "../actions/actions";

import { USER_LOGOUT } from "../constants/constants";

import "../css/registerscreen.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  User,
  Mail,
  Eye,
  EyeOff,
  Phone,
  ArrowRightCircle,
} from "react-feather";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const linkStyle = {
  textDecoration: "underline",
  color: "purple",
  cursor: "pointer",
};

function RegisterScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [validatedEmail, setValidatedEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    console.log("tester....");
    setShowConfirmPassword(!showConfirmPassword);
  };
  const [submit, setSubmit] = useState(false);

  const { registerError, registerUserLoading } = useSelector(
    (state) => state.userRegister
  );

  const { userInfo } = useSelector((state) => state.userLogin);
  const { otpLoading } = useSelector((state) => state.generateOtp);
  const { userValidate, userValidateError } = useSelector(
    (state) => state.userValidator
  );

  const otpGenerate = () => {
    setOpenForm(true);
    dispatch(generateOTP(email));
  };

  const regenerateOtp = () => {
    setLoader(true);
    dispatch(generateOTP(email));
  };

  const validateEmail = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Pasword must be atleast 8 characters");
      return;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
      dispatch(validateUser(email));
      setSubmit("true");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp === "") {
      toast.error("Please enter the OTP");
      return;
    }
    dispatch(register(email, name, otp, password, phoneNumber));
  };

  useEffect(() => {
    if (userValidateError && submit) {
      otpGenerate();
      setSubmit(false);
    } else if (userValidate && submit) {
      toast.error("Email already exists");
      setLoader(false);
      setOpenForm(false);
      setSubmit(false);
    }
  }, [userValidate, userValidateError]);

  useEffect(() => {
    if (userInfo) {
      toast.success("User signup success!");
      navigate("/");
    } else if (registerError) {
      if (registerError === "Email is already registered") {
        toast.error(
          "This email is already registered. Please use a different email."
        );
      } else {
        toast.error(registerError);
      }
      dispatch({
        type: USER_LOGOUT,
      });
    }
  }, [dispatch, navigate, registerError, userInfo]);

  useEffect(() => {
    if (!otpLoading) {
      setLoader(false);
    }
  }, [otpLoading]);

  return (
    <div className="register-page">
      {/* <Header location="nav-all" /> */}
      <Toaster />
      <div className="main-wrapper authendication-pages">
        <div className="register-content">
          <div className="container wrapper no-padding">
            <div className="row no-margin vph-100">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 no-padding">
                <div className="banner-bg register">
                  <div className="row no-margin h-100">
                    <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                      <div className="h-100 d-flex justify-content-center align-items-center"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 no-padding">
                <div className="dull-pg">
                  <div className="row no-margin vph-100 d-flex align-items-center justify-content-center signup-right-banner">
                    <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                      <div className="shadow-card">
                        <h2>Get Started With Strongr</h2>
                        <div className="tab-content" id="myTabContent">
                          <div
                            className="tab-pane fade show active"
                            id="user"
                            role="tabpanel"
                            aria-labelledby="user-tab"
                          >
                            <form onSubmit={validateEmail} method="post">
                              <div className="form-group">
                                <div className="group-img">
                                  <i className="feather-user">
                                    <User color="black" size={20} />
                                  </i>
                                  <input
                                    className="form-control pass-input"
                                    required
                                    type="text"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => {
                                      setName(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="group-img">
                                  <i className="feather-mail">
                                    <Mail color="black" size={20} />
                                  </i>

                                  <input
                                    className="form-control pass-input"
                                    required
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => {
                                      setEmail(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="group-img">
                                  <i className="feather-mail">
                                    <Phone color="black" size={20} />
                                  </i>

                                  <input
                                    className="form-control pass-input"
                                    required
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                      setPhoneNumber(e.target.value);
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="pass-group group-img">
                                  <i className="toggle-password feather-eye-off"></i>
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control pass-input"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => {
                                      setPassword(e.target.value);
                                    }}
                                  />
                                  <span
                                    onClick={togglePasswordVisibility}
                                    className="feather-icon-wrapper"
                                  >
                                    {showPassword ? (
                                      <EyeOff size={20} />
                                    ) : (
                                      <Eye size={20} />
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="pass-group group-img">
                                  <i className="toggle-password-confirm feather-eye-off"></i>
                                  <input
                                    type={
                                      showConfirmPassword ? "text" : "password"
                                    }
                                    className="form-control pass-confirm"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                      setConfirmPassword(e.target.value);
                                    }}
                                  />
                                  <span
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="feather-icon-wrapper"
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff size={20} />
                                    ) : (
                                      <Eye size={20} />
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="form-check d-flex justify-content-start align-items-center policy">
                                <div className="d-inline-block">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value
                                    id="policy"
                                  />
                                </div>
                                <label
                                  className="form-check-label"
                                  for="policy"
                                >
                                  By continuing you indicate that you read and
                                  agreed to the{" "}
                                  <a href="terms-condition.html">
                                    Terms of Use
                                  </a>
                                </label>
                              </div>
                              <button
                                className="btn btn-secondary register-btn d-inline-flex justify-content-center align-items-center btn-block"
                                type="submit"
                              >
                                Create Account
                                <span className="right-arrow">
                                  <ArrowRightCircle size={20} />
                                </span>
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div className="bottom-text text-center">
                        <p>
                          Have an account?
                          <LinkContainer
                            to="/login"
                            style={{
                              textDecoration: "underline",
                              color: "white",
                            }}
                          >
                            <span> login</span>
                          </LinkContainer>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Modal
                open={openForm}
                onClose={() => setOpenForm(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                {loader ? (
                  <Box sx={style} className="otp-loader">
                    <span>sending otp...</span>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={style}>
                    {registerUserLoading ? (
                      <CircularProgress className="loader" />
                    ) : (
                      <div className="login">
                        <div className="title-auth">
                          <h5>OTP Authentication</h5>
                          <p>Enter the 4 digit OTP sent to your email.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="otp-form">
                          <div className="otp-input">
                            <OTPInput
                              className="otp-input-field"
                              value={otp}
                              onChange={setOtp}
                              autoFocus
                              OTPLength={4}
                              otpType="number"
                              disabled={false}
                              secure
                            />
                          </div>
                          <Button
                            type="submit"
                            className="otp-login-btn"
                            text="submit"
                          />
                        </form>

                        <div className="auth-footer">
                          Didn’t receive an OTP.
                          <ResendOTP
                            onResendClick={regenerateOtp}
                            className="resend-btn"
                          />
                        </div>
                      </div>
                    )}
                  </Box>
                )}
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
