import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Form } from "react-bootstrap";

import Club from "../components/Club";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NoDataAnimation from "../components/NoDataAnimation";

import { useHomeContext } from "../context/HomeContext";

import { listOrganizations, RecentSearch } from "../actions/actions";

import "../css/clubsearchscreen.css";

function ClubSearchScreen() {
  
  const NoDataAnimationUrl="https://cbtstrongr.s3.amazonaws.com/videos/no-data-animation.json";

  const { keyword, setKeyword } = useHomeContext();
  const dispatch = useDispatch();

  const [recentlySearchedKeywords, setRecentlySearchedKeywords] = useState([]);

  const { filteredClubLocations } = useSelector((state) => state.listOrganizations);
  const { filteredData } = useSelector((state) => state.RecentSearch);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    if (keyword) {
      const updatedKeywords = [
        keyword,
        ...recentlySearchedKeywords.filter((k) => k !== keyword).slice(0, 3),
      ];
      setRecentlySearchedKeywords(updatedKeywords);
      localStorage.setItem(
        "recentlySearchedKeywords",
        JSON.stringify(updatedKeywords)
      );

      dispatch(listOrganizations(keyword));
    }
  };

  const handleClubClick = (clubId) => {
    const updatedKeywords = [
      clubId,
      ...recentlySearchedKeywords.filter((k) => k !== clubId).slice(0, 3),
    ];
    setRecentlySearchedKeywords(updatedKeywords);
    localStorage.setItem(
      "recentlySearchedKeywords",
      JSON.stringify(updatedKeywords)
    );
    dispatch(listOrganizations(clubId));
  };

  useEffect(() => {
    const fixImageUrls = () => {
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("https//")) {
          img.setAttribute("src", src.replace("https//", "https://"));
        }
      });
    };

    fixImageUrls();
  }, [filteredClubLocations, filteredData]);

  useEffect(() => {
    const storedKeywords = localStorage.getItem("recentlySearchedKeywords");
    if (storedKeywords) {
      setRecentlySearchedKeywords(JSON.parse(storedKeywords));
    }
  }, []);

  useEffect(() => {
    dispatch(listOrganizations(keyword));
  }, [dispatch, keyword]);

  useEffect(() => {
    dispatch(RecentSearch(recentlySearchedKeywords));
  }, [dispatch, recentlySearchedKeywords]);

  return (
    <div>
      <Header location="nav-all" />
      <Toaster />
      <section className="section-container" id="section-id">
        <div className="form-section 1">
          <Form onSubmit={submitHandler} inline>
            <div className="search-bar-container">
              <Form.Control
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                className="mr-sm-2 ml-sm-2 search-input"
                placeholder="search..."
                defaultValue={keyword}
              />
            </div>
          </Form>
        </div>
      </section>
        {filteredClubLocations.length > 0 ? (
        <div className="club-list">
          <Club clubs={filteredClubLocations} onClick={handleClubClick} />
        </div>)
        :
        (<div className="clubs-error">
          <NoDataAnimation url={NoDataAnimationUrl} />
        </div>)
        }

      {filteredData?.length > 0 && (
        <div className="recently-searched">
          <h2>Recently Searched:</h2>
          <Club clubs={filteredData} onClick={handleClubClick} />
        </div>
      )}
      <Footer name="club-search" />
    </div>
  );
}

export default ClubSearchScreen;