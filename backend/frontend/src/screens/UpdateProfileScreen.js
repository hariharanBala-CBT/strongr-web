import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import OTPInput, { ResendOTP } from "otp-input-react";
import { ArrowRightCircle } from "react-feather";
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
      toast.error("Please fill all fields and enter a valid OTP");
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
      toast.success("user details updated");
      setSubmit(false);
    } else if (userUpdateError && submit) {
      toast.error("incorrect OTP");
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
      toast.error("Account with this email exists");
      setSubmit(false);
    } else if (userValidate && submit && email === userInfo?.email) {
      otpGenerate();
      setSubmit(false);
    }
  }, [userValidate, userValidateError]);

  return (
    <div className="user-profile-wrapper update-profile-screen">
      <Header location="nav-all" />
      <Toaster />
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round"></span>
        <div className="container">
          <h1 className="text-white">Update Profile</h1>
          <ul>
            <li className="breadcrumb-icons">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-icons">
              <LinkContainer to="/profile">
                <a>User Profile</a>
              </LinkContainer>
            </li>
            <li>Update Profile</li>
          </ul>
        </div>
      </section>
      <div className="content profile-bg">
        <div className="container">
          <div className="user-profile-list profile-profile-list">
            <ul className="nav">
              <li>
                <LinkContainer to="/profile">
                  <a>Profile</a>
                </LinkContainer>
              </li>
              <li>
                <a className="active">Update Profile</a>
              </li>
              <li>
                <LinkContainer to="/updatepassword">
                  <a>Update Password</a>
                </LinkContainer>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="profile-detail-group">
                <div className="update-userprofile">
                  <form onSubmit={validateEmail}>
                    <h2 className="profile-title">Update Profile</h2>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="input-space">
                          <label className="form-label">Username</label>
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
                          <label className="form-label">First Name</label>
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
                          <label className="form-label">Email</label>
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
                          <label className="form-label">Phone Number</label>
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
                        <span>Verify & Update</span>

                        <span className="right-arrow">
                          <ArrowRightCircle size={20} />
                        </span>
                      </button>
                    )}
                    <div className="bottom-text">
                      <span>
                        Want to update your password?&nbsp;
                        <LinkContainer to="/updatepassword">
                          <span className="linked-para-text">
                            {" "}
                            Update Password
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
                        <span>sending otp...</span>
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
                                Enter OTP sent to email
                              </label>
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
                              <div className="resend-wrapper">
                                <ResendOTP
                                  onResendClick={regenerateOtp}
                                  className="resend-btn"
                                />
                              </div>
                            </div>
                            <Button
                              type="submit"
                              className="otp-login-btn"
                              text="submit"
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
