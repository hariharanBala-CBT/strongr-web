import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { LinkContainer } from "react-router-bootstrap";

import { useHomeContext } from "../context/HomeContext";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
import SelectInput from "../components/SelectInput";

import { Alert, Box, CircularProgress, Modal } from "@mui/material";

import {
  fetchAdditionalSlots,
  fetchUnAvailableSlots,
  fetchAvailableSlots,
  listclubLocation,
  listclubGame,
  listCourts,
  listclubWorking,
  login,
} from "../actions/actions";

import {
  BOOKING_CREATE_RESET,
  BOOKING_DETAILS_RESET,
} from "../constants/constants";

import "../css/bookinginfoscreen.css";

const linkStyle = {
  textDecoration: "underline",
  color: "purple",
  cursor: "pointer",
};

const boxStyle = {
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
    setSelectedGame,
    setSelectedArea,
    setSelectedDate,
  } = useHomeContext();

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { clubLocation } = useSelector((state) => state.Location);
  const { clubGame } = useSelector((state) => state.clubGame);
  const { courts } = useSelector((state) => state.courtList);
  const { clubWorking } = useSelector((state) => state.clubWorking);
  const { slots } = useSelector((state) => state.slot);
  const { additionalSlots } = useSelector((state) => state.additionalSlot);
  const { unavailableSlots } = useSelector((state) => state.unavailableSlot);
  const { userInfo, LoginError, userLoginSuccess } = useSelector(
    (state) => state.userLogin
  );

  const [slot, setSlot] = useState("");
  const [areaName, setAreaName] = useState(selectedArea);
  const [gameName, setGameName] = useState(selectedGame);
  const [date, setDate] = useState(selectedDate);
  const [courtName, setCourtName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const getSelectedGamePricing = () => {
    const selectedGame = clubGame?.find(
      (game) => game.game_type.game_name === gameName
    );
    return Number(selectedGame?.pricing).toFixed(0);
  };

  const clubPrice = Number(getSelectedGamePricing()).toFixed(0);
  const taxPrice = (Number(clubPrice) * 0.05).toFixed(0);
  const bookingFee = 10;
  const totalPrice = (
    Number(clubPrice) +
    Number(taxPrice) +
    Number(bookingFee)
  ).toFixed(0);

  const handleAreaChange = (value) => {
    setAreaName(value);
  };

  const handleGameChange = (value) => {
    setGameName(value);
  };

  const handleSlotChange = (value) => {
    setSlot(value);
  };

  const handleCourtChange = (value) => {
    setCourtName(value);
  };

  const handleDateChange = (value) => {
    setDate(value);
  };

  useEffect(() => {
    dispatch({ type: BOOKING_CREATE_RESET });
    dispatch({ type: BOOKING_DETAILS_RESET });

    const fetchData = async () => {
      dispatch(listclubLocation(id));
      dispatch(listclubGame(id));
      dispatch(listCourts(id, gameName));
      dispatch(listclubWorking(id));
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
    if (courts?.length > 0 && courtName === "") {
      setCourtName(courts[0]?.name);
    }
  }, [courts, courtName]);

  useEffect(() => {
    if (courtName && date) {
      setLoading(true);
      const theCourt = courts?.find((court) => court.name === courtName);
      const courtId = theCourt?.id;
      dispatch(fetchAvailableSlots(courtId, date)).then(() =>
        setLoading(false)
      );
      dispatch(fetchAdditionalSlots(courtId, date));
      dispatch(fetchUnAvailableSlots(courtId, date));
    }
  }, [courtName, date, dispatch, courts, clubWorking]);

  useEffect(() => {
    const storedSelectedGame = localStorage.getItem("selectedGame");
    const storedSelectedArea = localStorage.getItem("selectedArea");
    const storedSelectedDate = localStorage.getItem("selectedDate");

    const matchingGame = clubGame?.find(
      (game) => game.game_type.game_name === storedSelectedGame
    );

    if (storedSelectedArea) {
      setAreaName(storedSelectedArea);
    } else {
      setAreaName(clubLocation?.area?.area_name);
    }
    if (courts) {
      setCourtName(courts && courts[0]?.name);
    }

    if (matchingGame) {
      setGameName(storedSelectedGame);
    } else if (clubGame?.length > 0) {
      setGameName(clubGame[0]?.game_type?.game_name);
    }

    if (storedSelectedDate) {
      setDate(storedSelectedDate);
    } else {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const todayFormatted = `${year}-${month}-${day}`;
      setDate(todayFormatted);
    }
  }, [clubGame, clubLocation, courts]);

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
      let addslot = null;
      if (!slotId) {
        addslot = additionalSlots.find(
          (slot) => slot.start_time === parts[0] && slot.end_time === parts[1]
        );
      }

      const addSlotId = addslot?.id;
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
        addSlotId,
        selectedSlot,
      };
      const formDataJSON = JSON.stringify(formData);
      localStorage.setItem("Bookingdata", formDataJSON);

      if (userInfo) {
        if (slots?.length > 0 || additionalSlots?.length > 0) {
          setLoader(false);
          navigate("/checkout");
        } else {
          toast.error("select a slot to book");
        }
      } else {
        setLoader(false);
        setOpenForm(true);
      }
    }
  };

  const loginAndRedirect = (e) => {
    e.preventDefault();
    setIsLogin(true);
    setLoader(true);
    dispatch(login(username, password));
    setUsername("");
    setPassword("");
    setLoader(true);
  };

  useEffect(() => {
    if (slots?.length > 0) {
      setSlot(`${slots[0]?.start_time}-${slots[0]?.end_time}`);
      setSelectedSlot(`${slots[0]?.start_time}-${slots[0]?.end_time}`);
      setLoading(false);
    }
  }, [courts, slots, setSelectedSlot]);

  useEffect(() => {
    if (additionalSlots?.length > 0 && slots?.length === 0) {
      setSlot(
        `${additionalSlots[0]?.start_time}-${additionalSlots[0]?.end_time}`
      );
      setSelectedSlot(
        `${additionalSlots[0]?.start_time}-${additionalSlots[0]?.end_time}`
      );
      setLoading(false);
    }
  }, [courts, additionalSlots, setSelectedSlot, slots]);

  useEffect(() => {
    setSelectedArea(areaName);
    setSelectedGame(gameName);
    setSelectedDate(date);
    setSelectedCourt(courtName);
    setSelectedSlot(slot);
  }, [
    areaName,
    gameName,
    date,
    courtName,
    slot,
    setSelectedArea,
    setSelectedGame,
    setSelectedDate,
    setSelectedCourt,
    setSelectedSlot,
  ]);

  useEffect(() => {
    if (LoginError && isLogin) {
      toast.error("Incorrect Credentials");
      setOpenForm(true);
      setLoader(false);
      setIsLogin(false);
    }
  }, [isLogin, LoginError]);

  useEffect(() => {
    if (userLoginSuccess && isLogin) {
      toast.success("Logged in successfully");
      setOpenForm(false);
      setIsLogin(false);
    }
  }, [isLogin, userLoginSuccess]);

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
                    name: clubLocation?.area?.area_name,
                  },
                ]}
                label="Area"
              />
              <SelectInput
                id="game"
                value={gameName}
                // disabled
                onChange={handleGameChange}
                options={clubGame?.map((game) => ({
                  id: game?.id,
                  name: game?.game_type?.game_name,
                }))}
                label="Game"
              />
              <DateInput id="date" value={date} onChange={handleDateChange} />
              {loading ? (
                <CircularProgress />
              ) : (
                <SelectInput
                  id="court"
                  value={courtName}
                  onChange={handleCourtChange}
                  options={courts?.map((court) => ({
                    id: court.id,
                    name: court.name,
                  }))}
                  label="Court"
                />
              )}
              {loading ? (
                <div>Loading slots...</div>
              ) : slots?.length !== 0 || additionalSlots?.length !== 0 ? (
                <SelectInput
                  id="slot"
                  value={slot}
                  onChange={handleSlotChange}
                  options={slots?.map((slot) => ({
                    id: slot.id,
                    name: `${slot.start_time}-${slot.end_time}`,
                  }))}
                  label="slot"
                  addSlots={additionalSlots?.map((slot) => ({
                    id: slot.id,
                    name: `${slot.start_time}-${slot.end_time}`,
                  }))}
                  removeSlots={unavailableSlots?.map((slot) => ({
                    id: slot.id,
                    name: `${slot.start_time}-${slot.end_time}`,
                  }))}
                />
              ) : (
                <Alert severity="error">
                  No slots available in {courtName}
                </Alert>
              )}
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
                text="Book now"
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
          <Box sx={boxStyle} className="otp-loader">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={boxStyle}>
            <Alert severity="info">You are one step away from booking</Alert>
            <form onSubmit={loginAndRedirect} className="booking-login-form">
              <h2 className="login-title">Login</h2>

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
              <span>Don't have an account?</span>
              <LinkContainer to="/signup" style={linkStyle}>
                <span>Signup</span>
              </LinkContainer>
            </form>
          </Box>
        )}
      </Modal>
      <Footer name="bookinginfo-f" />
    </div>
  );
}

export default BookingInfoScreen;
