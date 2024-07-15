import React from "react";
import { Calendar, MapPin, Heart } from "react-feather";
import { GiShuttlecock } from "react-icons/gi";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";

const VenueDetails = ({ club }) => {
  const { address_line_1, organization, organization_images } = club;
  const navigate = useNavigate();

  return (
    <div className="venue-wrapper">
      <div className="listing-item mb-0">
        <div className="listing-img">
          <a
            onClick={() => {
              navigate(`/club/${club.id}`);
            }}
          >
            <>
              {organization_images ? (
                <img
                  className="club-images"
                  src={organization_images}
                  alt="Venue"
                />
              ) : (
                <img
                  className="club-images"
                  src="https://cbtstrongr.s3.amazonaws.com/images/no-image.jpg"
                  alt="Venue"
                />
              )}
            </>
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
          </div>
          <h3 className="listing-title">
            <a
              onClick={() => {
                navigate(`/club/${club.id}`);
              }}
            >
              {organization.organization_name}
            </a>
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
              {club?.next_availabilty && (
                <li>
                  <span>
                    <i className="fa-solid fa-calendar-days"> </i>
                    <span className="primary-text">
                      next availability : {club?.next_availabilty?.days}-
                      {club?.next_availabilty?.start_time}
                    </span>
                  </span>
                </li>
              )}
            </ul>
          </div>
          <div className="listing-button">
            <div className="listing-venue-owner">
              <a
                className="navigation"
                onClick={() => {
                  navigate(`/club/${club.id}`);
                }}
              >
                <>
                  {organization_images ? (
                    <img src={organization_images} alt="Venue" />
                  ) : (
                    <img
                      src="https://cbtstrongr.s3.amazonaws.com/images/no-image.jpg"
                      alt="Venue"
                    />
                  )}
                  {organization.organization_name}
                </>
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
