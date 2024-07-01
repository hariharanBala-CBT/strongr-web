import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import { useHomeContext } from "../context/HomeContext";

import Header from "../components/Header";
import SelectInput from "../components/SelectInput";
import DateInput from "../components/DateInput";
import Club from "../components/Club";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Footer from "../components/Footer";
import NoDataAnimation from "../components/NoDataAnimation";

import { CircularProgress } from "@mui/material";

import {
  listAreas,
  listGames,
  filterLocation,
  listSuggestedClub,
  listSuggestedClubGame,
} from "../actions/actions";
import { fixImageUrls } from "../utils/imageUtils";

import "../css/clublistscreen.css";

function ClubListScreen() {
  const NoDataAnimationUrl =
    "https://cbtstrongr.s3.amazonaws.com/videos/no-data-animation.json";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    selectedDate,
    selectedArea,
    selectedGame,
    setSelectedDate,
    setSelectedArea,
    setSelectedGame,
  } = useHomeContext();

  const [gameName, setGameName] = useState(selectedGame);
  const [areaName, setAreaName] = useState(selectedArea);
  const [date, setDate] = useState(selectedDate);
  const [loading, setLoading] = useState(false);

  const { areaError, areaLoading, areas } = useSelector(
    (state) => state.areaList
  );
  const { gameError, gameLoading, games } = useSelector(
    (state) => state.gameList
  );
  const { clubFilterLoading, clubLocationDetails } = useSelector(
    (state) => state.filterClubLocations
  );
  const { suggestedClubList, loadingSuggestedClub } = useSelector((state) => state.suggestedClubs);
  const { suggestedClubGameList, loadingSuggestedClubGame } = useSelector((state) => state.suggestedClubsGame);

  const handleSubmit = (event) => {
    event.preventDefault();

    dispatch(filterLocation(areaName, gameName, date));
    navigate("/clubs");
  };

  useEffect(() => {
    fixImageUrls();
  }, [suggestedClubGameList, suggestedClubList, clubLocationDetails]);

  useEffect(() => {
    const storedSelectedGame = localStorage.getItem("selectedGame");
    const storedSelectedArea = localStorage.getItem("selectedArea");
    const storedSelectedDate = localStorage.getItem("selectedDate");

    if (storedSelectedGame) setGameName(storedSelectedGame);
    if (storedSelectedArea) setAreaName(storedSelectedArea);
    if (storedSelectedDate) setDate(storedSelectedDate);

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
    setSelectedArea(areaName);
    setSelectedGame(gameName);
    setSelectedDate(date);
    dispatch(filterLocation(areaName, gameName, date));
  }, [
    areaName,
    date,
    dispatch,
    gameName,
    setSelectedArea,
    setSelectedGame,
    setSelectedDate,
  ]);

  useEffect(() => {
    if (areaName === undefined) {
      setAreaName(areas[0]?.area_name);
    }
  }, [areaName, areas]);

  useEffect(() => {
    if (areaError) {
      toast.error("error in fetching areas");
    } else if (gameError) {
      toast.error("error in fetching games");
    }
  }, [areaError, gameError]);

  useEffect(() => {
    if (areaName !== undefined && gameName !== undefined) {
      dispatch(listSuggestedClub(areaName));
      dispatch(listSuggestedClubGame(gameName));
    }
  }, [areaName, areas, games, clubLocationDetails, dispatch, gameName]);

  useEffect(() => {
    if (clubFilterLoading || loadingSuggestedClub || loadingSuggestedClubGame) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [clubFilterLoading, loadingSuggestedClub, loadingSuggestedClubGame]);

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
                id="game"
                label="Game"
                value={gameName}
                onChange={(value) => {
                  setLoading(true);
                  setGameName(value);
                }}
                options={games?.map((game) => ({
                  id: game?.id,
                  name: game?.game_name,
                }))}
              />
            )}

            {areaLoading ? (
              <Loader />
            ) : areaError ? (
              <Message variant="danger">{areaError}</Message>
            ) : (
              <SelectInput
                id="area"
                label="Area"
                value={areaName}
                onChange={(value) => {
                  setLoading(true);
                  setAreaName(value);
                }}
                options={areas?.map((area) => ({
                  id: area?.id,
                  name: area?.area_name,
                }))}
              />
            )}

            <DateInput
              id="date"
              label="Date"
              value={date}
              onChange={(value) => {
                setLoading(true);
                setDate(value);
              }}
            />
          </div>
        </form>
      </div>
      {loading ? (
        <div className="clubs-filter-loader">
          <CircularProgress />
        </div>
      ) : (
        <>
          {clubLocationDetails.length > 0 ? (
            <>
              <Club clubs={clubLocationDetails} />
            </>
          ) : (
            <>
              {clubLocationDetails?.length === 0 &&
              suggestedClubList?.length > 0 ? (
                <>
                  <div className="clubs-error">
                    <NoDataAnimation url={NoDataAnimationUrl} />
                  </div>

                  <div className="suggested-clubs">
                    <h3>Suggested Clubs in {areaName}</h3>
                    <Club clubs={suggestedClubList} />
                  </div>
                </>
              ) : (
                <>
                  {suggestedClubList?.length === 0 &&
                  suggestedClubGameList?.length > 0 ? (
                    <>
                      <div className="clubs-error">
                        <NoDataAnimation url={NoDataAnimationUrl} />
                      </div>

                      <div className="suggested-clubs">
                        <h3>Suggested Clubs for {gameName}</h3>
                        <Club clubs={suggestedClubGameList} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="clubs-error">
                        <NoDataAnimation url={NoDataAnimationUrl} />
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
      <Footer name="clublist-f" />
    </div>
  );
}

export default ClubListScreen;
