import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { User, Eye, EyeOff, ArrowRightCircle } from "react-feather";
import { CircularProgress, TextField } from "@mui/material";
import logoImage from "../images/logo-color.png";
import { login, validateUser } from "../actions/actions";

import { useTranslation } from "react-i18next";
import LanguageSelector from "../components/LanguageSelector";

import { USER_LOGIN_RESET } from "../constants/constants";

import "../css/loginscreen.css";

function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("login");

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
      localStorage.setItem("userName", userInfo.first_name);
      navigate(-1);
      setErrorMessage("");
    } else if (!userInfo && LoginError && password.length > 0) {
      setErrorMessage(t("incorrectPassword"));
      setPassword("");
    }
  }, [dispatch, LoginError, navigate, userInfo]);

  useEffect(() => {
    if (userValidate) {
      dispatch(login(username, password));
    }
  }, [dispatch, userValidate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(validateUser(username));
  };

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
        <LanguageSelector />
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
                            <i className="fa-solid fa-thumbs-up me-3"></i>
                            {t("loginButton")}
                          </button>
                          <p>{t("loginParagraph")}</p>
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
                        <Link to="/">
                          <img
                            src={logoImage}
                            className="img-fluid"
                            alt={t("logoAlt")}
                          />
                        </Link>
                      </header>
                      <div className="shadow-card">
                        <h2>{t("welcomeBack")}</h2>
                        <p>{t("loginIntoYourAccount")}</p>
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
                                  <div
                                    className={`group-img ${
                                      userValidateError
                                        ? "icon-wrapper-error"
                                        : ""
                                    }`}
                                  >
                                    <span className="feather-icon-wrapper user-ic">
                                      <User color="black" size={20} />
                                    </span>
                                    <TextField
                                      error={
                                        username.length > 0 && userValidateError
                                      }
                                      helperText={
                                        username.length > 0 &&
                                        userValidateError &&
                                        t("invalidUsername")
                                      }
                                      required
                                      className="form-control pass-input"
                                      type="text"
                                      placeholder={t("enterUsername")}
                                      value={username}
                                      onChange={handleUsername}
                                    />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <div
                                    className={`pass-group group-img ${
                                      LoginError ? "icon-wrapper-error" : ""
                                    }`}
                                  >
                                    <span
                                      onClick={togglePasswordVisibility}
                                      className="feather-icon-wrapper user-ic"
                                    >
                                      {showPassword ? (
                                        <EyeOff size={20} color="black" />
                                      ) : (
                                        <Eye size={20} color="black" />
                                      )}
                                    </span>
                                    <TextField
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
                                      placeholder={t("enterPassword")}
                                      value={password}
                                      onChange={handlePassword}
                                    />
                                  </div>
                                </div>
                                <button
                                  className="btn btn-secondary register-btn d-inline-flex justify-content-center align-items-center w-100 btn-block"
                                  type="submit"
                                >
                                  {t("login")}
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
                            {t("LoginThroughPhoneNumber")}&nbsp;
                            <LinkContainer
                              to="/phonenumberlogin"
                              style={{
                                textDecoration: "underline",
                                color: "#192335",
                              }}
                            >
                              <span>{t("login")}</span>
                            </LinkContainer>
                          </p>
                        </div>
                        <div className="bottom-text-two text-center">
                          <p>
                            {t("dontHaveAccount")}&nbsp;
                            <LinkContainer
                              to="/signup"
                              style={{
                                textDecoration: "underline",
                                color: "#192335",
                              }}
                            >
                              <span>{t("signup")}</span>
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
