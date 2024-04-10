import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  getBookingDetails,
  getCourt,
  listclubDetails,
  getSlotDetails,
} from "../actions/actions";
import toast, { Toaster } from "react-hot-toast";
import { BOOKING_CREATE_RESET } from "../constants/constants";
import "../css/bookingscreen.css";
import { Button } from "@mui/material";

function BookingScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookingDetails } = useSelector((state) => state.bookingDetails);
  const { court } = useSelector((state) => state.court);
  const { clubdetails } = useSelector((state) => state.clubDetails);
  const { slot } = useSelector((state) => state.slotDetails);
  const { success } = useSelector((state) => state.bookingCreate);

  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;

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
    if (bookingDetails?.court && bookingDetails?.slot) {
      dispatch(getCourt(bookingDetails?.court));
      dispatch(getSlotDetails(bookingDetails?.slot));
    }
  }, [dispatch, bookingDetails]);

  useEffect(() => {
    if (court) {
      dispatch(listclubDetails(court?.location));
    }
  }, [dispatch, court]);

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

  return (
    <div>
      <Header location="nav-all" />
      <Toaster />

      <div className="booking-content">
        <h2 style={{     display: 'flex', flex: 'auto', columnGap: '24rem' }}>
          <Button onClick={()=>{navigate(-1)}}>Back</Button>
          <span>Booking Number: &nbsp;{bookingDetails?.id}</span>
        </h2>

        <div className="card-1">
          <div className="ul booking">
            <div className="li">
              <div>
                <h3>{clubdetails?.organization_name}</h3>
              </div>
              <small>{court && court.name}</small>
            </div>
            <div className="li">
              <div>
                <h4>Badminton</h4>
                <strong>{slot && slot.days}&nbsp;&nbsp;</strong>
              </div>

                {slot && slot.start_time && (
                  <small>
                    <small>
                      {bookingDetails && bookingDetails.booking_date}&nbsp;&nbsp;
                    </small>
                    <small>
                      ({slot?.start_time?.slice(0, 5)}-
                      {slot?.end_time?.slice(0, 5)})
                    </small>
                  </small>
                )}
            </div>
            <div className="li">
              <div>
                <h4>GST</h4>
                <small>state tax and Central tax</small>
              </div>
              <span>
                <i className="fa fa-inr"></i>
                {bookingDetails?.tax_price}
              </span>
            </div>
            <div className="li">
              <h4>Total (INR)</h4>
              <strong>
                <i className="fa fa-inr"></i>
                {bookingDetails?.total_price}
              </strong>
            </div>
          </div>
          <div className="ul booking">
            <div className="li">
                <h3>{bookingDetails?.name}</h3>
                <small>{bookingDetails?.phone_number}</small>
            </div>
            <div className="li">
                <h4>Booking status</h4>
                <small>{getBookingStatusText(bookingDetails?.booking_status)}</small>
            </div>
            <div className="li">
                <h4>Payment status</h4>
                <small>{getPaymentStatusText(bookingDetails?.payment_status)}</small>
              <span>
                <i className="fa fa-inr"></i>
                {bookingDetails?.total_price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingScreen;
