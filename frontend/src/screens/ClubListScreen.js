import React, { useEffect, useState } from "react";
import "../css/clublistscreen.css";
import Header from "../components/Header";
import SelectInput from "../components/SelectInput";
import DateInput from "../components/DateInput";
import { useNavigate } from "react-router-dom";
// import Button from "../components/Button";
import Club from "../components/Club";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listAreas, listGames, filterLocation } from "../actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHomeContext } from '../context/HomeContext'
import { CircularProgress } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

function ClubListScreen() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedDate, selectedArea, selectedGame, setSelectedDate, setSelectedArea, setSelectedGame  } = useHomeContext();
  
  const { areaError, areaLoading, areas } = useSelector((state) => state.areaList);
  const { gameError, gameLoading, games } = useSelector((state) => state.gameList);
  const { clubFilterLoading, clubLocationDetails } = useSelector((state) => state.filterClubLocations);

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

  }, [areaName,gameName,date, setSelectedArea, setSelectedGame, setSelectedDate, dispatch]);

  useEffect(() => {
    if(areaError){
      toast.error('error in fetching areas')
    }else if(gameError) {
      toast.error('error in fetching games')
    }
  }, [areaError, gameError])

  return (
    <div>
      <Header location="nav-all" />
      <Toaster />
      <div className="form-section">
        <form onSubmit={handleSubmit}>
          <div className="check-availability-container-club">
            {gameLoading ? (
              <Loader />
            ) : gameError ? (
              <Message variant="danger">{gameError}</Message>
            ) : (
              <SelectInput
                label="game"
                value={gameName}
                onChange={(value) => setGameName(value)}
                options={games}
              />
            )}

            {areaLoading ? (
              <Loader />
            ) : areaError ? (
              <Message variant="danger">{areaError}</Message>
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
          
        </form>
      </div>
      <div className="club-list">
        {clubFilterLoading ? (
          <CircularProgress />
        ) : clubLocationDetails  && (
          <Club clubs={clubLocationDetails} />
        )}
      </div>
      <div className="clubs-error">
      {clubLocationDetails.length === 0 &&
        <h2>No clubs available :(</h2>
      }  
      </div>
        
    </div>
  );
}

export default ClubListScreen;