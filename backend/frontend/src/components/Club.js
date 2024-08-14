import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiShuttlecock } from "react-icons/gi";
import { Calendar, MapPin } from "react-feather";
import { useTranslation } from "react-i18next";

import { useHomeContext } from "../context/HomeContext";
import profileImage from "../images/profile.jpg";
import venueImage from "../images/venue3.jpg";
import { formatAddress } from "../utils/spacingUtils";
import { fixImageUrls } from "../utils/imageUtils";


import "../css/club.css";

function Club({ clubs }) {
  const navigate = useNavigate();
  const { t } = useTranslation("clubcard");

  const { recentlySearchedKeywords, setRecentlySearchedKeywords } =
    useHomeContext();

  const handleViewDetails = (club) => {
    if (club) {
      const updatedKeywords = [
        club.id,
        ...(Array.isArray(recentlySearchedKeywords)
          ? recentlySearchedKeywords.filter((k) => k !== club.id).slice(0, 3)
          : []),
      ];
      setRecentlySearchedKeywords([]);
      setRecentlySearchedKeywords(updatedKeywords);
    }
    navigate(`/club/${club.id}`);
  };

  useEffect(() => {
    fixImageUrls();
  }, []);
  
  return (
    <div className="container">
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
                              alt={t("organizationAlt")}
                            />
                          ) : (
                            <img src={venueImage} alt={t("organizationAlt")} />
                          )}
                        </a>
                        <div className="fav-item-venues">
                          <span className="tag tag-blue">{t("featured")}</span>
                        </div>
                      </div>
                      <div className="listing-content">
                        {club.rating > 0 && (
                            <div className="list-reviews">
                              <div className="d-flex align-items-center">
                                <span className="rating-bg">
                                  {club.rating}
                                </span>
                                <span>{t("reviews", { count: club?.numRatings })}</span>
                              </div>
                            </div>
                          )}
                        <h3 className="listing-title">
                          <a onClick={() => handleViewDetails(club)}>
                            {club.organization.organization_name}
                          </a>
                        </h3>
                        <div className="listing-details-group">
                          <p>
                            {club.organization.description}
                          </p>
                          <ul className="listing-details-info">
                            <li>
                              <span>
                                <i className="feather-map-pin">
                                  <MapPin />
                                </i>
                                {formatAddress(club.address_line_1)}
                                {(club?.area?.area_name)}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="listing-button">
                          <a
                            onClick={() => handleViewDetails(club)}
                            className="user-book-now"
                          >
                            <span>
                              <i className="feather-calendar me-2">
                                <Calendar />
                              </i>
                            </span>
                            {t("bookNow")}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            <div className="col-12 text-center">
              <div className="more-details">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Club;