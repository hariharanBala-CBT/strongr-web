import React, { useState, useEffect } from "react";
import "../css/loginscreen.css";
import Header from "../components/Header";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, validateUser } from "../actions/actions";
import { Toaster } from "react-hot-toast";
import { CircularProgress, TextField } from "@mui/material";
import { USER_LOGIN_RESET } from "../constants/constants";
// import { USER_LOGIN_RESET } from "../constants/constants";
import { LinkContainer } from "react-router-bootstrap";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const redirect = location.search ? location.search.split("=")[1] : "/";
  const { userInfo, error, loading } = useSelector((state) => state.userLogin);
  const { userValidate } = useSelector((state) => state.userValidator);


  useEffect(() => {
      dispatch({
        type: USER_LOGIN_RESET,
      });
  },[dispatch])

  useEffect(() => {
    if (userInfo) {
      navigate(-1);
      // toast.success("logged in successfully");
      setErrorMessage("")
    } else if(!userInfo && error && password.length > 0){
      setErrorMessage("Incorrect Password")
      setPassword("")
    }
  }, [navigate, userInfo, dispatch, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(validateUser(username));
  };
  
  useEffect(() => {
    if(userValidate){
      dispatch(login(username, password));
    }
  },[dispatch, userValidate])

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrorMessage("")
  };

  return (
    <div>
      <Header location="nav-all" />
      <Toaster />
      <div className="login-page">
        <div className="login-form">
          <h1 className="login-title">LOGIN</h1>
          {loading ? (
            <CircularProgress className="loader" />
          ) : (
            <form onSubmit={handleSubmit}>
              <label>Username</label>

              <TextField
                error={username.length > 0 && Boolean(userValidate === false)}
                helperText={
                  username.length > 0 &&
                  userValidate === false &&
                  "Invalid username"
                }
                required
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={handleUsername}
                color={userValidate && "success"}
              />

              <label>Password</label>
              <TextField
                error = {error && errorMessage.length > 0}
                helperText={ errorMessage.length > 0 && error && errorMessage }
                required
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePassword}
              />

              <div className="login-button">
                <Button
                  type="submit"
                  className="btn-check-availability-home"
                  text="Login"
                />
              </div>
            </form>
          )}
          <span>
            Login using Phone number?&nbsp;
            <LinkContainer
              to="/phonenumberlogin"
              style={{ textDecoration: "underline", color: "purple" }}
            >
              <span>login</span>
            </LinkContainer>
          </span>

          <span>
            Dont you have an Account?&nbsp;
            <LinkContainer
              to="/signup"
              style={{ textDecoration: "underline", color: "purple" }}
            >
              <span>signup</span>
            </LinkContainer>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
