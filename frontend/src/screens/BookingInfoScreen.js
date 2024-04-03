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
import { BOOKING_CREATE_RESET } from '../constants/constants'
// import SlotPicker from 'slotpicker'; 
import {
  listclubLocation,
  listclubGame,
  listCourts,
  // createBooking,
  fetchAvailableSlots,
} from "../actions/actions";

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

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

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
    dispatch({type: BOOKING_CREATE_RESET})
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
    const dtMax = new Date(dtToday.getTime() + 7 * 24 * 60 * 60 * 1000);
    const maxDate = `${dtMax.getFullYear()}-${(dtMax.getMonth() + 1).toString().padStart(2, '0')}-${dtMax.getDate().toString().padStart(2, '0')}`;


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
    if (date) {
      dispatch(fetchAvailableSlots(courtId, date));
    }
  }, [date, dispatch, courts]);

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(selectedSlot){
      alert(selectedSlot)
      const parts = selectedSlot.split("-");
      const court = courts.find((court) => court.name === selectedCourt);
      console.log(slots)
      const myslot = slots.find((slot) => slot.start_time === parts[0] && slot.end_time === parts[1]);
      console.log('slot',myslot)
  
      const courtId = court?.id;
      const slotId = myslot?.id;
      // alert(courtId);
      alert(slotId);
  
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
        selectedSlot
      };
  
      const formDataJSON = JSON.stringify(formData);
  
      localStorage.setItem("Bookingdata", formDataJSON);
  
      navigate("/checkout");
    }
  };

  useEffect(() => {
    if (slots) {
      setSlot(`${slots[0]?.start_time}-${slots[0]?.end_time}`);
      setSelectedSlot(`${slots[0]?.start_time}-${slots[0]?.end_time}`);
    }
  }, [slots,setSelectedSlot]);

  // useEffect(() => {
  //   const storedSelectedSlot = localStorage.getItem("selectedSlot");

  //   if (storedSelectedSlot) {
  //     setSlot(storedSelectedSlot);
  //   }
  // }, [selectedSlot]);

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
                  area_name: `${slot.start_time}-${slot.end_time}-${slot.id}`,
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
      </div>
      {/* <SlotPicker
        // Required, interval between two slots in minutes, 30 = 30 min
        interval={60}
        // Required, when user selects a time slot, you will get the 'from' selected value
        onSelectTime={(from) => console.log(from)}
        // Optional, array of unavailable time slots
        unAvailableSlots={["10:00", "15:30"]}
        // Optional, 8AM the start of the slots
        from={"08:00"}
        // Optional, 09:00PM the end of the slots
        to={"21:00"}
        // Optional, 01:00 PM, will be selected by default
        defaultSelectedTime={"13:00"}
        // Optional, selected slot color
        selectedSlotColor="#F00948"
        // Optional, language of the displayed text, default is english (en)
        lang="en"
      /> */}
    </div>
  );
}

export default BookingInfoScreen;
