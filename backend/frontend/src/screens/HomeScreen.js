import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from "react-hot-toast";
import { Form } from "react-bootstrap";
import "../css/homescreen.css";
import { brandName } from "../constants/constants";

import Header from "../components/Header";
import Button from "../components/Button";
import Message from "../components/Message";
import SelectInput from "../components/SelectInput";
import DateInput from "../components/DateInput";
import Venue from "../components/Venue";
import Footer from "../components/Footer";
import Testimonial from "../components/Testimonial";
import customerGuide from "../guide/customer.pdf";
import {
  listAreas,
  listGames,
  filterLocation,
  listOrganizations,
  getTopRatedClubs,
} from "../actions/actions";
import { useHomeContext } from "../context/HomeContext";
import { CircularProgress } from "@mui/material";
import { fixImageUrls } from "../utils/imageUtils";
import cockImage from "../images/icons/work-cock.svg";
import workImage from "../images/icons/work-icon1.svg";
import workImage2 from "../images/icons/work-icon2.svg";
import workImage3 from "../images/icons/work-icon3.svg";

function HomeScreen(history) {
  const { t } = useTranslation("homescreen");
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
  const { loadingTopRatedClubs, topRatedClubs } = useSelector(
    (state) => state.topRatedClubs
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
  const changeDate = (value) => {
    setDate(value);
  };

  useEffect(() => {
    if (localStorage.getItem("registrationSuccess") === "true") {
      toast.success(t("success", { brandName }), { duration: 4000 });
      localStorage.removeItem("registrationSuccess");
    }
  }, [t]);

  useEffect(() => {
    dispatch(listGames());
    dispatch(listAreas());
    dispatch(getTopRatedClubs());

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
      toast.error(t("errorFetchingAreas"));
    } else if (gameError) {
      toast.error(t("errorFetchingGames"));
    }
  }, [areaError, gameError]);

  useEffect(() => {
    fixImageUrls();
  }, [topRatedClubs]);

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
          <h1>{t("homeTitle")}</h1>
          <div>
            <Button
              onClick={handleClick}
              className="btn-explore"
              text={t("explore")}
            />
          </div>
        </div>
      </div>
      <section className="section work-section" ref={sectionRef}>
        <div className="work-img">
          <div className="work-img-right">
            <img src={cockImage} alt={t("iconAlt")}/>
          </div>
        </div>
        <div className="container">
          <div className="section-heading aos" data-aos="fade-up">

            <h2>
              {t("howIt")} <span>{t("works")}</span>
            </h2>
            <div className="guide-link">
              <a href={customerGuide} className="guide" target="_blank" rel="noopener noreferrer">{t("guide")}</a>
            </div>
            <p className="sub-title">
              {t("howItWorksSubtitle")}
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
                    <a href="javascript:void(0);">{t("joinUs")}</a>
                  </h5>
                  <p>
                    {t("joinUsDescription")}
                  </p>
                  <a className="btn" href="javascript:void(0);">
                  {t("registerNow")}{" "}
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
                    <img src={workImage2} alt={t("iconAlt")} />
                  </div>
                </div>
                <div className="work-content">
                  <h5>
                    <a href="javascript:void(0);">{t("selectCoachesVenues")}</a>
                  </h5>
                  <p>
                    {t("selectCoachesVenuesDescription")}
                  </p>
                  <a className="btn" href="javascript:void(0);">
                    {t("goToCoaches")}{" "}
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
                    <img src={workImage3} alt={t("iconAlt")} />
                  </div>
                </div>
                <div className="work-content">
                  <h5>
                    <a href="javascript:void(0);">{t("bookingProcess")}</a>
                  </h5>
                  <p>
                    {t("bookingProcessDescription")}
                  </p>
                  <a className="btn" href="javascript:void(0);">
                  {t("bookNow")}{" "}
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
          {t("best")} <span>{t("deals")}</span>
          </h2>
          <p className="sub-title">
          {t("bestDealsSubtitle")}
          </p>
        </div>
        <div className="form-section">
          <Form onSubmit={submitHandler} inline>
            <div className="search-bar-container">
              <label className="search-label">
                <input
                  type="search"
                  placeholder={t("search")}
                  className="form-control form-control-sm"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <i className="fas fa-search search-icon"></i>
              </label>
            </div>
          </Form>
          <div className="lines">
            <div className="or-line1"></div>
            {t("or")}
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
                label={t("gameLabel")}
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
                label={t("areaLabel")}
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
              label={t("dateLabel")}
              id="date"
              required="required"
              value={date}
              onChange={changeDate}
            />
          </div>
          <div className="availability-btn-class">
            <Button
              onClick={handleSubmit}
              className="btn-check-availability-home"
              text={t("checkAvailability")}
            />
          </div>
        </form>
      </section>
      {loadingTopRatedClubs ? (
        <CircularProgress />
      ) : topRatedClubs && topRatedClubs.length === 0 ? (
        <p>{t("noTopRatedClubs")}</p>
      ) : (
        <Venue />
      )}
      <Testimonial />
      <Footer />
    </div>
  );
}

export default HomeScreen;
