import React, { useEffect, useState } from "react";
import "../css/bookingscreen.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
// import Duration from "../components/Duration";
import SelectInput from "../components/SelectInput";
import { useDispatch, useSelector } from "react-redux";
// import DayTimePicker from "@mooncake-dev/react-day-time-picker";
// import ReactTimeslotCalendar from "react-timeslot-calendar";
import { useHomeContext } from "../context/HomeContext";
import {
  listclubLocation,
  listclubGame,
  listCourts,
  // createBooking,
  fetchAvailableSlots,
} from "../actions/actions";
// import styled from "styled-components";

// const Container = styled.div`
//   width: 330px;
//   margin: 1em auto;
//   padding: 1em;
//   background-color: #fff;
//   color: #333;
//   border: 1px solid #f0f0f0;
//   border-radius: 5px;
//   text-align: center;
//   box-shadow: 0 2px 4px #00000018;
//   @media (max-width: 520px) {
//     width: 50%;
//   }
// `;

function BookingScreen() {
  const {
    selectedDate,
    selectedArea,
    selectedGame,
    // selectedCourt,
    setSelectedCourt,
  } = useHomeContext();

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { clubLocation } = useSelector((state) => state.Location);
  const { clubGame } = useSelector((state) => state.clubGame);
  const { courts } = useSelector((state) => state.courtList);
  const { slots } = useSelector((state) => state.slot);

  // const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  // const [workingHours, setWorkingHours] = useState([]);
  const [slot, setSlot] = useState(null);
  const [areaName, setAreaName] = useState(selectedArea);
  const [gameName, setGameName] = useState(selectedGame);
  const [date, setDate] = useState(selectedDate);
  const [courtName, setCourtName] = useState("");

  const handleAreaChange = (value) => {
    setAreaName(value);
  };

  const handleGameChange = (value) => {
    setGameName(value);
  };

  const handleSlotChange = (value) => {
    setSlot(value);
    alert(value)
  };

  const handleCourtChange = (value) => {
    setCourtName(value);
    setSelectedCourt(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    navigate("/checkout", {
      state: {
        clubLocation,
        areaName,
        gameName,
        date,
        totalPrice,
        bookingFee,
        taxPrice,
        clubPrice,
        courts,
        userInfo,
        slot,
      },
    });
  };

  const getSelectedGamePricing = () => {
    const selectedGame = clubGame?.find(
      (game) => game.game_type.game_name === gameName
    );
    return Number(selectedGame?.pricing).toFixed(0);
  };

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const clubPrice = (Number(getSelectedGamePricing())).toFixed(0);
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
    const storedSelectedGame = localStorage.getItem("selectedGame");
    const storedSelectedArea = localStorage.getItem("selectedArea");
    const storedSelectedDate = localStorage.getItem("selectedDate");
    const storedSelectedCourt = localStorage.getItem("selectedCourt");

    if (storedSelectedGame) setGameName(storedSelectedGame);
    if (storedSelectedArea) setAreaName(storedSelectedArea);
    if (storedSelectedDate) setDate(storedSelectedDate);
    if (storedSelectedCourt) setCourtName(storedSelectedCourt);
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
    const maxDate = `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;

    const dateInput = document.getElementById("date");
    if (dateInput) {
      dateInput.setAttribute("min", maxDate);
    }
  }, [dispatch, gameName, id]);

  useEffect(() => {
    const sCourt = courts?.find((court) => court.name === courtName);
    const courtId = sCourt?.id;
    dispatch(fetchAvailableSlots(courtId, date));
  }, [date, courtName, dispatch, courts]);


  return (
    <div>
      <Header location="nav-all" />
      <div className="booking-content">
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
                  area_name: `${slot.start_time} - ${slot.end_time}`,
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
          <div className="button">
            <Button
              disabled={totalPrice < 60}
              onClick={handleSubmit}
              className="btn-check-availability-home"
              text="Book Now"
            />
          </div>
        </div>
        {/* <ReactTimeslotCalendar
          initialDate={selectedDate}
          onSelectTimeslot={onSelectTimeslot}
          let
          timeslots={[["1", "2"], ["2", "3"], ["4", "6"], "5", ["4"]]}
        /> */}
      </div>
    </div>
  );
}

export default BookingScreen;
