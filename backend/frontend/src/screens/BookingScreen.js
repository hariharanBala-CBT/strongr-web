import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { MapPin } from "react-feather";
import { MdSportsEsports } from "react-icons/md";
import { LinkContainer } from "react-router-bootstrap";
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
  const navigate = useNavigate();

  const { bookingDetails } = useSelector((state) => state.bookingDetails);
  const { success } = useSelector((state) => state.bookingCreate);
  const { userInfo } = useSelector((state) => state.userLogin);

  function getPaymentStatusText(status) {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Initiated";
      case 3:
        return "In Progress";
      case 4:
        return "Success";
      case 5:
        return "Cancelled";
      default:
        return "Unknown";
    }
  }

  function getBookingStatusText(status) {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Booked";
      case 3:
        return "Cancelled";
      default:
        return "Unknown";
    }
  }

  useEffect(() => {
    dispatch(getBookingDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      toast.success("Booked!");
      setTimeout(() => {
        dispatch({
          type: BOOKING_CREATE_RESET,
        });
      }, [1000]);
    }
  }, [success, dispatch]);

  useEffect(() => {
    fixImageUrls();
  }, [bookingDetails]);

  return (
    <div className="booked-page">
      <Header location="nav-all" />
      <Toaster />
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round"></span>
        <div className="container">
          <h1 className="text-white">Booked Court</h1>
          <ul>
            <li className="breadcrumb-icons">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-icons">
              <LinkContainer to="/clubs">
                <a>Venue List</a>
              </LinkContainer>
            </li>
            <li className="breadcrumb-icons">
              <LinkContainer to={`/club/${id}`}>
                <a>Venue Details</a>
              </LinkContainer>
            </li>
            <li className="breadcrumb-icons">
              <LinkContainer to={`/bookinginfo/${id}`}>
                <a>Book A Court</a>
              </LinkContainer>
            </li>
            <li className="breadcrumb-icons">
              <LinkContainer to={"/checkout"}>
                <a>Checkout</a>
              </LinkContainer>
            </li>
            <li>Booked Court</li>
          </ul>
        </div>
      </section>
      <div className="content booked-cage">
        <div className="container">
          <section className="card mb-40">
            <div className="text-center mb-40">
              <h3 className="mb-1">Order Confirmation</h3>
              <p className="sub-title mb-0">
                Thank you for your order! We're excited to fulfill it with care
                and efficiency.
              </p>
            </div>
            <div className="master-academy dull-whitesmoke-bg card">
              <div className="row d-flex align-items-center justify-content-center">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                  <div className="d-sm-flex justify-content-start align-items-center">
                    <a href="javascript:void(0);">
                      <img
                        className="corner-radius-10"
                        src={venueImage}
                        alt="Venue"
                      />
                    </a>
                    <div className="info">
                      <div className="d-flex justify-content-start align-items-center mb-3">
                        <span className="text-white dark-yellow-bg color-white me-2 d-flex justify-content-center align-items-center">
                          4.5
                        </span>
                        <span>300 Reviews</span>
                      </div>
                      <h3 className="mb-2">
                        {bookingDetails?.organization_name}
                      </h3>
                      <p>
                        {bookingDetails?.organization_name}: Where dreams meet
                        excellence in sports education and training.
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
            <h5 className="mb-3">Booking Details</h5>
            <ul className="booking-info d-lg-flex justify-content-between align-items-center">
              <li>
                <h6>Court Name</h6>
                <p>{bookingDetails?.court?.name}</p>
              </li>
              <li>
                <h6>Appointment Date</h6>
                <p>{bookingDetails?.booking_date}</p>
              </li>
              <li>
                <h6>Appointment Start time</h6>
                <p>{bookingDetails?.slot?.start_time?.slice(0, 5)}</p>
              </li>
              <li>
                <h6>Appointment End time</h6>
                <p>{bookingDetails?.slot?.end_time?.slice(0, 5)}</p>
              </li>
              <li>
              <div className="address-details">
                <h6>Address</h6>
                {bookingDetails?.organization_location?.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
              </div>
              </li>
            </ul>
            <h5 className="mb-3">Contact Information</h5>
            <ul className="contact-info d-lg-flex justify-content-start align-items-center">
              <li>
                <h6>Name</h6>
                <p>{bookingDetails?.name}</p>
              </li>
              <li>
                <h6>Contact Email Address</h6>
                <p>{userInfo?.email}</p>
              </li>
              <li>
                <h6>Phone Number</h6>
                <p>{bookingDetails?.phone_number}</p>
              </li>
              <li>
                <h6>Booking status</h6>
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
            <h5 className="mb-3">Payment Information</h5>
            <ul className="payment-info d-lg-flex justify-content-start align-items-center">
              <li>
                <h6>GST</h6>
                <p className="primary-text">
                  {"\u20B9"} {bookingDetails?.tax_price}
                </p>
              </li>
              <li>
                <h6>Total (INR)</h6>
                <p className="primary-text">
                  {"\u20B9"} {bookingDetails?.total_price}
                </p>
              </li>
              <li>
                <h6>Payment status</h6>
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
