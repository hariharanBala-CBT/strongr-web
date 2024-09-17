import React, { useEffect, useState, useRef } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import OTPInput, { ResendOTP } from "otp-input-react";
import { ArrowRightCircle } from "react-feather";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Header from "../components/Header";

import Footer from "../components/Footer";

import { Box, CircularProgress, Modal } from "@mui/material/";
import ModalClose from "@mui/joy/ModalClose";
import {
  generateUpdateOTP,
  listcustomerDetails,
  updateUserProfile,
  validateUser,
} from "../actions/actions";

import {
  RESET_PASSWORD_RESET,
  USER_UPDATE_PROFILE_RESET,
} from "../constants/constants";

import "../css/updateprofilescreen.css";

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

function UpdateprofileScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("updateprofilescreen");

  const { id } = useParams();
  const [openForm, setOpenForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showOtpError, setShowOtpError] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [timer, setTimer] = useState(120);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const intervalRef = useRef(null);

  const { userInfo } = useSelector((state) => state.userLogin);
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const { userValidate, userValidateError } = useSelector(
    (state) => state.userValidator
  );
  const { userUpdateSuccess, userUpdateError } = useSelector(
    (state) => state.userUpdate
  );
  const { otpLoading } = useSelector((state) => state.generateOtp);

  const [username, setUsername] = useState(userInfo?.username || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [fname, setFname] = useState(userInfo?.first_name || "");
  const [phone, setPhone] = useState(customerDetails?.phone_number || "");

  const regenerateOtp = () => {
    if (resendCount < 2) {
      setLoader(true);
      setOtp("");
      setOtpError('');
      // setOtpValid(true);
      dispatch(generateUpdateOTP(email, userInfo?.id));
      setResendCount(resendCount + 1);
      setTimer(120); // Reset the timer on OTP resend
      setShowOtpError(false);
      startTimer();
    } else {
      toast.error(t("tooManyAttempts"));
      setOpenForm(false);
      setResendCount(0);
    }
  };

  const updateCustomer = (e) => {
    e.preventDefault();
    if (otp && fname && email && phone) {
      setSubmit(true);
      dispatch(
        updateUserProfile({
          id: userInfo.id,
          otp: otp,
          fname: fname,
          email: email,
          phone: phone,
        })
      );
    } else {
      toast.error(t("fillAllFields"));
    }
  };

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          clearInterval(intervalRef.current);
          setOpenForm(false);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const otpGenerate = () => {
    setLoader(true);
    setOpenForm(true);
    setOtp('');
    setOtpError('');
    setShowOtpError(false);
    dispatch(generateUpdateOTP(email, userInfo?.id));
    setTimer(120);
    startTimer();
  };

  const validateEmail = (e) => {
    e.preventDefault();
    setOtp("");
    dispatch(validateUser(email));
    setSubmit(true);
  };

  useEffect(() => {
    if (!otpLoading) {
      setLoader(false);
    }
  }, [otpLoading]);

  useEffect(() => {
    if (userUpdateSuccess && submit) {
      toast.success(t("userDetailsUpdated"));
      setSubmit(false);
    } else if (userUpdateError && submit) {
      setOtp("");
      const attemptsLeft = 3 - otpAttempts;
      setOtpError(t('attemptRemaining', { current: otpAttempts + 1, remaining: attemptsLeft - 1 }));
      setShowOtpError(true);
      setTimeout(() => setShowOtpError(false), 4000);
      setOtpAttempts(otpAttempts + 1);
      if (otpAttempts + 1 >= 3) {
        setOpenForm(false);
        toast.error(t("tooManyInvalidAttempts"));
        setOtpAttempts(0);
      } else {
        toast.error(t("incorrectOtp"));
      }
      setSubmit(false);
    }
    dispatch({
      type: USER_UPDATE_PROFILE_RESET,
    });
  }, [dispatch, navigate, otpAttempts, submit, t, userUpdateError, userUpdateSuccess]);

  useEffect(() => {
    setOpenForm(false);
    dispatch({
      type: RESET_PASSWORD_RESET,
    });
    dispatch(listcustomerDetails(id));
    if (!userInfo) {
      navigate("/");
    }
  }, [userInfo, id, navigate, dispatch]);

  useEffect(() => {
    setPhone(customerDetails?.phone_number);
  }, [customerDetails]);

  useEffect(() => {
    if (userValidateError && submit && email !== userInfo?.email) {
      otpGenerate();
      setSubmit(false);
    } else if (userValidate && submit && email !== userInfo?.email) {
      toast.error(t("emailExists"));
      setSubmit(false);
    } else if (userValidate && submit && email === userInfo?.email) {
      otpGenerate();
      setSubmit(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userValidate, userValidateError]);

  return (
    <div className="user-profile-wrapper update-profile-screen">
      <Header location="nav-all" />
      <Toaster />
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round"></span>
        <div className="container">
          <h1 className="text-white">{t("updateProfile")}</h1>
          <ul>
            <li className="breadcrumb-icons">
              <a href="/">{t("home")}</a>
            </li>
            <li className="breadcrumb-icons">
              <Link to="/profile">
                {t("userProfile")}
              </Link>
            </li>
            <li>{t("updateProfile")}</li>
          </ul>
        </div>
      </section>
      <div className="content profile-bg">
        <div className="container">
          <div className="user-profile-list profile-profile-list">
            <ul className="nav">
              <li>
                <Link to="/profile">
                  {t("profile")}
                </Link>
              </li>
              <li>
                <Link className="active">{t("updateProfile")}</Link>
              </li>
              <li>
                <Link to="/updatepassword">
                  {t("updatePassword")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="profile-detail-group">
                <div className="update-userprofile">
                  <form onSubmit={validateEmail}>
                    <h2 className="profile-title">{t("updateProfile")}</h2>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="input-space">
                          <label className="form-label">{t("username")}</label>
                          <input
                            className="form-control pass-input"
                            required
                            type="text"
                            value={username}
                            disabled
                            onChange={(e) => {
                              setUsername(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="input-space">
                          <label className="form-label">{t("name")}</label>
                          <input
                            className="form-control pass-input"
                            required
                            type="text"
                            value={fname}
                            onChange={(e) => {
                              setFname(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="input-space mb-0">
                          <label className="form-label">{t("email")}</label>
                          <input
                            className="form-control pass-input"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="input-space mb-0">
                          <label className="form-label">{t("phoneNumber")}</label>
                          <input
                            className="form-control pass-input"
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {!openForm && (
                      <button
                        className="btn btn-secondary register-btn d-inline-flex justify-content-center align-items-center w-50 btn-block"
                        type="submit"
                      >
                        <span>{t("verifyAndUpdate")}</span>

                        <span className="right-arrow">
                          <ArrowRightCircle size={20} />
                        </span>
                      </button>
                    )}
                    <div className="bottom-text">
                      <span>
                        {t("updatePasswordPrompt")}&nbsp;
                        <LinkContainer to="/updatepassword">
                          <span className="linked-para-text">
                            {" "}
                            {t("updatePassword")}
                          </span>
                        </LinkContainer>
                      </span>
                    </div>
                  </form>
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
                        <div className="update-prof-otpform">
                          <form onSubmit={updateCustomer} className="otp-form">
                            <div className="otp-input">
                              <label className="update-prof-label">
                                {t("enterOtp", {email})}
                              </label>
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
                              <div className="resend-wrapper">
                                <div>{t("otpExpires", {timer})}</div>
                                <div className="auth-footer">
                                {t("didNotReceiveOtp",{resendCount})}
                                  <ResendOTP
                                    onResendClick={regenerateOtp}
                                    className="btn1"
                                  />
                                </div>
                              </div>
                            </div>
                            <Button
                              type="submit"
                              className="otp-login-btn"
                              text={t("submit")}
                            />
                          </form>
                        </div>
                      </Box>
                    )}
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UpdateprofileScreen;
