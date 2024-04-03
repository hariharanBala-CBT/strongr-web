import React, { useEffect, useState } from "react";
import "../css/registerscreen.css";
import Header from "../components/Header";
import Button from "../components/Button";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/actions";

function RegisterScreen() {
  const navigate = useNavigate();
  // const location = useLocation();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // const redirect = location.search ? location.search.split("=")[1] : "/";

  // const userRegister = useSelector((state) => state.userRegister);
  // const { error, loading, userInfo } = userRegister;
  const { userInfo } = useSelector((state) => state.userLogin)

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(name, email, password, phoneNumber));
    }
  };

  return (
    <div>
      <Header location="nav-all" />
      <div className="signup-page">
        <div className="signup-form">
          <h1 className="signup-title">SIGN IN</h1>
          {message && <Message variant="danger">{message}</Message>}
          {/* {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />} */}
          <form onSubmit={handleSubmit} method="post">
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

            <div className="signup-button">
              <Button
                type="submit"
                className="btn-check-availability-home"
                text="signup"
              />
            </div>
          </form>
          <span>
            Already have an Account?&nbsp; <a href="/login"> Login</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
