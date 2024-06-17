import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import OTPInput, { ResendOTP } from "otp-input-react";

import Button from "../components/Button";
import Header from "../components/Header";

import { Box, CircularProgress, Modal} from "@mui/material/";

import {
  generateOTP,
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

const linkStyle = {
  textDecoration: "underline",
  color: "purple",
  cursor: "pointer",
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
  const { userValidate, userValidateError } = useSelector((state) => state.userValidator);
  const { userUpdateSuccess, userUpdateError } = useSelector((state) => state.userUpdate);
  const { otpLoading } = useSelector((state) => state.generateOtp);

  const [username, setUsername] = useState(userInfo?.username || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [fname, setFname] = useState(userInfo?.first_name || "");
  const [phone, setPhone] = useState(customerDetails?.phone_number || "");

  const regenerateOtp = () => {
    setLoader(true);
    setOtp("");
    setOpenForm(true);
    dispatch(generateOTP(email));
  };

  const updateCustomer = (e) => {
    e.preventDefault();
    if (otp && fname && email && phone) {
      setSubmit(true)
      dispatch(updateUserProfile({
        id: userInfo.id,
        otp: otp,
        fname: fname,
        email: email,
        phone: phone
      }))
    } else {
      toast.error("Please fill all fields and enter a valid OTP");
    }
  };

  const otpGenerate = () => {
    setLoader(true);
    setOpenForm(true);
    dispatch(generateOTP(email, userInfo.id));
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
  }, [userUpdateSuccess, navigate, dispatch, userUpdateError, submit]);

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
    <div>
      <Header location="nav-all" />
      <Toaster />
      <div className="profile-page">
        <div className="profile-form">
          <form onSubmit={validateEmail}>
            <h2 className="profile-title">Update Profile</h2>
            <div className="username-input">
              <label>Username</label>
              <input
                className="username"
                value={username}
                disabled
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>

            <div className="firstname-input">
              <label>First Name</label>
              <input
                required
                type="text"
                value={fname}
                onChange={(e) => {
                  setFname(e.target.value);
                }}
              />
            </div>

            <div className="email-input">
              <label>Email Id</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="phonenumber-input">
              <label>Phone Number</label>
              <input
                required
                type="integer"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </div>

            {!openForm && (
              <div className="profile-button">
                <Button
                  type="submit"
                  className="btn-check-availability-home"
                  text="Verify & Update"
                />
              </div>
            )}

            <span>
              Want to update your password?&nbsp;
              <LinkContainer to="/updatepassword" style={linkStyle}>
                <span> update password</span>
              </LinkContainer>
            </span>
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
                <form onSubmit={updateCustomer} className="otp-form">
                  <div className="otp-input">
                    <label>Enter OTP sent to email</label>
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
                      text="submit"
                    />
                  </div>
                </form>
              </Box>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default UpdateprofileScreen;
