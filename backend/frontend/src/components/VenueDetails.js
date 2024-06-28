import React from "react";
import { Calendar, MapPin, Heart } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHockeyPuck, faTableTennis } from "@fortawesome/free-solid-svg-icons";
import { GiShuttlecock } from "react-icons/gi";
import { IoIosFootball } from "react-icons/io";
import { LinkContainer } from "react-router-bootstrap";

const VenueDetails = ({ club }) => {
  const { address_line_1, organization, organization_images } = club;

  return (
    <div className="venue-wrapper">
      <div className="listing-item mb-0">
        <div className="listing-img">
          <a href="venue-details.html">
            {organization_images ? (
              <img
                src={organization_images}
                alt="Venue"
                height="200"
                width="200"
              />
            ) : (
              <img
                src="https://cbtstrongr.s3.amazonaws.com/images/no-image.jpg"
                alt="Venue"
                height="200"
                width="200"
              />
            )}
          </a>
          <div className="fav-item-venues">
            <span className="tag tag-blue">Featured</span>
            {/* <h5 className="tag tag-primary">
              ₹450<span>/hr</span>
            </h5> */}
          </div>
        </div>
        <div className="listing-content">
          <div className="list-reviews">
            <div className="d-flex align-items-center">
              {club.rating && (
                <>
                  <span className="rating-bg">{club.rating}</span>
                  <span>{club.numRatings} reviews</span>
                </>
              )}
            </div>
            <a href="javascript:void(0)" className="fav-icon">
              <i className="feather-heart">
                <Heart />
              </i>
            </a>
          </div>
          <h3 className="listing-title">
            <a href="venue-details.html">{organization.organization_name}</a>
          </h3>
          <div className="listing-details-group">
            <p>{organization.description}</p>
            <ul>
              <li>
                <span>
                  <i className="feather-map-pin">
                    <MapPin />
                  </i>
                  {address_line_1}
                </span>
              </li>
              <li>
                <span>
                  <i className="gametype">Game : </i>
                  <span className="gameicon">
                    <GiShuttlecock size="2em" />
                  </span>{" "}
                  <span className="primary-text">Badminton</span>
                </span>
              </li>
            </ul>
          </div>
          <div className="listing-button">
            <div className="listing-venue-owner">
              <a className="navigation" href="coach-detail.html">
                {organization_images ? (
                  <img src={organization_images} alt="Venue" />
                ) : (
                  <img
                    src="https://cbtstrongr.s3.amazonaws.com/images/no-image.jpg"
                    alt="Venue"
                  />
                )}
                {organization.organization_name}
              </a>
            </div>
            <LinkContainer to={`/club/${club.id}`} className="user-book-now">
              <i className="feather-calendar me-2">
                <Calendar />
                Book Now
              </i>
            </LinkContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
