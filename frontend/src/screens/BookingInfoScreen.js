import React, { useEffect, useState } from "react";
import "../css/bookinginfoscreen.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
import SelectInput from "../components/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import { useHomeContext } from "../context/HomeContext";
import {
  BOOKING_CREATE_RESET,
  BOOKING_DETAILS_RESET,
} from "../constants/constants";
import {
  listclubLocation,
  listclubGame,
  listCourts,
  // createBooking,
  fetchAvailableSlots,
  login,
} from "../actions/actions";
import { Box, CircularProgress, Modal } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function BookingInfoScreen() {
  const {
    selectedDate,
    selectedArea,
    selectedGame,
    selectedCourt,
    setSelectedCourt,
    selectedSlot,
    setSelectedSlot,
  } = useHomeContext();

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { clubLocation } = useSelector((state) => state.Location);
  const { clubGame } = useSelector((state) => state.clubGame);
  const { courts } = useSelector((state) => state.courtList);
  const { slots } = useSelector((state) => state.slot);

  const [slot, setSlot] = useState("");
  const [areaName, setAreaName] = useState(selectedArea);
  const [gameName, setGameName] = useState(selectedGame);
  const [date, setDate] = useState(selectedDate);
  const [courtName, setCourtName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (courts?.length > 0) {
      setCourtName(courts[0].name);
    }
  }, [courts]);

  const handleAreaChange = (value) => {
    setAreaName(value);
  };

  const handleGameChange = (value) => {
    setGameName(value);
  };

  const handleSlotChange = (value) => {
    setSlot(value);
    setSelectedSlot(value);
  };

  const handleCourtChange = (value) => {
    setCourtName(value);
    setSelectedCourt(value);
  };

  const getSelectedGamePricing = () => {
    const selectedGame = clubGame?.find(
      (game) => game.game_type.game_name === gameName
    );
    return Number(selectedGame?.pricing).toFixed(0);
  };

  const { userInfo } = useSelector((state) => state.userLogin);

  const clubPrice = Number(getSelectedGamePricing()).toFixed(0);
  const taxPrice = (Number(clubPrice) * 0.05).toFixed(0);
  const bookingFee = 10;
  const totalPrice = (
    Number(clubPrice) +
    Number(taxPrice) +
    Number(bookingFee)
  ).toFixed(0);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  useEffect(() => {
    dispatch({ type: BOOKING_CREATE_RESET });
    dispatch({ type: BOOKING_DETAILS_RESET });
  }, [dispatch]);

  useEffect(() => {
    const storedSelectedGame = localStorage.getItem("selectedGame");
    const storedSelectedArea = localStorage.getItem("selectedArea");
    const storedSelectedDate = localStorage.getItem("selectedDate");
    const storedSelectedCourt = localStorage.getItem("selectedCourt");
    const storedSelectedSlot = localStorage.getItem("selectedSlot");

    if (storedSelectedGame) setGameName(storedSelectedGame);
    if (storedSelectedArea) setAreaName(storedSelectedArea);
    if (storedSelectedDate) setDate(storedSelectedDate);
    if (storedSelectedCourt) setCourtName(storedSelectedCourt);
    if (storedSelectedSlot) setCourtName(storedSelectedSlot);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(listclubLocation(id));
      dispatch(listclubGame(id));
      dispatch(listCourts(id, gameName));
    };
    fetchData();

    const dtToday = new Date();
    const month = dtToday.getMonth() + 1;
    const day = dtToday.getDate();
    const year = dtToday.getFullYear();
    const minDate = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;

    const dtMax = new Date(
      dtToday.getFullYear(),
      dtToday.getMonth() + 1,
      dtToday.getDate()
    );
    const maxYear = dtMax.getFullYear();
    const maxMonth = dtMax.getMonth() + 1;
    const maxDay = dtMax.getDate();
    const maxDate = `${maxYear}-${maxMonth < 10 ? "0" + maxMonth : maxMonth}-${
      maxDay < 10 ? "0" + maxDay : maxDay
    }`;

    const dateInput = document.getElementById("date");
    if (dateInput) {
      dateInput.setAttribute("min", minDate);
      dateInput.setAttribute("max", maxDate);
    }
  }, [dispatch, gameName, id]);

  useEffect(() => {
    const storedSelectedCourt = localStorage.getItem("selectedCourt");

    const sCourt = courts?.find((court) => court.name === storedSelectedCourt);
    const courtId = sCourt?.id;
    dispatch(fetchAvailableSlots(courtId, date));
  }, [date, dispatch, courts, courtName]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedSlot) {
      const parts = selectedSlot.split("-");
      const court = courts.find((court) => court.name === selectedCourt);
      const myslot = slots.find(
        (slot) => slot.start_time === parts[0] && slot.end_time === parts[1]
      );
      const courtId = court?.id;
      const slotId = myslot?.id;
      const formData = {
        id,
        clubLocation,
        areaName,
        gameName,
        date,
        totalPrice,
        bookingFee,
        taxPrice,
        clubPrice,
        courtId,
        userInfo,
        slotId,
        selectedSlot,
      };
      const formDataJSON = JSON.stringify(formData);
      localStorage.setItem("Bookingdata", formDataJSON);
      
      if(userInfo){
        setLoader(false);
        navigate("/checkout");
      }else{
        setLoader(false);
        setOpenForm(true);
      }
    }
  };

  const loginAndRedirect = (e) => {
    e.preventDefault();
    setLoader(true);
    dispatch(login(username, password));
    setUsername('')
    setPassword('')
    setLoader(true)
    setTimeout(() => {
      setLoader(false)
      setOpenForm(false)
    },1000)
  }

  useEffect(() => {
    if (slots) {
      setSlot(`${slots[0]?.start_time}-${slots[0]?.end_time}`);
      setSelectedSlot(`${slots[0]?.start_time}-${slots[0]?.end_time}`);
    }
  }, [slots, setSelectedSlot]);


  return (
    <div>
      <Header location="nav-all" />
      <Toaster />
      <div className="bookinginfo-content">
        <div className="card1">
          <div className="container-title">
            <h2>{clubLocation?.organization?.organization_name}</h2>
            <h3>{clubLocation?.area?.area_name}</h3>
          </div>

          <hr style={{ backgroundColor: "black" }} />
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="booking-container">
              <SelectInput
                id="area"
                value={areaName}
                onChange={handleAreaChange}
                disabled
                options={[
                  {
                    id: clubLocation?.area?.id,
                    area_name: clubLocation?.area?.area_name,
                  },
                ]}
                label="Area"
              />

              <SelectInput
                id="game"
                value={gameName}
                disabled
                onChange={handleGameChange}
                options={clubGame?.map((game) => ({
                  id: game.id,
                  game_name: game.game_type.game_name,
                }))}
                label="Game"
              />

              <DateInput id="date" value={date} onChange={handleDateChange} />

              <SelectInput
                id="court"
                value={courtName}
                onChange={handleCourtChange}
                options={courts?.map((court) => ({
                  id: court.id,
                  area_name: court.name,
                }))}
                label="Court"
              />

              <SelectInput
                id="slot"
                value={slot}
                onChange={handleSlotChange}
                options={slots?.map((slot) => ({
                  id: slot.id,
                  area_name: `${slot.start_time}-${slot.end_time}`,
                }))}
                label="slot"
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
                  {gameName} &nbsp;({getSelectedGamePricing()}
                  /hr)
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

          {!openForm && (
            <div className="button">
              <Button
                disabled={totalPrice < 60 || !(userInfo && userInfo.length > 0)}
                onClick={handleSubmit}
                className="btn-check-availability-home"
                text={userInfo ? 'Book now' : 'Login to Book'}
              />
            </div>
          )}
          
        </div>
      </div>

      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {loader ? (
          <Box sx={style} className="otp-loader">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={style}>
            <form onSubmit={loginAndRedirect} className="login-form">
            <h3 className="login-title">Login to continue Booking</h3>
              <label>Username</label>
              <input
                required
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
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

              <div className="login-button">
                <Button
                  type="submit"
                  className="btn-check-availability-home"
                  text="Login"
                />
              </div>
            </form>
          </Box>
        )}
      </Modal>
    </div>
  );
}

export default BookingInfoScreen;
