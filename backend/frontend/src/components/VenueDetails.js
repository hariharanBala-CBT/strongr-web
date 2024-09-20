import React from "react";
import { Calendar, MapPin } from "react-feather";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import "../css/venuedetails.css";
import GameIcon from "./GameIcon";
import dayjs from "dayjs";

const formatDate = (date) => {
  return dayjs(date).format("DD/MM/YYYY");
};

const VenueDetails = ({ club }) => {
  const { address_line_1, location_description, organization, organization_images } = club;
  const navigate = useNavigate();
  const { t } = useTranslation("venuedetails");

  return (
    <div className="venue-wrapper">
      <div className="listing-item mb-0">
        <div className="listing-img">
          <div onClick={() => navigate(`/club/${club.id}`)}>
            <>
              {organization_images ? (
                <img
                  className="club-images"
                  src={organization_images}
                  alt={t("venueAlt")}
                />
              ) : (
                <img
                  className="club-images"
                  src="https://cbtstrongr.s3.amazonaws.com/images/no-image.jpg"
                  alt={t("venueAlt")}
                />
              )}
            </>
          </div>
          <div className="fav-item-venues">
            <span className="tag tag-blue">{t("featured")}</span>
          </div>
        </div>
        <div className="listing-content">
          <div className="list-reviews">
            <div className="d-flex align-items-center">
              {club.rating && (
                <>
                  <span className="rating-bg">{club.rating}</span>
                  <span>{t("reviews", { count: club.numRatings })}</span>
                </>
              )}
            </div>
          </div>
          <h3 className="listing-title">
            <div onClick={() => navigate(`/club/${club.id}`)}>
              {organization.organization_name}
            </div>
          </h3>
          <div className="listing-details-group">
            <p>{location_description}</p>
            <ul>
              <li>
                <span>
                  <i className="feather-map-pin">
                    <MapPin />
                  </i>
                  {address_line_1.replace(/,\s*$/, "")}
                </span>
              </li>
              {club.next_availabilty && club.next_availabilty.length > 0 && (
                <li>
                  <span>
                    <i className="fa-solid fa-calendar-days"></i>
                    <span className="primary-text">
                      {t("nextAvailability")}:
                    </span>
                    <ul>
                      {club.next_availabilty.map((availability, index) => (
                        <li
                          key={index}
                          data-tooltip-id={`tooltip-${availability.game}-${index}`}
                          data-tooltip-content={`Court: ${availability.court}, Date: ${formatDate(availability.next_availability.date)}, Time: ${availability.next_availability.start_time.slice(0, 5)} - ${availability.next_availability.end_time.slice(0, 5)}`}
                        >
                          <GameIcon game={availability.game} />
                          <Tooltip id={`tooltip-${availability.game}-${index}`} />
                        </li>
                      ))}
                    </ul>
                  </span>
                </li>
              )}
            </ul>
          </div>
          <div className="listing-button">
            <div className="listing-venue-owner">
              <div
                className="navigation"
                onClick={() => {
                  navigate(`/club/${club.id}`);
                }}
              >
                <>
                  {organization_images ? (
                    <img src={organization_images} alt={t("venueAlt")} />
                  ) : (
                    <img
                      src="https://cbtstrongr.s3.amazonaws.com/images/no-image.jpg"
                      alt={t("venueAlt")}
                    />
                  )}
                  {organization.organization_name}
                </>
              </div>
            </div>
            <LinkContainer to={`/club/${club.id}`} className="user-book-now">
              <i className="feather-calendar me-2">
                <Calendar />
                {t("bookNow")}
              </i>
            </LinkContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
