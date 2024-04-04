import React, { useEffect, useState } from "react";
import "../css/registerscreen.css";
import Header from "../components/Header";
import Button from "../components/Button";
// import Message from "../components/Message";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { generateOTP, register } from "../actions/actions";
import { Box, CircularProgress, Modal } from "@mui/material";
import OTPInput, { ResendOTP } from "otp-input-react";
import { USER_LOGOUT } from "../constants/constants";
import toast, { Toaster } from "react-hot-toast";

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
  // const location = useLocation();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [message, setMessage] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [otp, setOtp] = useState("");

  // const redirect = location.search ? location.search.split("=")[1] : "/";

  const { registerError, registerUserLoading } = useSelector(
    (state) => state.userRegister
  );

  const { userInfo } = useSelector((state) => state.userLogin);
  const { otpLoading } = useSelector((state) => state.generateOtp);

  useEffect(() => {
    setOpenForm(false);
    if (userInfo) {
      toast.success("user signup sucess!");
      navigate("/");
    } else if (registerError) {
      toast.error("incorrect OTP");
      setOpenForm(false);
      dispatch({
        type: USER_LOGOUT,
      });
    }
  }, [navigate, userInfo, registerError, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(name, email, password, phoneNumber, otp));
  };

  const otpGenerate = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      setLoader(true);
      setOpenForm(true);
      dispatch(generateOTP(email));
    }
  };

  const regenerateOtp = () => {
    setLoader(true);
    setOpenForm(true);
    dispatch(generateOTP(email));
  };

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
          <h1 className="signup-title">SIGN IN</h1>

          <form onSubmit={otpGenerate} method="post">
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
                />
              </div>
            </div>

            <div className="signup-button">
              <Button
                type="submit"
                className="btn-check-availability-home"
                text="signup"
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
                <span>sending otp...</span>
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
                        text="submit"
                      />
                    </div>
                  </form>
                )}
              </Box>
            )}
          </Modal>

          <span>
            Already have an Account?&nbsp; <a href="/login"> Login</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
