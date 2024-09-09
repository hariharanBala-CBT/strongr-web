import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MapPin } from "react-feather";
import { useTranslation } from "react-i18next";
import { LinkContainer } from "react-router-bootstrap";
import venueImage from "../images/owner-venue2.jpg";
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
  checkHappyHoursSlot,
  getNearestSlot,
} from "../actions/actions";
import dayjs from "dayjs";

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

const formatDate = (date) => {
  return dayjs(date).format("DD-MM-YYYY");
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
  const { t } = useTranslation("bookinginfoscreen");

  const { clubLocation } = useSelector((state) => state.Location);
  const { clubGame } = useSelector((state) => state.clubGame);
  const { courts } = useSelector((state) => state.courtList);
  const { clubWorking } = useSelector((state) => state.clubWorking);
  const { slots } = useSelector((state) => state.slot);
  const { additionalSlots } = useSelector((state) => state.additionalSlot);
  const { unavailableSlots } = useSelector((state) => state.unavailableSlot);
  const { nearestSlot } = useSelector((state) => state.nearestSlot);
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
  
  const { isHappyHours, price } = useSelector((state) => {
    return state.happyHours;
  });

  const handleSlotChange = (value) => {

    setSlot(value);
    const [startTime, endTime] = value.split("-");

    const selectedSlot = slots.find(
      (slot) => slot.start_time === startTime && slot.end_time === endTime
    );

    const slotId = selectedSlot?.id;

    let addSlotId = null;
    if (!slotId) {
      const additionalSlot = additionalSlots.find(
        (slot) => slot.start_time === startTime && slot.end_time === endTime
      );
      addSlotId = additionalSlot?.id;
    }

    if (slotId || addSlotId) {
      const idToCheck = slotId || addSlotId;
      dispatch(checkHappyHoursSlot(idToCheck))
    }
  };
  
  const getSelectedGamePricing = () => {
    if (isHappyHours && price !== undefined && price !== null) {
      return price;  // Use happy hours price if available
    }
  
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
    Number(taxPrice)
    // Number(bookingFee)
  ).toFixed(0);

  const handleAreaChange = (value) => {
    setAreaName(value);
  };

  const handleGameChange = (value) => {
    setGameName(value);
  };

  // const handleSlotChange = (value) => {
  //   setSlot(value);
  // };

  
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
          toast.error(t("selectSlot"));
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
      toast.error(t("incorrectCredentials"));
      setOpenForm(true);
      setLoader(false);
      setIsLogin(false);
    }
  }, [isLogin, LoginError]);

  useEffect(() => {
    if (userLoginSuccess && isLogin) {
        toast.success(t("message", { userName: userInfo.first_name }), { duration: 4000 });
        setOpenForm(false);
        setIsLogin(false);
    }
}, [isLogin, userLoginSuccess, userInfo, t]);


  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      toast.success(t("message",{userName}), { duration: 4000 });
      localStorage.removeItem("userName");
    }
  }, [t]);

  useEffect(() => {
    const theCourt = courts?.find((court) => court.name === courtName);
    const courtId = theCourt?.id;
    if (slots?.length !== 0 && additionalSlots?.length !== 0 && courtId) {
      dispatch(getNearestSlot(courtId, date));
    }
  }, [additionalSlots, courts, courtName, date, dispatch, slots]);

  return (
    <div>
      <Header location="nav-all" />
      <Toaster />
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round"></span>
        <div className="container">
          <h1 className="text-white">{t("bookACourt")}</h1>
          <ul>
            <li className="breadcrumb-icons">
              <a href="/">{t("home")}</a>
            </li>
            <li className="breadcrumb-icons">
              <LinkContainer to="/clubs">
                <a>{t("venueList")}</a>
              </LinkContainer>
            </li>
            <li className="breadcrumb-icons">
              <LinkContainer to={`/club/${id}`}>
                <a>{t("venueDetails")}</a>
              </LinkContainer>
            </li>
            <li>{t("bookACourt")}</li>
          </ul>
        </div>
      </section>
      <div className="content book-cage">
        <div className="container">
          <section className="card mb-40">
            <div className="text-center mb-40">
              <h3 className="mb-1">{t("bookACourt")}</h3>
              <p className="sub-title mb-0">{t("hassleFreeBooking")}</p>
            </div>
            <div className="master-academy dull-whitesmoke-bg card">
              <div className="row d-flex align-items-center justify-content-center">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                  <div className="d-sm-flex justify-content-start align-items-center">
                    <a href="javascript:void(0);">
                      <img
                        className="corner-radius-10"
                        src={venueImage}
                        alt="Venue"
                      />
                    </a>
                    <div className="info">
                      {clubLocation?.rating ? (
                        <div className="d-flex align-items-center">
                          <span className="text-white dark-yellow-bg color-white me-2 d-flex justify-content-center align-items-center">
                            {clubLocation.rating}
                          </span>
                          <span>
                            {t("reviews", { count: clubLocation?.numRatings })}
                          </span>
                        </div>
                      ) : null}
                      <h3 className="mb-2">
                        {clubLocation?.organization?.organization_name}
                      </h3>
                      <p>{clubLocation?.organization?.description}</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6">
                  <ul className="d-sm-flex align-items-center justify-content-evenly">
                    <li>
                      <h3 className="d-inline-block subtitle-txt">
                        <span>
                          <MapPin />
                        </span>
                        {clubLocation?.area?.area_name}
                      </h3>
                    </li>
                    <li>
                      <span>
                        <i className="feather-plus"></i>
                      </span>
                    </li>
                    <li></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6">
              <div className="booking-info-card">
                <h3 className="border-bottom">{t("bookingForm")}</h3>
                <form onSubmit={handleSubmit} className="booking-form">
                  <div className="booking-container">
                    <SelectInput
                      id="area"
                      value={areaName}
                      onChange={handleAreaChange}
                      options={[
                        {
                          id: clubLocation?.area?.id,
                          name: clubLocation?.area?.area_name,
                        },
                      ]}
                      label={t("areaLabel")}
                    />
                    <SelectInput
                      id="game"
                      value={gameName}
                      onChange={handleGameChange}
                      options={clubGame?.map((game) => ({
                        id: game?.id,
                        name: game?.game_type?.game_name,
                      }))}
                      label={t("gameLabel")}
                    />
                    <DateInput
                      id="date"
                      value={date}
                      onChange={handleDateChange}
                      label={t("dateLabel")}
                    />
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
                        label={t("courtLabel")}
                      />
                    )}
                    {loading ? (
                      <div>{t("loadingSlots")}</div>
                    ) : (slots?.length !== 0 ||
                        additionalSlots?.length !== 0) &&
                      courts?.length !== 0 ? (
                      <SelectInput
                        useRadioButtons
                        id="slot"
                        value={slot}
                        onChange={handleSlotChange}
                        options={slots?.map((slot) => ({
                          id: slot.id,
                          name: `${slot.start_time}-${slot.end_time}`,
                        }))}
                        label={t("slotLabel")}
                        addSlots={additionalSlots?.map((slot) => ({
                          id: slot.id,
                          name: `${slot.start_time}-${slot.end_time}`,
                        }))}
                        removeSlots={unavailableSlots?.map((slot) => ({
                          id: slot.id,
                          name: `${slot.start_time}-${slot.end_time}`,
                        }))}
                      />
                    ) : courts?.length === 0 ? (
                      <Alert severity="warning">
                        {t("noCourtsAvailable")}
                      </Alert>
                    ) : nearestSlot ? (
                      <Alert severity="info">
                        {t("currentlyNoSlotsAvailable", {
                          courtName: courtName,
                          date: nearestSlot.days
                            ? nearestSlot.days
                            : formatDate(nearestSlot.date),
                          time: nearestSlot?.start_time?.slice(0, 5),
                        })}
                      </Alert>
                    ) : (
                      <Alert severity="error">
                        {t("noSlotsAvailable", { courtName })}
                      </Alert>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6">
              <aside className="card booking-details box-min-height">
                <h3 className="border-bottom">{t("yourOrder")}</h3>
                <div className="card2">
                  <ul className="order-sub-total">
                    <div className="orderset1">
                      <li>
                        <h3>{clubLocation?.organization?.organization_name}</h3>
                        <h6>
                          {"\u20B9"} {clubPrice}
                        </h6>
                      </li>
                      <p>
                        {gameName} &nbsp;({"\u20B9"}
                        {getSelectedGamePricing()}
                        /hr){isHappyHours && <span className="happy-hours-tag">{t("happyHours")}</span>}
                      </p>
                    </div>
                    <div className="orderset2">
                      <li>
                        <h3>{t("gst")}</h3>
                        <h6>
                          {"\u20B9"} {taxPrice}
                        </h6>
                      </li>
                      <p>{t("stateAndCentralTax")}</p>
                    </div>
                    {/* <div className="orderset3">
                      <li>
                        <h3>{t("convenienceFee")}</h3>
                        <h6>
                          {"\u20B9"} {bookingFee}
                        </h6>
                      </li>
                      <p>{t("onlineBookingFee")}</p>
                    </div> */}
                  </ul>
                  <div className="order-total d-flex justify-content-between align-items-center">
                    <h5>{t("orderTotal")}</h5>
                    <h5>
                      {"\u20B9"} {totalPrice}
                    </h5>
                  </div>

                  {!openForm && (
                    <div className="d-grid btn-block">
                      <Button
                        disabled={
                          totalPrice < 60 || !(userInfo && userInfo.length > 0)
                        }
                        onClick={handleSubmit}
                        className="btn btn-primary"
                        text={t("bookNow")}
                      />
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
          <Modal
            open={openForm}
            onClose={() => setOpenForm(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            {loader ? (
              <Box sx={boxStyle} className="otp-loader">
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={boxStyle}>
                <Alert severity="info">{t("loginToProceed")}</Alert>
                <form
                  onSubmit={loginAndRedirect}
                  className="booking-login-form">
                  <h2 className="login-title">{t("login")}</h2>

                  <label>{t("username")}</label>
                  <input
                    required
                    type="text"
                    placeholder={t("Enter username")}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />

                  <label>{t("password")}</label>
                  <input
                    required
                    type="password"
                    placeholder={t("enterPassword")}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />

                  <div className="login-button">
                    <Button
                      type="submit"
                      className="btn-check-availability-home"
                      text={t("loginButton")}
                    />
                  </div>
                </form>
              </Box>
            )}
          </Modal>
        </div>
      </div>
      <Footer name="bookinginfo-f" />
    </div>
  );
}

export default BookingInfoScreen;
