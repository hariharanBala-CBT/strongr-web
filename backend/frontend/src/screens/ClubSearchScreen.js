import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Form } from "react-bootstrap";

import Club from "../components/Club";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NoDataAnimation from "../components/NoDataAnimation";

import { CircularProgress } from "@mui/material";

import { useHomeContext } from "../context/HomeContext";

import { listOrganizations, RecentSearch } from "../actions/actions";
import { fixImageUrls } from "../utils/imageUtils";

import "../css/clubsearchscreen.css";

function ClubSearchScreen() {
  const NoDataAnimationUrl =
    "https://cbtstrongr.s3.amazonaws.com/videos/no-data-animation.json";

  const dispatch = useDispatch();
  const { keyword, setKeyword, recentlySearchedKeywords } = useHomeContext();

  const [loading, setLoading] = useState(false);

  const { filteredClubLocations, loadingSearchLocations } = useSelector(
    (state) => state.listOrganizations
  );
  const { filteredData, loadingSearchClubs } = useSelector(
    (state) => state.RecentSearch
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(listOrganizations(keyword));
  };

  useEffect(() => {
    fixImageUrls();
  }, [filteredClubLocations, filteredData]);

  useEffect(() => {
    dispatch(listOrganizations(keyword));
  }, [dispatch, keyword]);

  useEffect(() => {
    dispatch(RecentSearch(recentlySearchedKeywords));
  }, [dispatch, recentlySearchedKeywords]);

  useEffect(() => {
    if (loadingSearchClubs || loadingSearchLocations) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loadingSearchClubs, loadingSearchLocations]);

  return (
    <div className="searchbar-screen">
      <Header location="nav-all" />
      <Toaster />
      <section className="section-container" id="section-id">
        <div className="form-section 1">
          <Form onSubmit={submitHandler} inline>
            <div className="search-bar-container">
              <label className="search-label">
                <input
                  type="search"
                  placeholder="search..."
                  className="form-control form-control-sm"
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <i className="fas fa-search search-icon"></i>
              </label>
            </div>
          </Form>
        </div>
      </section>
      {loading ? (
        <div className="clubs-filter-loader">
          <CircularProgress />
        </div>
      ) : (
        <>
          {filteredClubLocations.length > 0 ? (
            <div className="club-list">
              <Club clubs={filteredClubLocations} />
            </div>
          ) : (
            <div className="clubs-error">
              <NoDataAnimation url={NoDataAnimationUrl} />
            </div>
          )}
        </>
      )}
      {filteredData?.length > 0 && (
        <div className="recently-searched">
          <h2>Recently Searched:</h2>
          <Club clubs={filteredData} />
        </div>
      )}
      <Footer name="club-search" />
    </div>
  );
}

export default ClubSearchScreen;
