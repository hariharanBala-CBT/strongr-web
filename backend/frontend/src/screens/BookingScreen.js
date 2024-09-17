import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { MapPin } from "react-feather";
import { MdSportsEsports } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Footer from "../components/Footer";

import venueImage from "../images/owner-venue2.jpg";

import { getBookingDetails } from "../actions/actions";
import { fixImageUrls } from "../utils/imageUtils";

import { BOOKING_CREATE_RESET } from "../constants/constants";

import "../css/bookingscreen.css";

function BookingScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation("bookingscreen");

  const { bookingDetails } = useSelector((state) => state.bookingDetails);
  const { success } = useSelector((state) => state.bookingCreate);
  const { userInfo } = useSelector((state) => state.userLogin);

  function getPaymentStatusText(status) {
    switch (status) {
      case 1:
        return t("pending");
      case 2:
        return t("initiated");
      case 3:
        return t("inProgress");
      case 4:
        return t("success");
      case 5:
        return t("cancelled");
      default:
        return t("unknown");
    }
  }

  function getBookingStatusText(status) {
    switch (status) {
      case 1:
        return t("pending");
      case 2:
        return t("booked");
      case 3:
        return t("cancelled");
      default:
        return t("unknown");
    }
  }

  useEffect(() => {
    dispatch(getBookingDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      toast.success(t("booked"));
      setTimeout(() => {
        dispatch({
          type: BOOKING_CREATE_RESET,
        });
      }, [1000]);
    }
  }, [success, dispatch, t]);

  useEffect(() => {
    fixImageUrls();
  }, [bookingDetails]);

  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      toast.success(t("message",{userName}), { duration: 4000 });
      localStorage.removeItem("userName");
    }
  }, [t]);

  return (
    <div className="booked-page">
      <Header location="nav-all" />
      <Toaster />
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round"></span>
        <div className="container">
          <h1 className="text-white">{t("bookedCourt")}</h1>
          <ul>
            <li className="breadcrumb-icons">
              <a href="/">{t("home")}</a>
            </li>
            <li className="breadcrumb-icons">
              <Link to="/clubs">
                {t("venueList")}
              </Link>
            </li>
            <li className="breadcrumb-icons">
              <Link to={`/club/${id}`}>
                {t("venueDetails")}
              </Link>
            </li>
            <li className="breadcrumb-icons">
              <Link to={`/bookinginfo/${id}`}>
                {t("bookACourt")}
              </Link>
            </li>
            <li className="breadcrumb-icons">
              <Link to={"/checkout"}>
                {t("checkout")}
              </Link>
            </li>
            <li>{t("bookedCourt")}</li>
          </ul>
        </div>
      </section>
      <div className="content booked-cage">
        <div className="container">
          <section className="card mb-40">
            <div className="text-center mb-40">
              <h3 className="mb-1">{t("orderConfirmation")}</h3>
              <p className="sub-title mb-0">
                {t("thankYou")}
              </p>
            </div>
            <div className="master-academy dull-whitesmoke-bg card">
              <div className="row d-flex align-items-center justify-content-center">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                  <div className="d-sm-flex justify-content-start align-items-center">
                    <div>
                      <img
                        className="corner-radius-10"
                        src={venueImage}
                        alt={t("venueAlt")}
                      />
                    </div>
                    <div className="info">
                    {bookingDetails?.rating ? (
                      <div className="d-flex justify-content-start align-items-center mb-3">
                        <span className="text-white dark-yellow-bg color-white me-2 d-flex justify-content-center align-items-center">
                          {bookingDetails.rating}
                        </span>
                        <span>
                          {t("reviews", { count: bookingDetails.num_ratings })}
                        </span>
                      </div>
                    ) : null}
                      <h3 className="mb-2">
                        {bookingDetails?.organization_name}
                      </h3>
                      <p>
                       {bookingDetails?.organization?.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                  <ul className="d-sm-flex align-items-center justify-content-evenly">
                    <li>
                      <h3 className="d-inline-block subtitle-txt">
                        <span>
                          <MapPin />
                        </span>
                        {bookingDetails?.area_name}
                      </h3>
                    </li>
                    <li>
                      <h3 className="d-inline-block subtitle-txt">
                        <span>
                          <MdSportsEsports size={25} />
                        </span>
                        {bookingDetails?.game_type}
                      </h3>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <section className="card booking-order-confirmation">
            <h5 className="mb-3">{t("bookingDetails")}</h5>
            <ul className="booking-info d-lg-flex justify-content-between align-items-center">
              <li>
                <h6>{t("courtName")}</h6>
                <p>{bookingDetails?.court?.name}</p>
              </li>
              <li>
                <h6>{t("appointmentDate")}</h6>
                <p>{bookingDetails?.booking_date}</p>
              </li>
              <li>
                <h6>{t("startTime")}</h6>
                <p>{bookingDetails?.slot?.start_time?.slice(0, 5)}</p>
              </li>
              <li>
                <h6>{t("endTime")}</h6>
                <p>{bookingDetails?.slot?.end_time?.slice(0, 5)}</p>
              </li>
              <li>
                <h6>{t("address")}</h6>
                <p>{bookingDetails?.organization_location}</p>
              </li>
            </ul>
            <h5 className="mb-3">{t("contactInfo")}</h5>
            <ul className="contact-info d-lg-flex justify-content-start align-items-center">
              <li>
                <h6>{t("name")}</h6>
                <p>{bookingDetails?.name}</p>
              </li>
              <li>
                <h6>{t("email")}</h6>
                <p>{userInfo?.email}</p>
              </li>
              <li>
                <h6>{t("phoneNumber")}</h6>
                <p>{bookingDetails?.phone_number}</p>
              </li>
              <li>
                <h6>{t("bookingStatus")}</h6>
                <p
                  className={
                    bookingDetails?.booking_status === 1
                      ? "pending-status"
                      : bookingDetails?.booking_status === 2
                      ? "booked-status"
                      : bookingDetails?.booking_status === 3 &&
                        "cancelled-status"
                  }
                >
                  {getBookingStatusText(bookingDetails?.booking_status)}
                </p>
              </li>
            </ul>
            <h5 className="mb-3">{t("paymentInfo")}</h5>
            <ul className="payment-info d-lg-flex justify-content-start align-items-center">
            <li>
                <h6>{t("amount")}</h6>
                <p className="primary-text">
                  {"\u20B9"} {bookingDetails?.amount}
                </p>
              </li>
              <li>
                <h6>{t("discountAmount")}</h6>
                <p className="primary-text">
                  {"\u20B9"} {bookingDetails?.discount_amount}
                </p>
              </li>
              <li>
                <h6>{t("gst")}</h6>
                <p className="primary-text">
                  {"\u20B9"} {bookingDetails?.tax_price}
                </p>
              </li>
              <li>
                <h6>{t("total")}</h6>
                <p className="primary-text">
                  {"\u20B9"} {bookingDetails?.total_price}
                </p>
              </li>
              <li>
              <h6>{t("coupon")}</h6>
              <p className="primary-text">
                {bookingDetails?.coupon_code ? (
                  <>
                    {bookingDetails.coupon_code} - {bookingDetails.coupon_discount}% discount
                  </>
                ) : (
                  t("noCouponApplied")
                )}
              </p>
            </li>
              <li>
                <h6>{t("paymentStatus")}</h6>
                <p
                  className={
                    bookingDetails?.payment_status === 1
                      ? "pending-status"
                      : bookingDetails?.payment_status === 2
                      ? "booked-status"
                      : bookingDetails?.payment_status === 3 &&
                        "cancelled-status"
                  }
                >
                  {getPaymentStatusText(bookingDetails?.payment_status)}
                </p>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BookingScreen;
