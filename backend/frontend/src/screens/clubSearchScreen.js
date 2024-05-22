import React, { useEffect, useState } from "react";
import "../css/clubsearchscreen.css";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Form } from "react-bootstrap";
import { listOrganizations, RecentSearch } from "../actions/actions"; // Import RecentSearch
import { useHomeContext } from "../context/HomeContext";
import Club  from '../components/Club'
import Footer from "../components/Footer";

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

  const handleClubClick = (clubId) => {
    const updatedKeywords = [
      clubId,
      ...recentlySearchedKeywords.filter((k) => k !== clubId).slice(0, 3),
    ];
    setRecentlySearchedKeywords(updatedKeywords);
    localStorage.setItem("recentlySearchedKeywords", JSON.stringify(updatedKeywords));
    dispatch(listOrganizations(clubId));
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
          <Club clubs={filteredClubLocations} onClick={handleClubClick} />
        )}
      </div>
      <div className="clubs-error">
        {filteredClubLocations?.length === 0 && <h2>No clubs available</h2>}
      </div>
      {filteredData?.length > 0 && (
        <div className="recently-searched">
          <h2>Recently Searched:</h2>
          <Club
            clubs={filteredData} 
            onClick={handleClubClick}
          />
        </div>
      )}
      <Footer name="club-search"/>
    </div>
  );
}

export default ClubSearchScreen;
