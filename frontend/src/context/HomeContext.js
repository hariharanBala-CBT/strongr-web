import React, { createContext, useContext, useEffect, useState } from "react";

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {

  const [selectedGame, setSelectedGame] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");


  useEffect(() => {
    const storedSelectedGame = localStorage.getItem("selectedGame");
    const storedSelectedArea = localStorage.getItem("selectedArea");
    const storedSelectedDate = localStorage.getItem("selectedDate");
    const storedSelectedCourt = localStorage.getItem("selectedCourt");

    if (storedSelectedGame) setSelectedGame(storedSelectedGame);
    if (storedSelectedArea) setSelectedArea(storedSelectedArea);
    if (storedSelectedDate) setSelectedDate(storedSelectedDate);
    if (storedSelectedCourt) setSelectedCourt(storedSelectedCourt);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedGame", selectedGame);
  }, [selectedGame]);

  useEffect(() => {
    localStorage.setItem("selectedArea", selectedArea);
  }, [selectedArea]);

  useEffect(() => {
    localStorage.setItem("selectedDate", selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem("selectedCourt", selectedCourt);
  }, [selectedCourt]);

  const contextValue = {
    selectedGame,
    setSelectedGame,
    selectedArea,
    setSelectedArea,
    selectedDate,
    setSelectedDate,
    selectedCourt,
    setSelectedCourt
  };

  return (
    <HomeContext.Provider value={contextValue}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHomeContext = () => {
  return useContext(HomeContext);
};
