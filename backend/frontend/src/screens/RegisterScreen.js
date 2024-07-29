import React, { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Eye,
  EyeOff,
  Phone,
  ArrowRightCircle,
} from "react-feather";
import OTPInput, { ResendOTP } from "otp-input-react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";
import logoImage from "../images/logo-color.png";
import Button from "../components/Button";
import { Box, CircularProgress, Modal } from "@mui/material";
import ModalClose from "@mui/joy/ModalClose";
import { generateOTP, register, validateUserDetails } from "../actions/actions";

import { USER_LOGOUT } from "../constants/constants";

import "../css/registerscreen.css";
import { brandName } from "../constants/constants";

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

function RegisterScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [otp, setOtp] = useState("");
  const [submit, setSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [showOtpError, setShowOtpError] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [timer, setTimer] = useState(123);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpValid, setOtpValid] = useState(true); // Track OTP validity
  const intervalRef = useRef(null);
  const { t } = useTranslation("registerscreen");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const { registerError, registerUserLoading } = useSelector(
    (state) => state.userRegister
  );

  const { userInfo } = useSelector((state) => state.userLogin);
  const { otpLoading } = useSelector((state) => state.generateOtp);
  const { userDetailsValidate, userDetailsValidateError, errorDetails } =
    useSelector((state) => state.userDetailsValidator);

  const otpGenerate = () => {
    setOpenForm(true);
    setOtp('');
    setOtpValid(true); // Reset OTP validity
    dispatch(generateOTP(email));
    setTimer(120);
    startTimer();
  };

  const regenerateOtp = () => {
    if (resendCount < 2) {
      setLoader(true);
      setOtp('');
      setOtpValid(true); // Reset OTP validity
      dispatch(generateOTP(email));
      setResendCount(resendCount + 1);
      setTimer(120);
    } else {
      toast.error(t("maxAttempts"));
      setOpenForm(false);
      setResendCount(0);
    }
  };

  const validateDetails = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error(t("passwordMinLength"));
      return;
    } else if (password !== confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    } else {
      dispatch(validateUserDetails(email, phoneNumber));
      setSubmit(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp === "") {
      setOtpError(t("enterOtp"));
      setShowOtpError(true);
      setTimeout(() => setShowOtpError(false), 4000);
      return;
    }

    dispatch(register(email, name, otp, password, phoneNumber))
      .then((res) => {
        if (res.error) {
          handleOtpError(t("invalidOtp"));
        } else {
          handleOtpSuccess();
        }
      })
      .catch(() => {
        handleOtpError(t("invalidOtp"));
      });
  };

  const handleOtpError = (errorMessage) => {
    setOtpAttempts((prev) => prev + 1);
      const attemptsLeft = 3 - otpAttempts;
    setOtpError(`Attempt ${otpAttempts+1} of 3. Attempts remaining: ${attemptsLeft-1}`);
    setShowOtpError(true);
    setTimeout(() => setShowOtpError(false), 4000); // Hide error after 4 seconds
    setOtp('');
    setOtpValid(false);

    if (otpAttempts + 1 >= 3) {
      setOpenForm(false);
      toast.error(t("tooManyAttempts"));
      setOtpAttempts(0);
    }
  };

  const handleOtpSuccess = () => {
    setOtpError("");
    setOtpAttempts(0);
    setOpenForm(false);
    navigate("/");
  };

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
          setOpenForm(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (userDetailsValidateError && submit) {
      otpGenerate();
      setSubmit(false);
    } else if (userDetailsValidate && submit) {
      toast.error(userDetailsValidate.detail);
      setLoader(false);
      setOpenForm(false);
      setSubmit(false);
    }
  }, [errorDetails, userDetailsValidate, userDetailsValidateError]);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    } else if (registerError) {
      if (registerError === "Email is already registered") {
        toast.error(t("emailRegistered"));
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
    } else if (otpLoading) {
      setLoader(true);
    }
  }, [otpLoading]);

  // Reset states when the modal opens
  useEffect(() => {
    if (openForm) {
      setOtp('');
      setOtpError('');
      setTimer(120);
      setResendCount(0);
      setOtpAttempts(0);
      setOtpValid(true); // Reset OTP validity
    }
  }, [openForm]);

  // Timer effect
  useEffect(() => {
    if (openForm && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setOpenForm(false);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [openForm, timer]);

  return (
    <div className="register-page">
      <Toaster />
      <div className="main-wrapper authendication-pages">
      <LanguageSelector />
        <div className="register-content">
          <div className="container wrapper no-padding">
            <div className="row no-margin vph-100">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 no-padding">
                <div className="banner-bg register">
                  <div className="row no-margin h-100">
                    <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                      <div className="h-100 d-flex justify-content-center align-items-center">
                        <div className="text-bg register text-center image-color-wrapper">
                          <button
                            type="button"
                            className="btn btn-limegreen text-capitalize"
                          >
                            <i className="fa-solid fa-thumbs-up me-3"></i>
                            {t("registerNow")}
                          </button>
                          <p>
                          <p>{t("registerDescription")}</p>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 no-padding">
                <div className="dull-pg">
                  <div className="row no-margin vph-100 d-flex align-items-center justify-content-center signup-right-banner">
                    <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                      <header className="text-center">
                        <LinkContainer to="/">
                          <a href="#">
                            <img
                              src={logoImage}
                              className="img-fluid"
                              alt={t("logoAlt")}
                            />
                          </a>
                        </LinkContainer>
                      </header>
                      <div className="shadow-card">
                        <h2>{t("getStarted", {brandName})}</h2>
                        <div className="tab-content" id="myTabContent">
                          <div
                            className="tab-pane fade show active"
                            id="user"
                            role="tabpanel"
                            aria-labelledby="user-tab"
                          >
                            <form onSubmit={validateDetails} method="post">
                              <div className="form-group">
                                <div className="group-img">
                                  <i className="feather-user">
                                    <User color="black" size={20} />
                                  </i>
                                  <input
                                    className="form-control pass-input"
                                    required
                                    type="text"
                                    placeholder={t("username")}
                                    value={name}
                                    onChange={(e) => {
                                      setName(e.target.value);
                                    }}
                                    autoComplete="off"
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
                                    placeholder={t("email")}
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
                                    placeholder={t("phoneNumber")}
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
                                    placeholder={t("password")}
                                    value={password}
                                    onChange={(e) => {
                                      setPassword(e.target.value);
                                    }}
                                    autoComplete="new-password"
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
                                    placeholder={t("confirmPassword")}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                      setConfirmPassword(e.target.value);
                                    }}
                                    autoComplete="off"
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
                                  {t("agreeTerms")}{" "}
                                  <a href="javascript:void(0);">
                                    {t("termsOfUse")}</a>
                                </label>
                              </div>
                              <button
                                className="btn btn-secondary register-btn d-inline-flex justify-content-center align-items-center w-100 btn-block"
                                type="submit"
                              >
                                {t("signup")}
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
                          {t("haveAccount")}
                          <LinkContainer to="/login">
                          <span> {t("login")}</span>
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
                    <span>{t("sendingOtp")}</span>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={style}>
                    <ModalClose
                      variant="outlined"
                      sx={{ m: 1 }}
                      onClick={() => setOpenForm(false)}
                    />
                    {registerUserLoading ? (
                      <CircularProgress className="loader" />
                    ) : (
                      <div className="login">
                        <div className="title-auth">
                        <h5>{t("otpAuthentication")}</h5>
                        <p>{t("enterOtp", {email})}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="otp-form">
                          <div className="otp-input">
                          {showOtpError && (
                            <p className="text-danger">{otpError}</p>
                          )}
                            <OTPInput
                              className="otp-input-field"
                              value={otp}
                              onChange={(otp) => setOtp(otp)}
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
                            text={t("submit")}
                            disabled={loader || !otpValid}
                          />
                        </form>
                        <div>{t("otpExpires", {timer})}</div>       
                        <div className="auth-footer">
                        {t("didNotReceiveOtp",{resendCount})}
                          <ResendOTP 
                            onResendClick={regenerateOtp}
                            className="btn1"
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