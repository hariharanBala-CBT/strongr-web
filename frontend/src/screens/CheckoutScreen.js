import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import "../css/checkoutscreen.css";
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';

function CheckoutScreen() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/checkout");
  };

  const location = useLocation();
  const clubLocation = location.state.clubLocation;
  const gameName = location.state.gameName;
  const duration = location.state.duration;
  const clubPrice = location.state.clubPrice;
  const taxPrice = location.state.taxPrice;
  const bookingFee = location.state.bookingFee;
  const totalPrice = location.state.totalPrice;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      // Set initial values from userInfo
      setFirstName(userInfo.first_name || "");
      setLastName(userInfo.lastName || "");
      setEmail(userInfo.email || "");
      setPhoneNumber(userInfo.phoneNumber || "");
    }
  }, [userInfo, navigate]);

  return (
    <div>
      <Header location="nav-all" />
      <div className="title">
        <h1>Order Summary</h1>
      </div>

      <div className="checkout-content">
        <div className="card1">
          <div className="container-title">
            <h2>Billing Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="name">
              <div>
                <label htmlFor="firstName" className="form-label">
                  First name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder=""
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="form-label">
                  Last name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder=""
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="email-input">
              <label htmlFor="email" className="form-label">
                Email{" "}
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="phone-number">
              <label htmlFor="phone-number" className="form-label">
                Phone number{" "}
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone-number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <hr
              style={{
                backgroundColor: "black",
              }}
            />

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="same-address"
              />
              <label className="form-check-label" htmlFor="same-address">
                I agree to terms and conditions
                {/* <a href="" id="termsLink"> */}
                {/* </a> */}
              </label>
            </div>

            <div className="button">
              <Button
                onClick={handleSubmit}
                className="btn-check-availability-home"
                text="Proceed to Pay"
              />
            </div>
          </form>
        </div>

        <div className="card2">
          <h2>
            <span>Your Order</span>
          </h2>

          <div className="ul">
            <div className="li">
              <div>
                <h3>{clubLocation?.organization?.organization_name}</h3>

                <small>
                  {gameName}- {duration} hrs
                </small>
              </div>
              <span>
                <i className="fa fa-inr"></i>
                {clubPrice}
              </span>
            </div>
            <div className="li">
              <div>
                <h3>GST</h3>
                <small>state tax and Central tax</small>
              </div>
              <span>
                <i className="fa fa-inr"></i>
                {taxPrice}
              </span>
            </div>
            <div className="li">
              <div>
                <h3>convenience Fee</h3>
                <small>Online booking fee</small>
              </div>
              <span>
                <i className="fa fa-inr"></i>
                {bookingFee}
              </span>
            </div>
            <div className="li">
              <span>Total (INR)</span>
              <strong>
                <i className="fa fa-inr"></i>
                {totalPrice}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutScreen;