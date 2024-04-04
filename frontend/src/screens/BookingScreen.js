import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
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

function BookingScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { booking } = useSelector((state) => state.bookingDetails);
  const { court } = useSelector((state) => state.court);
  const { clubdetails } = useSelector((state) => state.clubDetails);
  const { slot } = useSelector((state) => state.slotDetails);
  const { success } = useSelector((state) => state.bookingCreate)

  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(getBookingDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (booking?.court && booking?.slot) {
      dispatch(getCourt(booking?.court));
      dispatch(getSlotDetails(booking?.slot));
    }
  }, [dispatch, booking]);

  useEffect(() => {
    if (court) {
      dispatch(listclubDetails(court.location));
    }
  }, [dispatch, court]);

  useEffect(() => {
    if(success){
      toast.success('Booked!')
      setTimeout(() => {
        dispatch({
          type: BOOKING_CREATE_RESET,
        })
      },[1000])
    }
  },[success, dispatch])

  return (
    <div>
      <Header location="nav-all" />
      <Toaster />
      <div className="title">
        <h1>Booking Summary</h1>
      </div>

      <div className="checkout-content">
        <div className="card1">
          <div className="container-title">
            <h2>Booking No:{booking.id}</h2>
          </div>

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
                value={booking.name}
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
              value={booking.email}
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
              value={booking.phone_number}
              required
            />
          </div>
        </div>

        <div className="card2">
          <h2>
            <span>Your Order</span>
          </h2>

          <div className="ul">
            <div className="li">
              <div>
                <h3>{clubdetails?.organization_name}</h3>

                {slot && slot.start_time &&
                <small>
                  {court && court.name}-{slot && slot.days}-1 hrs  {(slot.start_time)}-{(slot.end_time)}
                </small>
                }
              </div>
            </div>
            <div className="li">
              <div>
                <h3>GST</h3>
                <small>state tax and Central tax</small>
              </div>
              <span>
                <i className="fa fa-inr"></i>
                {booking.tax_price}
              </span>
            </div>
            <div className="li">
              <h3>Total (INR)</h3>
              <strong>
                <i className="fa fa-inr"></i>
                {booking.total_price}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingScreen;
