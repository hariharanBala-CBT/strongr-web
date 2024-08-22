import React from "react";
import { Calendar, MapPin } from "react-feather";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from 'dayjs';

const formatDate = (date) => {
  return dayjs(date).format('DD-MM-YYYY');
};

const VenueDetails = ({ club }) => {
  const { address_line_1, organization, organization_images, games } = club;
  const navigate = useNavigate();
  const { t } = useTranslation("venuedetails");

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
          </a>
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
                  {address_line_1.replace(/,\s*$/, '')}
                </span>
              </li>
              {games && games.length > 0 ? (
                <li>
                  <span>{t("gamesAvailable")}:</span>
                  <ul>
                    {games.map((game, index) => (
                      <li key={index}>
                        {game.game_type?.game_name}
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li>
                  <span>{t("noGamesFound")}</span>
                </li>
              )}
              {club?.next_availabilty && (
                <li>
                  <span>
                    <i className="fa-solid fa-calendar-days"> </i>
                    <span className="primary-text">
                     {t("nextAvailability")}: {club?.next_availabilty?.days ? club?.next_availabilty?.days : formatDate(club?.next_availabilty?.date)} - {club?.next_availabilty?.start_time}
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
                    <img src={organization_images} alt={t("venueAlt")} />
                  ) : (
                    <img
                      src="https://cbtstrongr.s3.amazonaws.com/images/no-image.jpg"
                      alt={t("venueAlt")}
                    />
                  )}
                  {organization.organization_name}
                </>
              </a>
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