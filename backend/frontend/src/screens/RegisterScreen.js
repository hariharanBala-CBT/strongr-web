import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Header from "../components/Header";
import Button from "../components/Button";
import OTPInput, { ResendOTP } from "otp-input-react";
import { Box, CircularProgress, Modal } from "@mui/material";

import { generateOTP, register, validateUser } from "../actions/actions";

import { USER_LOGOUT } from "../constants/constants";

import "../css/registerscreen.css";

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
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [otp, setOtp] = useState("");
  const [submit, setSubmit] = useState(false);

  const { registerError, registerUserLoading } = useSelector(
    (state) => state.userRegister
  );

  const { userInfo } = useSelector((state) => state.userLogin);
  const { otpLoading } = useSelector((state) => state.generateOtp);
  const { userValidate, userValidateError } = useSelector((state) => state.userValidator);

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
      toast.error("Password must be at least 8 characters");
      return;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
      dispatch(validateUser(email));
      setSubmit(true);
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
      toast.error('Email already exists');
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
        toast.error("This email is already registered. Please use a different email.");
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
    <div>
      <Header location="nav-all" />
      <Toaster />
      <div className="signup-page">
        <div className="signup-form">
          <h1 className="signup-title">SIGN UP</h1>

          <form method="post" onSubmit={validateEmail}>
            <div className="div-div">
              <div className="div-1">
                <label>Name</label>
                <input
                  required
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  autoComplete="off"
                />

                <label>Phone Number</label>
                <input
                  required
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  autoComplete="off"
                />

                <label>Email</label>
                <input
                  required
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  autoComplete="off"
                />
              </div>

              <div className="div-2">
                <label>Password</label>
                <input
                  required
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  autoComplete="new-password"
                />

                <label>Confirm Password</label>
                <input
                  required
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="signup-button">
              <Button
                type="submit"
                className="btn-check-availability-home"
                text="Sign Up"
              />
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
                <span>Sending OTP...</span>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={style}>
                {registerUserLoading ? (
                  <CircularProgress className="loader" />
                ) : (
                  <form onSubmit={handleSubmit} className="otp-form">
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
                        text="Submit"
                      />
                    </div>
                  </form>
                )}
              </Box>
            )}
          </Modal>

          <span>
            Already have an Account?
            <LinkContainer to="/login" style={linkStyle}>
              <span> Login</span>
            </LinkContainer>
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
