import React, { useState, useEffect } from "react";
import "../css/loginscreen.css";
import Header from "../components/Header";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/actions";
import toast, { Toaster } from "react-hot-toast";
import { CircularProgress } from "@mui/material";
// import { USER_LOGIN_RESET } from "../constants/constants";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userLoginSuccess } = userLogin;
  const {userInfo} = useSelector((state)=> state.userLogin)

  // useEffect(() => {
  //   dispatch({
  //     type: USER_LOGIN_RESET,
  //   })
  // }, [dispatch]);

  useEffect(() => {
    if(userLoginSuccess && userInfo){
      navigate(-1);
      console.log("userLoginSuccess:", userLoginSuccess);
    }
  }, [navigate, userInfo,userLoginSuccess]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
    // navigate(-1)
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div>
      <Header location="nav-all" />
      <Toaster />
      <div className="login-page">
        <div className="login-form">
          <h1 className="login-title">LOGIN</h1>
          {loading ? <CircularProgress className="loader" /> :
          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              required
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />

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

            <div className="login-button">
              <Button
                type="submit"
                className="btn-check-availability-home"
                text="Login"
              />
            </div>
          </form>
          }
          <span>
            Login using Phone number?&nbsp;
            <a href="/phonenumberlogin">login</a>
          </span>
          <span>
            Dont you have an Account?&nbsp;
            <a href="/signup">SignUp</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
