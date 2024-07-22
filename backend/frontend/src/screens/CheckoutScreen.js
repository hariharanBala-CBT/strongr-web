import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { LinkContainer } from "react-router-bootstrap";
import Header from "../components/Header";
import Button from "../components/Button";
import Footer from "../components/Footer";

import { CircularProgress } from "@mui/material";

import { createBooking, listcustomerDetails } from "../actions/actions";

import "../css/checkoutscreen.css";

function CheckoutScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation("checkoutscreen");

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const { createBookingError, createBookingLoading, success, booking } =
    useSelector((state) => state.bookingCreate);

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
          addSlotId: bookingData?.addSlotId,
          courtId: bookingData.courtId,
          taxPrice: bookingData.taxPrice,
          totalPrice: bookingData.totalPrice,
        })
      );
    };
    placeOrder();
  };

  const { userInfo } = useSelector((state) => state.userLogin);
  const { customerDetails } = useSelector((state) => state.customerDetails);
  const { bookingDetailsSuccess } = useSelector(
    (state) => state.bookingDetails
  );

  const bookingDataJSON = localStorage.getItem("Bookingdata");
  const bookingData = JSON.parse(bookingDataJSON);

  useEffect(() => {
    if (bookingDetailsSuccess) {
      navigate("/");
    }
  }, [bookingDetailsSuccess, navigate]);

  useEffect(() => {
    dispatch(listcustomerDetails(userInfo?.id));
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.first_name || "");
      setEmail(userInfo.email || "");
      setPhoneNumber(customerDetails?.phone_number || "");
    } else {
      navigate("/");
    }
  }, [
    customerDetails,
    navigate,
    setEmail,
    setFirstName,
    setPhoneNumber,
    userInfo,
  ]);

  useEffect(() => {
    if (success && booking) {
      navigate(`/booking/${booking.id}`);
    } else if (createBookingError) {
      toast.error(t("somethingWentWrong"))
    }
  }, [booking, createBookingError, navigate, success, t])

  return (
    <div className="checkout-page">
      <Header location="nav-all" />
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round"></span>
        <div className="container">
          <h1 className="text-white">{t("checkout")}</h1>
          <ul>
            <li className="breadcrumb-icons">
              <a href="/">{t("home")}</a>
            </li>
            <li className="breadcrumb-icons">
              <LinkContainer to="/clubs">
                <a>{t("venueList")}</a>
              </LinkContainer>
            </li>
            <li className="breadcrumb-icons">
              <LinkContainer to={`/club/${bookingData.id}`}>
                <a>{t("venueDetails")}</a>
              </LinkContainer>
            </li>
            <li className="breadcrumb-icons">
              <LinkContainer to={`/bookinginfo/${bookingData.id}`}>
                <a>{t("bookACourt")}</a>
              </LinkContainer>
            </li>
            <li>{t("checkout")}</li>
          </ul>
        </div>
      </section>
      <div className="content billing-cage">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6">
              <div className="checkout-card booking-details box-min-height">
                <h3 className="border-bottom">{t("billingDetails")}</h3>
                <form onSubmit={handleSubmit} className="checkout-form">
                  <div className="input-wrapper">
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

                  <div className="input-wrapper">
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

                  <div className="input-wrapper">
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
                      backgroundColor: "#dee2e6",
                    }}
                  />

                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="same-address"
                      required
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="same-address">
                      {t("agreeTerms")}
                      {/* <a href="" id="termsLink"> */}
                      {/* </a> */}
                    </label>
                  </div>

                  {createBookingLoading ? (
                    <CircularProgress />
                  ) : (
                    <div className="d-grid btn-block">
                      <Button
                        className="btn btn-primary"
                        text={t("proceedToPay")}
                        type="submit"
                      />
                    </div>
                  )}
                </form>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6">
              <aside className="checkout-card booking-details box-min-height">
                <h3 className="border-bottom">{t("yourOrder")}</h3>
                <div className="card2">
                  <ul className="order-sub-total">
                    <div className="orderset1">
                      <li>
                        <h3>
                          {
                            bookingData.clubLocation?.organization
                              ?.organization_name
                          }
                        </h3>
                        <h6>
                          {"\u20B9"} {bookingData.clubPrice}
                        </h6>
                      </li>
                      <p>
                        {bookingData.gameName}-{bookingData.selectedSlot}- 1 hrs
                      </p>
                    </div>
                    <div className="orderset2">
                      <li>
                        <h3>{t("gst")}</h3>
                        <h6>
                          {"\u20B9"} {bookingData.taxPrice}
                        </h6>
                      </li>
                      <p>{t("stateAndCentralTax")}</p>
                    </div>
                    <div className="orderset3">
                      <li>
                        <h3>{t("convenienceFee")}</h3>
                        <h6>
                          {"\u20B9"} {bookingData.bookingFee}
                        </h6>
                      </li>
                      <p>{t("onlineBookingFee")}</p>
                    </div>
                  </ul>
                  <div className="order-total d-flex justify-content-between align-items-center">
                    <h5>{t("total")}</h5>
                    <h5>
                      {"\u20B9"} {bookingData.totalPrice}
                    </h5>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutScreen;
