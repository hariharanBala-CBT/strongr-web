import React, { useEffect, useState } from "react";
import "../css/clublistscreen.css";
import Header from "../components/Header";
import SelectInput from "../components/SelectInput";
import DateInput from "../components/DateInput";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Club from "../components/Club";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listAreas, listGames, filterLocation } from "../actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHomeContext } from '../context/HomeContext'

function ClubListScreen() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedDate, selectedArea, selectedGame, setSelectedDate, setSelectedArea, setSelectedGame  } = useHomeContext();
  
  const areaList = useSelector((state) => state.areaList);
  const { areaerror, arealoading, areas } = areaList;

  const gameList = useSelector((state) => state.gameList);
  const { gameerror, gameloading, games } = gameList;

  const filterClubLocations = useSelector((state) => state.filterClubLocations);
  const { cluberror, clubloading, clubLocationDetails } = filterClubLocations;
  
  const [gameName, setGameName] = useState(selectedGame);
  const [areaName, setAreaName] = useState(selectedArea);
  const [date, setDate] = useState(selectedDate);

  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    dispatch(filterLocation(areaName, gameName, date));
    navigate("/clubs");
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  useEffect(() => {
    dispatch(listGames());
    dispatch(listAreas());
    const dtToday = new Date();
    const month = dtToday.getMonth() + 1;
    const day = dtToday.getDate();
    const year = dtToday.getFullYear();
    const maxDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    
    const dateInput = document.getElementById('date');
    if (dateInput) {
      dateInput.setAttribute('min', maxDate);
    }
  }, [dispatch]);

  useEffect(() => {
    const storedSelectedGame = localStorage.getItem("selectedGame");
    const storedSelectedArea = localStorage.getItem("selectedArea");
    const storedSelectedDate = localStorage.getItem("selectedDate");

    if (storedSelectedGame) setGameName(storedSelectedGame);
    if (storedSelectedArea) setAreaName(storedSelectedArea);
    if (storedSelectedDate) setDate(storedSelectedDate);
  }, []);
  
  useEffect(() => {
    setSelectedArea(areaName)
    setSelectedGame(gameName)
    setSelectedDate(date)
    dispatch(filterLocation(areaName, gameName, date));
  }, [areaName,gameName,date]);

  return (
    <div>
      <Header location="nav-all" />
      <div className="form-section">
        <form onSubmit={handleSubmit}>
          <div className="check-availability-container-club">
            {gameloading ? (
              <Loader />
            ) : gameerror ? (
              <Message variant="danger">{gameerror}</Message>
            ) : (
              <SelectInput
                label="game"
                value={gameName}
                onChange={(value) => setGameName(value)}
                options={games}
              />
            )}

            {arealoading ? (
              <Loader />
            ) : areaerror ? (
              <Message variant="danger">{areaerror}</Message>
            ) : (
              <SelectInput
                label="area"
                value={areaName}
                onChange={(value) => setAreaName(value)}
                options={areas}
              />
            )}

            <DateInput id="date" value={date} onChange={handleDateChange} />
          </div>
          {/* <div className="availability-btn-class">
            <Button
              onClick={handleSubmit}
              className="btn-check-availability-club"
              text="Check Availability"
            />
          </div> */}
        </form>
      </div>
      <div className="club-list">
        {clubloading ? (
          <Loader />
        ) : cluberror ? (
          <Message variant="danger">{cluberror}</Message>
        ) : filterClubLocations  ? (
          <Club clubs={clubLocationDetails} />
        ) : (
          <h2>No clubs available for selected day...</h2>
        )}
      </div>
    </div>
  );
}

export default ClubListScreen;
