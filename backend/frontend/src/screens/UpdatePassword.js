import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Header from "../components/Header";
import Button from "../components/Button";
import "../css/updatepassword.css";
import { resetUserPassword } from "../actions/actions";
import toast, { Toaster } from "react-hot-toast";

function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.userLogin);
  const { resetPsuccess } = useSelector((state) => state.resetUserPassword);

  useEffect(() => {
    if (resetPsuccess) {
      toast.success("password updated successfully");
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  }, [navigate, resetPsuccess]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/;

    if (!password.match(passwordRegex)) {
      toast.error(
        "Password must contain minimum 6 characters, one special character, and one number"
      );
      return;
    }
    if (password === confirmPassword) {
      dispatch(
        resetUserPassword({
          id: userInfo.id,
          password: password,
        })
      );
    } else toast.error("passwords do not match");
  };

  return (
    <div className="user-profile-wrapper">
      <Header location="nav-all" />
      <Toaster />
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round"></span>
        <div className="container">
          <h1 className="text-white">Update Password</h1>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>Update Password</li>
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
                <a
                  onClick={() => {
                    navigate(`/profile/${userInfo.id}`);
                  }}
                >
                  Update Profile
                </a>
              </li>
              <li>
                <a className="active">Update Password</a>
              </li>
            </ul>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="profile-detail-group">
                <div className="update-userprofile">
                  <form>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="appoint-head">
                          <h4>Change Password</h4>
                        </div>
                        <div className="input-space other-setting-form">
                          <label className="form-label"> Password</label>
                          <input
                            required
                            className="form-control"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                          />
                        </div>
                        <div className="input-space other-setting-form">
                          <label className="form-label">Confirm Password</label>
                          <input
                            required
                            className="form-control"
                            type="password"
                            placeholder="Enter password Again"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="deactivate-account-blk">
                          <a
                            href="javascript:void(0)"
                            className="btn deactive-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#deactive"
                          >
                            <i className="feather-zap-off"></i>Deactive Account
                          </a>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
