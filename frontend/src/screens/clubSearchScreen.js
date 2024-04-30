import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../css/clubsearchscreen.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import SearchClub from "../components/SearchClub";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Form } from "react-bootstrap";
import { listOrganizations, RecentSearch } from "../actions/actions"; // Import RecentSearch
import { useHomeContext } from "../context/HomeContext";

function ClubSearchScreen() {
  const { keyword, setKeyword } = useHomeContext();
  const dispatch = useDispatch();

  const { filteredClubLocations } = useSelector((state) => state.listOrganizations);
  const { filteredData } = useSelector((state) => state.RecentSearch);  


  const [recentlySearchedKeywords, setRecentlySearchedKeywords] = useState([]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (keyword) {
      const updatedKeywords = [
        keyword,
        ...recentlySearchedKeywords.filter((k) => k !== keyword).slice(0, 3),
      ];
      setRecentlySearchedKeywords(updatedKeywords);
      localStorage.setItem("recentlySearchedKeywords", JSON.stringify(updatedKeywords));

      dispatch(listOrganizations(keyword));
    }
  };

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
    dispatch(RecentSearch(recentlySearchedKeywords)); // Dispatch RecentSearch when component mounts
  }, [dispatch, recentlySearchedKeywords]);

  const handleClubClick = (clubName) => {
    const updatedKeywords = [
      clubName,
      ...recentlySearchedKeywords.filter((k) => k !== clubName).slice(0, 3),
    ];
    setRecentlySearchedKeywords(updatedKeywords);
    localStorage.setItem("recentlySearchedKeywords", JSON.stringify(updatedKeywords));
    dispatch(listOrganizations(clubName));
  };

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
      <div className="club-list">
        {filteredClubLocations && (
          <SearchClub clubs={filteredClubLocations} onClubClick={handleClubClick} />
        )}
      </div>
      <div className="clubs-error">
        {filteredClubLocations.length === 0 && <h2>No clubs available :(</h2>}
      </div>
      {filteredData.length > 0 && (
        <div className="recently-searched">
          <h2>Recently Searched:</h2>
          <SearchClub
            clubs={filteredData}
            onClubClick={handleClubClick}
          />
        </div>
      )}
    </div>
  );
}

export default ClubSearchScreen;
