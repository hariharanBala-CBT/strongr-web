import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../css/updateprofilescreen.css";
import {
  listcustomerDetails,
  updateUserProfile,
  generateOTP,
} from "../actions/actions";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { RESET_PASSWORD_RESET, USER_UPDATE_PROFILE_RESET } from "../constants/constants";
import OTPInput, { ResendOTP } from "otp-input-react";
import toast, { Toaster } from 'react-hot-toast';

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

  const { userInfo } = useSelector((state) => state.userLogin);
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const { userUpdateSuccess, userUpdateError } = useSelector(
    (state) => state.userUpdate
  );
  const { otpLoading } = useSelector((state) => state.generateOtp);

  const [username, setUsername] = useState(userInfo?.username || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [fname, setFname] = useState(userInfo?.first_name || "");
  const [phone, setPhone] = useState(customerDetails?.phone_number || "");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    setOpenForm(false);
    dispatch({
      type: RESET_PASSWORD_RESET,
    })
    dispatch(listcustomerDetails(id));
    if (!userInfo) {
      navigate("/");
    }
  }, [userInfo, id, navigate, dispatch]);

  useEffect(() => {
    setPhone(customerDetails?.phone_number);
  }, [customerDetails]);

  const otpGenerate = (e) => {
    e.preventDefault();
    setLoader(true);
    setOpenForm(true);
    dispatch(generateOTP(email));
  };

  const regenerateOtp = () => {
    setLoader(true);
    setOpenForm(true);
    dispatch(generateOTP(email));
  }

  useEffect(() => {
    if (!otpLoading) {
      setLoader(false);
    }
  }, [otpLoading]);

  const updateCustomer = (e) => {
    e.preventDefault();
    dispatch(
      updateUserProfile({
        id: userInfo.id,
        fname: fname,
        email: email,
        phone: phone,
        otp: otp,
      })
    );
  };

  useEffect(() => {
    if (userUpdateSuccess) {
      toast.success('user details updated')
      navigate("/profile/");
    } else if (userUpdateError) {
      toast.error('incorrect OTP')
      setOpenForm(false);
      dispatch({
        type: USER_UPDATE_PROFILE_RESET,
      });
    }
  }, [userUpdateSuccess, navigate, dispatch, userUpdateError]);

  return (
    <div>
      <Header location="nav-all" />
      <Toaster />
      <div className="profile-page">
        <div className="profile-form">
          <form onSubmit={otpGenerate}>
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
            <a href="/updatepassword/">Update Password</a>
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
                    {/* <input
                      className="otp"
                      value={otp}
                      type="integer"
                      onChange={(e) => {
                        setOtp(e.target.value);
                      }}
                    /> */}
                    <OTPInput
                      className='otp-input-field'
                      value={otp}
                      onChange={setOtp}
                      autoFocus
                      OTPLength={4}
                      otpType="number"
                      disabled={false}
                      secure
                    />
                    <ResendOTP
                      onResendClick={regenerateOtp}
                    />
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
