import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
    <div>
      <Header location="nav-all" />
      <Toaster />
      <div className="password-page">
        <div className="password-form">
          <h2 className="password-title">Reset password</h2>
          {/* {loading ? <CircularProgress className="loader" /> : */}

          <form onSubmit={handleSubmit}>
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

            <label>Password</label>
            <input
              required
              type="password"
              placeholder="Enter password Again"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />

            <div className="password-button">
              <Button
                type="submit"
                className="btn-check-availability-home"
                text="Reset password"
              />
            </div>
          </form>
          {/* } */}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
