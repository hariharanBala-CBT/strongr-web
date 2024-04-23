import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import "../css/checkoutscreen.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createBooking, listcustomerDetails,
} from "../actions/actions";
// import { BOOKING_CREATE_RESET } from '../constants/constants'
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

// import { useLocation } from 'react-router-dom';

function CheckoutScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { createBookingError, createBookingLoading, success, booking } = useSelector((state) => state.bookingCreate)

  const handleSubmit = (event) => {
    event.preventDefault();
    const placeOrder = () => {
      dispatch(
      createBooking({
        id: bookingData.id,
        userInfo: userInfo,
        phoneNumber: phoneNumber,
        date: bookingData.date,
        slotId: bookingData.slotId,
        courtId: bookingData.courtId,
        taxPrice: bookingData.taxPrice,
        totalPrice: bookingData.totalPrice,
      })
      )
    }
    placeOrder();
  };

  const { userInfo } = useSelector((state) => state.userLogin);
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const { bookingDetailsSuccess } = useSelector((state) => state.bookingDetails);

  const bookingDataJSON = localStorage.getItem("Bookingdata");
  const bookingData = JSON.parse(bookingDataJSON);

  useEffect(() => {
    if(bookingDetailsSuccess){
      navigate('/')
    }
  },[navigate, bookingDetailsSuccess])

  useEffect(() => {
    dispatch(listcustomerDetails(userInfo?.id))
  }, [userInfo, dispatch])
  
  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.first_name || "");
      setEmail(userInfo.email || "");
      setPhoneNumber(customerDetails?.phone_number || "");
    } else {
      navigate(-1);
    }
  }, [userInfo, navigate, setFirstName, setEmail, setPhoneNumber, customerDetails]);

  
  useEffect(() =>  {
    if(success && booking){
        navigate(`/booking/${booking.id}`);
    }else if(createBookingError){
      toast.error('Something went wrong..')
    }
  },[success, booking, navigate, createBookingError])

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
                  Name
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
              {/* <div>
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
              </div> */}
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
                required
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
                required
              />
              <label className="form-check-label" htmlFor="same-address">
                I agree to terms and conditions
                {/* <a href="" id="termsLink"> */}
                {/* </a> */}
              </label>
            </div>

            {createBookingLoading ? 
            <CircularProgress /> :
            <div className="button">
              <Button
                className="btn-check-availability-home"
                text="Proceed to Pay"
                type='submit'
              />
            </div>
            }
          </form>
        </div>

        <div className="card2">
          <h2>
            <span>Your Order</span>
          </h2>

          <div className="ul">
            <div className="li">
              <div>
                <h3>{bookingData.clubLocation?.organization?.organization_name}</h3>

                <small>
                  {bookingData.gameName}-{bookingData.selectedSlot}- 1 hrs
                </small>
              </div>
              <span>
                <i className="fa fa-inr"></i>
                {bookingData.clubPrice}
              </span>
            </div>
            <div className="li">
              <div>
                <h3>GST</h3>
                <small>state tax and Central tax</small>
              </div>
              <span>
                <i className="fa fa-inr"></i>
                {bookingData.taxPrice}
              </span>
            </div>
            <div className="li">
              <div>
                <h3>convenience Fee</h3>
                <small>Online booking fee</small>
              </div>
              <span>
                <i className="fa fa-inr"></i>
                {bookingData.bookingFee}
              </span>
            </div>
            <div className="li">
              <span>Total (INR)</span>
              <strong>
                <i className="fa fa-inr"></i>
                {bookingData.totalPrice}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutScreen;