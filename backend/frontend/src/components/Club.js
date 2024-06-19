import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Rating from "./Rating";

import "../css/club.css";
import profileImage from "../images/profile.jpg";
import venueImage from "../images/venue3.jpg";
import { Calendar, MapPin, Heart } from "react-feather";

function Club({ clubs }) {
  const navigate = useNavigate();

  const handleViewDetails = (club) => {
    navigate(`/club/${club.id}`);
  };

  return (
    <div className="clubs-display">
      <div className="content listing-list-page">
        <div className="container">
          <div className="row justify-content-center">
            {clubs &&
              clubs.map((club) => (
                <div
                  className="col-lg-12 col-md-12"
                  onClick={() => handleViewDetails(club)}
                >
                  <div className="featured-venues-item venue-list-item">
                    <div className="listing-item listing-item-grid">
                      <div className="listing-img">
                        <a>
                          {club && club.organization_images ? (
                            <img
                              src={club.organization_images}
                              alt="Organization"
                            />
                          ) : (
                            <img src={venueImage} alt="Organization" />
                          )}
                        </a>
                        <div className="fav-item-venues">
                          <span className="tag tag-blue">Featured</span>
                          <h5 className="tag tag-primary">
                            $450<span>/hr</span>
                          </h5>
                        </div>
                      </div>
                      <div className="listing-content">
                        <div className="list-reviews">
                          <div className="d-flex align-items-center">
                            <span className="rating-bg">4.2</span>
                            <span>300 Reviews</span>
                          </div>
                          <a href="javascript:void(0)" className="fav-icon">
                            <i className="feather-heart"></i>
                          </a>
                        </div>
                        <h3 className="listing-title">
                          <a href="venue-details.html">
                            {club.organization.organization_name}
                          </a>
                        </h3>
                        <div className="listing-details-group">
                          <p>
                            Elevate your athletic journey at Sarah Sports
                            Academy, where excellence meets opportunity.
                          </p>
                          <ul className="listing-details-info">
                            <li>
                              <span>
                                <i className="feather-map-pin">
                                  <MapPin />
                                </i>
                                {club.address_line_1},{club?.area?.area_name}
                              </span>
                            </li>
                            <li>
                              <span>
                                <i className="feather-calendar">
                                  <Calendar />
                                </i>
                                Next availablity :{" "}
                                <span className="primary-text">
                                  21 May 2023
                                </span>
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="listing-button">
                          <div className="listing-venue-owner">
                            <a className="navigation">
                              <img src={profileImage} alt="User" />
                              Mart Sublin
                            </a>
                          </div>
                          <a
                            onClick={() => handleViewDetails(club)}
                            className="user-book-now"
                          >
                            <span>
                              <i className="feather-calendar me-2">
                                <Calendar />
                              </i>
                            </span>
                            Book Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            <div className="col-12 text-center">
              <div className="more-details">
                {/* <a href="#" className="btn btn-load">Load More Coaches <img src="assets/img/icons/u_plus-square.svg" className="ms-2" alt="Icon"></a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Club;
