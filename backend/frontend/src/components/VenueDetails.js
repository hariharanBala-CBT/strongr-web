import React from "react";
import { Calendar, MapPin, Heart } from "react-feather";
const VenueDetails = ({ testiMonialDetail }) => {
  const { name, address, description, img } = testiMonialDetail;
  return (
    <div className="venue-wrapper">
      <div className="listing-item mb-0">
        <div className="listing-img">
          <a href="venue-details.html">
            <img src={img} alt="Venue" />
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
              <i className="feather-heart">
                <Heart />
              </i>
            </a>
          </div>
          <h3 className="listing-title">
            <a href="venue-details.html">Sarah Sports Academy</a>
          </h3>
          <div className="listing-details-group">
            <p>{description}</p>
            <ul>
              <li>
                <span>
                  <i className="feather-map-pin">
                    <MapPin />
                  </i>
                  Port Alsworth, AK
                </span>
              </li>
              <li>
                <span>
                  <i className="feather-calendar">
                    <Calendar />
                  </i>
                  Next Availablity :{" "}
                  <span className="primary-text">15 May 2023</span>
                </span>
              </li>
            </ul>
          </div>
          <div className="listing-button">
            <div className="listing-venue-owner">
              <a className="navigation" href="coach-detail.html">
                <img src={img} alt="Venue" />
                {name}
              </a>
            </div>
            <a href="venue-details.html" className="user-book-now">
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
  );
};

export default VenueDetails;
