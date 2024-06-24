import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from "react-bootstrap";
import "../css/homescreen.css";
import Header from "../components/Header";
import Button from "../components/Button";
import Message from "../components/Message";
import SelectInput from "../components/SelectInput";
import DateInput from "../components/DateInput";
import {
  listAreas,
  listGames,
  filterLocation,
  listOrganizations,
} from "../actions/actions";
import { useHomeContext } from "../context/HomeContext";
import { CircularProgress } from "@mui/material";
import Footer from "../components/Footer";
import cockImage from "../images/icons/work-cock.svg";
import workImage from "../images/icons/work-icon1.svg";
import workImage2 from "../images/icons/work-icon2.svg";
import workImage3 from "../images/icons/work-icon3.svg";
import Venue from "../components/Venue";
import Testimonial from "../components/Testimonial";

function HomeScreen(history) {
  const dispatch = useDispatch();
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { setSelectedDate, setSelectedArea, setSelectedGame } =
    useHomeContext();

  const handleClick = () => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const { areaError, areaLoading, areas } = useSelector(
    (state) => state.areaList
  );
  const { gameError, gameLoading, games } = useSelector(
    (state) => state.gameList
  );

  const handleSubmit = (event) => {
    // event.preventDefault();
    dispatch(filterLocation(areaName, gameName, date));
    navigate("/clubs");
  };
  const { keyword, setKeyword } = useHomeContext();

  const [gameName, setGameName] = useState(games[0]?.game_name);
  const [areaName, setAreaName] = useState(areas[0]?.area_name);
  const [date, setDate] = useState();

  const changeGame = (value) => {
    setGameName(value);
  };
  const changeArea = (value) => {
    setAreaName(value);
  };
  const changeGate = (value) => {
    setDate(value);
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
    setDate(minDate);
  }, [dispatch]);

  useEffect(() => {
    setAreaName(areas[0]?.area_name);
    setGameName(games[0]?.game_name);
  }, [games, areas]);

  useEffect(() => {
    setSelectedGame(gameName);
    setSelectedArea(areaName);
    setSelectedDate(date);
  }, [
    gameName,
    areaName,
    date,
    setSelectedGame,
    setSelectedArea,
    setSelectedDate,
  ]);

  useEffect(() => {
    if (areaError) {
      toast.error("error in fetching areas");
    } else if (gameError) {
      toast.error("error in fetching games");
    }
  }, [areaError, gameError]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (keyword) {
        dispatch(listOrganizations(keyword));
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
    navigate("/clubsearch/");
  };

  return (
    <div className="home">
      <Header location="nav-home" />
      <Toaster />
      <div className="banner">
        <video autoPlay muted loop id="myVideo">
          <source
            src="https://cbtstrongr.s3.amazonaws.com/videos/sample-video.mp4"
            type="video/mp4"
          />
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
      <section className="section work-section" ref={sectionRef}>
        <div className="work-img">
          <div className="work-img-right">
            <img src={cockImage} alt="Icon" />
          </div>
        </div>
        <div className="container">
          <div className="section-heading aos" data-aos="fade-up">
            <h2>
              How It <span>Works</span>
            </h2>
            <p className="sub-title">
              Simplifying the booking process for coaches, venues, and athletes.
            </p>
          </div>
          <div className="row justify-content-center ">
            <div className="col-lg-4 col-md-6 d-flex">
              <div className="work-grid w-100 aos" data-aos="fade-up">
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <img src={workImage} alt="Icon" />
                  </div>
                </div>
                <div className="work-content">
                  <h5>
                    <a href="javascript:void(0);">Join Us</a>
                  </h5>
                  <p>
                    Quick and Easy Registration: Get started on our software
                    platform with a simple account creation process.
                  </p>
                  <a className="btn" href="javascript:void(0);">
                    Register Now{" "}
                    <span>
                      <ArrowRight />
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 d-flex">
              <div className="work-grid w-100 aos" data-aos="fade-up">
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <img src={workImage2} alt="Icon" />
                  </div>
                </div>
                <div className="work-content">
                  <h5>
                    <a href="javascript:void(0);">Select Coaches/Venues</a>
                  </h5>
                  <p>
                    Book Badminton coaches and venues for expert guidance and
                    premium facilities.
                  </p>
                  <a className="btn" href="javascript:void(0);">
                    Go To Coaches{" "}
                    <span>
                      <ArrowRight />
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 d-flex">
              <div className="work-grid w-100 aos" data-aos="fade-up">
                <div className="work-icon">
                  <div className="work-icon-inner">
                    <img src={workImage3} alt="Icon" />
                  </div>
                </div>
                <div className="work-content">
                  <h5>
                    <a href="javascript:void(0);">Booking Process</a>
                  </h5>
                  <p>
                    Easily book, pay, and enjoy a seamless experience on our
                    user-friendly platform.
                  </p>
                  <a className="btn" href="javascript:void(0);">
                    Book Now{" "}
                    <span>
                      <ArrowRight />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section1-container" id="section1-id">
        <div className="section-heading aos" data-aos="fade-up">
          <h2>
            Best <span>Deals</span>
          </h2>
          <p className="sub-title">
            We offer you the best grounds with best deals.
          </p>
        </div>
        <div className="form-section">
          <Form onSubmit={submitHandler} inline>
            <div className="search-bar-container">
              <FontAwesomeIcon className="search-icon" />
              <Form.Control
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                className="mr-sm-2 ml-sm-2 search-input"
                placeholder="Search..."
                // required
              />
            </div>
          </Form>
          <div className="lines">
            <div className="or-line1"></div>
            OR
            <div className="or-line2"></div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="check-availability-container-home">
            {gameLoading ? (
              <CircularProgress />
            ) : gameError ? (
              <Message variant="danger">{gameError}</Message>
            ) : (
              <SelectInput
                label="Game"
                id="gameName"
                value={gameName}
                onChange={changeGame}
                options={games?.map((game) => ({
                  id: game?.id,
                  name: game?.game_name,
                }))}
                required="required"
              />
            )}

            {areaLoading ? (
              <CircularProgress />
            ) : areaError ? (
              <Message variant="danger">{areaError}</Message>
            ) : (
              <SelectInput
                label="Area"
                id="areaName"
                value={areaName}
                onChange={changeArea}
                options={areas?.map((area) => ({
                  id: area?.id,
                  name: area?.area_name,
                }))}
                required="required"
              />
            )}

            <DateInput
              id="date"
              required="required"
              value={date}
              onChange={changeGate}
            />
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
      <Venue />
      <Testimonial />
      <Footer />
    </div>
  );
}

export default HomeScreen;
