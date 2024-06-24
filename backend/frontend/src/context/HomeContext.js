import React, { createContext, useContext, useEffect, useState } from "react";

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {

  const [selectedGame, setSelectedGame] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [keyword, setKeyword] = useState("");
  const [recentlySearchedKeywords, setRecentlySearchedKeywords] = useState([]);


  useEffect(() => {
    const storedSelectedGame = localStorage.getItem("selectedGame");
    const storedSelectedArea = localStorage.getItem("selectedArea");
    const storedSelectedDate = localStorage.getItem("selectedDate");
    const storedSelectedCourt = localStorage.getItem("selectedCourt");
    const storedSelectedSlot = localStorage.getItem("selectedSlot");
    const keyword = localStorage.getItem("keyword");
    const recentlySearchedKeywords = localStorage.getItem("recentlySearchedKeywords");


    if (storedSelectedGame) setSelectedGame(storedSelectedGame);
    if (storedSelectedArea) setSelectedArea(storedSelectedArea);
    if (storedSelectedDate) setSelectedDate(storedSelectedDate);
    if (storedSelectedCourt) setSelectedCourt(storedSelectedCourt);
    if (storedSelectedSlot) setSelectedSlot(storedSelectedSlot);
    if (keyword) setKeyword(keyword);
    if (recentlySearchedKeywords) setRecentlySearchedKeywords(recentlySearchedKeywords);

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

  useEffect(() => {
    localStorage.setItem("selectedSlot", selectedSlot);
  }, [selectedSlot]);

  useEffect(() => {
    localStorage.setItem("keyword", keyword);
  }, [keyword]);

  useEffect(() => {
    localStorage.setItem("recentlySearchedKeywords", JSON.stringify(recentlySearchedKeywords));
  }, [recentlySearchedKeywords]);

  const contextValue = {
    selectedGame,
    setSelectedGame,
    selectedArea,
    setSelectedArea,
    selectedDate,
    setSelectedDate,
    selectedCourt,
    setSelectedCourt,
    selectedSlot,
    setSelectedSlot,
    keyword,
    setKeyword,
    recentlySearchedKeywords,
    setRecentlySearchedKeywords
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