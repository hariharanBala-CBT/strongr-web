import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";

import { CircularProgress } from "@mui/material";

import {
  createBooking, listcustomerDetails,
} from "../actions/actions";

import "../css/checkoutscreen.css";

function CheckoutScreen() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation("checkoutscreen");

  const [firstName, setFirstName] = useState("");
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
        slotId: bookingData?.slotId,
        addSlotId : bookingData?.addSlotId,
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
    if (bookingDetailsSuccess) {
      navigate('/')
    }
  }, [bookingDetailsSuccess, navigate])

  useEffect(() => {
    dispatch(listcustomerDetails(userInfo?.id))
  }, [dispatch, userInfo])

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.first_name || "");
      setEmail(userInfo.email || "");
      setPhoneNumber(customerDetails?.phone_number || "");
    } else {
      navigate('/');
    }
  }, [customerDetails , navigate, setEmail, setFirstName, setPhoneNumber, userInfo]);


  useEffect(() => {
    if (success && booking) {
        navigate(`/booking/${booking.id}`);
    } else if (createBookingError) {
      toast.error(t("somethingWentWrong"))
    }
  }, [booking, createBookingError, navigate, success, t])

  return (
    <div>
      <Header location="nav-all" />
      <div className="title">
        <h1>{t("orderSummary")}</h1>
      </div>

      <div className="checkout-content">
        <div className="card1">
          <div className="container-title">
            <h2>{t("billingDetails")}</h2>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="name">
              <div>
                <label htmlFor="firstName" className="form-label">
                  {t("name")}
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
            </div>

            <div className="email-input">
              <label htmlFor="email" className="form-label">
                {t("email")}{" "}
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
                {t("phoneNumber")}{" "}
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
                {t("agreeTerms")}
              </label>
            </div>

            {createBookingLoading ?
            <CircularProgress /> :
            <div className="button">
              <Button
                className="btn-check-availability-home"
                text={t("proceedToPay")}
                type="submit"
              />
            </div>
            }
          </form>
        </div>

        <div className="card2">
          <h2>
            <span>{t("yourOrder")}</span>
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
                <h3>{t("gst")}</h3>
                <small>{t("stateAndCentralTax")}</small>
              </div>
              <span>
                <i className="fa fa-inr"></i>
                {bookingData.taxPrice}
              </span>
            </div>
            <div className="li">
              <div>
                <h3>{t("convenienceFee")}</h3>
                <small>{t("onlineBookingFee")}</small>
              </div>
              <span>
                <i className="fa fa-inr"></i>
                {bookingData.bookingFee}
              </span>
            </div>
            <div className="li">
              <span>{t("total")}</span>
              <strong>
                <i className="fa fa-inr"></i>
                {bookingData.totalPrice}
              </strong>
            </div>
          </div>
        </div>
      </div>
    <Footer/>
    </div>
  );
}

export default CheckoutScreen;