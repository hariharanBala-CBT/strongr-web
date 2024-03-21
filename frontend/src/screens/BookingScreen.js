import React, { useEffect, useState } from "react";
import "../css/bookingscreen.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import DateInput from "../components/DateInput";
import Duration from "../components/Duration";
import SelectInput from "../components/SelectInput";
import { useDispatch, useSelector } from "react-redux";
import DayTimePicker from "@mooncake-dev/react-day-time-picker";
import { useHomeContext } from '../context/HomeContext'
import {
  listclubLocation,
  listclubGame,
  listclubWorking,
  listCourts,
  createBooking,
  fetchAvailableSlots,
} from "../actions/actions";
import styled from "styled-components";


const Container = styled.div`
  width: 330px;
  margin: 1em auto;
  padding: 1em;
  background-color: #fff;
  color: #333;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 2px 4px #00000018;
  @media (max-width: 520px) {
    width: 50%;
  }
`;

function BookingScreen() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [workingHours, setWorkingHours] = useState([]);
  const [courtName, setCourtName] = useState("");
  const [slot, setSlot] = useState(null);
  const { selectedDate, selectedArea, selectedGame  } = useHomeContext();  


  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setSelectedDay("");
    setSelectedTimeSlot("");
    dispatch(fetchAvailableSlots(id, date));
  };

  // const handleDayChange = (event) => {
  //   setSelectedDay(event.target.value);
  //   setSelectedTimeSlot("");
  // };

  const handleAreaChange = (e) => {
    setAreaName(e.target.value);
  };

  const handleGameChange = (e) => {
    setGameName(e.target.value);
  };

  const handleSlotChange = (event) => {
    setSlot(event.target.value);

    const selectedDayWorkingHours = workingHours.find(
      (hour) => hour.day === selectedDay
    );
    const slotWorkingHours = selectedDayWorkingHours?.slots.filter(
      (slot) => slot.startTime.toISOString() === event.target.value
    );

    setWorkingHours(slotWorkingHours || []);
  };

  const handleCourtChange = (e) => {
    setCourtName(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const bookingData = {
      locationId: clubLocation?.id,
      areaName,
      gameName,
      date,
      duration,
      courts,
      userInfo,
      slot,
    };

    dispatch(createBooking(bookingData));
    navigate("/checkout");
  };

  const { clubLocation } = useSelector((state) => state.Location);
  const { clubGame } = useSelector((state) => state.clubGame);
  const { courts } = useSelector((state) => state.courtList);
  const [areaName, setAreaName] = useState(selectedArea);
  const [gameName, setGameName] = useState(selectedGame);
  const [date, setDate] = useState(selectedDate);


  const getSelectedGamePricing = () => {
    const selectedGame = clubGame?.find(
      (game) => game.game_type.game_name === gameName
    );
    return Number(selectedGame?.pricing).toFixed(0);
  };

  const [duration, setDuration] = useState(1);

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
  };

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const clubPrice = (Number(getSelectedGamePricing()) * duration).toFixed(0);
  const taxPrice = (Number(clubPrice) * 0.05).toFixed(0);
  const bookingFee = 10;
  const totalPrice = (
    Number(clubPrice) +
    Number(taxPrice) +
    Number(bookingFee)
  ).toFixed(0);
  

  useEffect(() => {
    const storedSelectedGame = localStorage.getItem("selectedGame");
    const storedSelectedArea = localStorage.getItem("selectedArea");
    const storedSelectedDate = localStorage.getItem("selectedDate");

    if (storedSelectedGame) setGameName(storedSelectedGame);
    if (storedSelectedArea) setAreaName(storedSelectedArea);
    if (storedSelectedDate) setDate(storedSelectedDate);
  }, []);
  
  useEffect(() => {
    console.log("Available slots:", workingHours);
    const fetchData = async () => {
      dispatch(listclubLocation(id));
      dispatch(listclubGame(id));
      dispatch(listclubWorking(id));
      dispatch(listCourts(id, gameName));
    };
    const dtToday = new Date();
    const month = dtToday.getMonth() + 1;
    const day = dtToday.getDate();
    const year = dtToday.getFullYear();
    const maxDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    
    const dateInput = document.getElementById('date');
    if (dateInput) {
      dateInput.setAttribute('min', maxDate);
    }
    fetchData();
  }, [dispatch, id,gameName]);

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
                value={selectedTimeSlot}
                onChange={handleSlotChange}
                options={workingHours?.map((hour) => ({
                  id: hour.startTime.toISOString(),
                  slot_name: `${hour.startTime.toLocaleTimeString()} - ${hour.endTime.toLocaleTimeString()}`,
                }))}
                label="Time Slot"
              />

              <Duration
                id="hours"
                label="Duration"
                disabled={'disabled'}
                preventDefault
                onNumChange={handleDurationChange}
              />

              <Container>
                <DayTimePicker   timeSlotSizeMinutes={60} />
              </Container>


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
                  {gameName}- {duration} hrs &nbsp;({getSelectedGamePricing()}
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
      </div>
    </div>
  );
}

export default BookingScreen;
