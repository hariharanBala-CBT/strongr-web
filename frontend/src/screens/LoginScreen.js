import React, { useEffect, useState } from "react";
import "../css/loginscreen.css";
import Header from "../components/Header";
import Button from "../components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/actions";
import Loader from '../components/Loader'
import Message from '../components/Message'

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <div>
      <Header location="nav-all" />
      <div className="login-page">
        <div className="login-form">
          <h1 className="login-title">LOGIN</h1>
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}
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
