import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { User, Eye, EyeOff, ArrowRightCircle } from "react-feather";
import { CircularProgress } from "@mui/material";
import logoImage from "../images/logo-color.png";
import { login, validateUser } from "../actions/actions";

import { USER_LOGIN_RESET } from "../constants/constants";

import "../css/loginscreen.css";

function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { userInfo, LoginError, loading } = useSelector(
    (state) => state.userLogin
  );
  const { userValidate, userValidateError } = useSelector(
    (state) => state.userValidator
  );

  useEffect(() => {
    dispatch({
      type: USER_LOGIN_RESET,
    });
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      navigate(-1);
      setErrorMessage("");
    } else if (!userInfo && LoginError && password.length > 0) {
      setErrorMessage("Incorrect Password");
      setPassword("");
    }
  }, [dispatch, LoginError, navigate, userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(validateUser(username));
  };

  useEffect(() => {
    if (userValidate) {
      dispatch(login(username, password));
    }
  }, [dispatch, userValidate]);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrorMessage("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-page">
      <Toaster />
      <div className="main-wrapper authendication-pages">
        <div className="register-content">
          <div className="container wrapper no-padding">
            <div className="row no-margin vph-100">
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 no-padding toppage-container">
                <div className="banner-bg loginpage">
                  <div className="row no-margin h-100">
                    <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                      <div className="h-100 d-flex justify-content-center align-items-center">
                        <div className="text-bg register text-center image-color-wrapper">
                          <button
                            type="button"
                            className="btn btn-limegreen text-capitalize"
                          >
                            <i className="fa-solid fa-thumbs-up me-3"></i>Login
                            User
                          </button>
                          <p>
                            Log in right away for our advanced sports software
                            solutions, created to address issues in regular
                            sporting events and activities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-6 no-padding">
                <div className="dull-pg">
                  <div className="row no-margin vph-100 d-flex align-items-center justify-content-center login-right-banner">
                    <div className="col-sm-10 col-md-10 col-lg-10 mx-auto">
                      <header className="text-center">
                        <LinkContainer to="/">
                          <a href="#">
                            <img
                              src={logoImage}
                              className="img-fluid"
                              alt="Logo"
                            />
                          </a>
                        </LinkContainer>
                      </header>
                      <div className="shadow-card">
                        <h2>Welcome Back</h2>
                        <p>Login into your Account</p>
                        {loading ? (
                          <CircularProgress className="loader" />
                        ) : (
                          <div className="tab-content" id="myTabContent">
                            <div
                              className="tab-pane fade show active"
                              id="user"
                              role="tabpanel"
                              aria-labelledby="user-tab"
                            >
                              <form
                                onSubmit={handleSubmit}
                                className="login-form"
                              >
                                <div className="form-group">
                                  <div className="group-img">
                                    <i className="feather-user">
                                      <User color="black" size={20} />
                                    </i>
                                    <input
                                      error={
                                        username.length > 0 && userValidateError
                                      }
                                      helperText={
                                        username.length > 0 &&
                                        userValidateError &&
                                        "Invalid username"
                                      }
                                      required
                                      className="form-control pass-input"
                                      type="text"
                                      placeholder="Enter Username"
                                      value={username}
                                      onChange={handleUsername}
                                      color={userValidateError && "success"}
                                    />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div className="pass-group group-img">
                                    <i className="toggle-password feather-eye-off"></i>
                                    <input
                                      error={
                                        LoginError && errorMessage.length > 0
                                      }
                                      helperText={
                                        errorMessage.length > 0 &&
                                        LoginError &&
                                        errorMessage
                                      }
                                      required
                                      type={showPassword ? "text" : "password"}
                                      className="form-control pass-input"
                                      placeholder="Enter Password"
                                      value={password}
                                      onChange={handlePassword}
                                    />
                                    <span
                                      onClick={togglePasswordVisibility}
                                      className="feather-icon-wrapper"
                                    >
                                      {showPassword ? (
                                        <EyeOff size={20} color="black" />
                                      ) : (
                                        <Eye size={20} color="black" />
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  className="btn btn-secondary register-btn d-inline-flex justify-content-center align-items-center w-100 btn-block"
                                  type="submit"
                                >
                                  Login
                                  <span className="right-arrow">
                                    <ArrowRightCircle size={20} />
                                  </span>
                                </button>
                              </form>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="bottom-texts">
                        <div className="bottom-text-one text-center">
                          <p>
                            Login using Phone Number?&nbsp;
                            <LinkContainer
                              to="/phonenumberlogin"
                              style={{
                                textDecoration: "underline",
                                color: "#192335",
                              }}
                            >
                              <span>Login</span>
                            </LinkContainer>
                          </p>
                        </div>
                        <div className="bottom-text-two text-center">
                          <p>
                            Don’t have an Account?&nbsp;
                            <LinkContainer
                              to="/signup"
                              style={{
                                textDecoration: "underline",
                                color: "#192335",
                              }}
                            >
                              <span>Signup</span>
                            </LinkContainer>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
