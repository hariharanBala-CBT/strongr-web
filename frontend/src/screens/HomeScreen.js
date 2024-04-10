import React, { useEffect, useRef, useState } from "react";
import "../css/homescreen.css";
import Header from "../components/Header";
import Button from "../components/Button";
import Message from "../components/Message";
// import SearchBar from "../components/SearchBar";
import SelectInput from "../components/SelectInput";
import DateInput from "../components/DateInput";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  listAreas,
  listGames,
  filterLocation,
} from "../actions/actions";
import { useHomeContext } from '../context/HomeContext'
import { CircularProgress } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";


function HomeScreen() {
  const dispatch = useDispatch();
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { setSelectedDate, setSelectedArea, setSelectedGame  } = useHomeContext();


  const handleClick = () => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const { areaError, areaLoading, areas } = useSelector((state) => state.areaList);
  const { gameError, gameLoading, games } = useSelector((state) => state.gameList);
  
  const handleSubmit = (event) => {
    // event.preventDefault();
    dispatch(filterLocation(areaName, gameName, date));
    navigate("/clubs");
  };

  const [gameName, setGameName] = useState(games[0]?.game_name);
  const [areaName, setAreaName] = useState(areas[0]?.area_name);
  const [date, setDate] = useState();

  const changeGame = (value) => {
    setGameName(value)
  }
  const changeArea = (value) => {
    setAreaName(value)
  }
  const changeGate = (value) => {
    setDate(value)
  }
  
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
    setDate(minDate);
  }, [dispatch]);

  useEffect(() => {
    setAreaName(areas[0]?.area_name)
    setGameName(games[0]?.game_name)
  }, [games, areas]);
  
  useEffect(() => {
    setSelectedGame(gameName)
    setSelectedArea(areaName)
    setSelectedDate(date)
  }, [gameName, areaName, date, setSelectedGame, setSelectedArea, setSelectedDate]);

  useEffect(() => {
    if(areaError){
      toast.error('error in fetching areas')
    }else if(gameError) {
      toast.error('error in fetching games')
    }
  }, [areaError, gameError])

  return (
    <div className="home">
      <Header location="nav-home" />
      <Toaster />
      <div className="banner">
        <video autoPlay muted loop id="myVideo">
          <source src="/videos/sample-video.mp4" type="video/mp4" />
        </video>
        <div className="content">
          <h1>Fuel your spirit, lit your soul</h1>
          <div>
            <Button
              onClick={handleClick}
              className="btn-explore"
              text="Explore"
            />
          </div>
        </div>
      </div>

      <section ref={sectionRef} className="section1-container" id="section1-id">
        <div>
          <h1 style={{ color: "black" }}>
            We offer you the best Grounds <br />
            with <span style={{ color: "midnightblue" }}>best deals.</span>
          </h1>
        </div>

        {/* <SearchBar placeholder="Area / Clubs / Locations" /> */}

        {/* <div className="lines">
          <div className="or-line1"></div>
          OR
          <div className="or-line2"></div>
        </div> */}

        <form onSubmit={handleSubmit} style={{ marginTop : '8rem' }}>
          <div className="check-availability-container-home">
          {gameLoading ? (
              <CircularProgress />
            ) : gameError ? (
              <Message variant="danger">{gameError}</Message>
            ) : (
              <SelectInput
                label="game"
                id="gameName"
                value={gameName}
                onChange={changeGame}
                options={games}
                required='required'
              />
            )}
            
            {areaLoading ? (
              <CircularProgress />
            ) : areaError ? (
              <Message variant="danger">{areaError}</Message>
            ) : (
            <SelectInput
              label="area"
              id="areaName"
              value={areaName}
              onChange={changeArea}
              options={areas}
              required='required'
            />)}

            <DateInput id="date" required='required' value={date} onChange={changeGate} />

          </div>
          <div className="availability-btn-class">
            <Button
              onClick={handleSubmit}
              className="btn-check-availability-home"
              text="Check Availability"
            />
          </div>
        </form>
      </section>
    </div>
  );
}

export default HomeScreen;