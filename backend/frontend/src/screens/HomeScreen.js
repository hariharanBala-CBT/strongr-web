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
  getTopRatedClubs,
} from "../actions/actions";
import { useHomeContext } from "../context/HomeContext";
import { CircularProgress } from "@mui/material";
import { fixImageUrls } from "../utils/imageUtils";
import Footer from "../components/Footer";
import cockImage from "../images/icons/work-cock.svg";
import workImage from "../images/icons/work-icon1.svg";
import workImage2 from "../images/icons/work-icon2.svg";
import workImage3 from "../images/icons/work-icon3.svg";
import Venue from "../components/Venue";
import Testimonial from "../components/Testimonial";
import { useTranslation } from "react-i18next";

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
  const changeGate = (value) => {
    setDate(value);
  };

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
      toast.error("error in fetching areas");
    } else if (gameError) {
      toast.error("error in fetching games");
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
          <h1>{t("home_title")}</h1>
          <div>
            <Button
              onClick={handleClick}
              className="btn-explore"
              text={t("explore_button")}
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
              {t("how_it_works_title")} <span>{t("works")}</span>
            </h2>
            <p className="sub-title">
              {t("how_it_works_subtitle")}
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
                    <a href="javascript:void(0);">{t("join_us_title")}</a>
                  </h5>
                  <p>
                    {t("join_us_description")}
                  </p>
                  <a className="btn" href="javascript:void(0);">
                  {t("register_now_button")}{" "}
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
                    <a href="javascript:void(0);">{t("select_coaches_venues_title")}</a>
                  </h5>
                  <p>
                    {t("select_coaches_venues_description")}
                  </p>
                  <a className="btn" href="javascript:void(0);">
                    {t("go_to_coaches_button")}{" "}
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
                    <a href="javascript:void(0);">{t("booking_process_title")}</a>
                  </h5>
                  <p>
                    {t("booking_process_description")}
                  </p>
                  <a className="btn" href="javascript:void(0);">
                  {t("book_now_button")}{" "}
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
          {t("best_deals_title")} <span>{t("deals")}</span>
          </h2>
          <p className="sub-title">
          {t("best_deals_subtitle")}
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
                placeholder={t("search_placeholder")}
                // required
              />
            </div>
          </Form>
          <div className="lines">
            <div className="or-line1"></div>
            {t("or_text")}
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
                label={t("game_label")}
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
                label={t("area_label")}
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
              label={t("date_label")}
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
              text={t("check_availability_button")}
            />
          </div>
        </form>
      </section>
      {loadingTopRatedClubs ? (
        <CircularProgress />
      ) : topRatedClubs && topRatedClubs.length === 0 ? (
        <p>{t("no_top_rated_clubs")}</p>
      ) : (
        <Venue />
      )}
      <Testimonial />
      <Footer />
    </div>
  );
}

export default HomeScreen;
