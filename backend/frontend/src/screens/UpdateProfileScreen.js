import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import OTPInput, { ResendOTP } from "otp-input-react";
import { ArrowRightCircle } from "react-feather";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Header from "../components/Header";

import { Box, CircularProgress, Modal } from "@mui/material/";

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
    setLoader(true);
    setOtp("");
    setOpenForm(true);
    dispatch(generateUpdateOTP(email, userInfo?.id));
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

  const otpGenerate = () => {
    setLoader(true);
    setOpenForm(true);
    dispatch(generateUpdateOTP(email, userInfo?.id));
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
      toast.error(t("incorrectOtp"));
      setOpenForm(false);
    }
    dispatch({
      type: USER_UPDATE_PROFILE_RESET,
    });
  }, [dispatch, navigate, submit, userUpdateError, userUpdateSuccess]);

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
  }, [userValidate, userValidateError]);

  return (
    <div className="user-profile-wrapper">
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
            <li>{t("updateProfile")}</li>
          </ul>
        </div>
      </section>
      <div className="content profile-bg">
        <div className="container">
          <div className="user-profile-list profile-profile-list">
            <ul className="nav">
              <li>
                <LinkContainer to="/profile">
                  <a>{t("profile")}</a>
                </LinkContainer>
              </li>
              <li>
                <a className="active">{t("updateProfile")}</a>
              </li>
              <li>
                <LinkContainer to="/updatepassword">
                  <a>{t("updatePassword")}</a>
                </LinkContainer>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="profile-detail-group">
                <div className="update-userprofile">
                  <form onSubmit={updateCustomer}>
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
                          <label className="form-label">{t("firstName")}</label>
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
                        <form onSubmit={updateCustomer} className="otp-form">
                          <div className="otp-input">
                            <label>{t("enterOtp")}</label>
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
                            <ResendOTP onResendClick={regenerateOtp} />
                          </div>
                          <div className="otp-button">
                            <Button
                              type="submit"
                              className="btn-check-availability-home"
                              text={t("submit")}
                            />
                          </div>
                        </form>
                      </Box>
                    )}
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateprofileScreen;
