import React, { useState, useEffect } from "react";
import { Calendar, MapPin, X } from "react-feather";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        closeModal();
      }, 7000);

      // Clean up the timeout when modal closes or component unmounts
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  const handleClickOutside = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  return (
    <div className="venue-wrapper">
      <div className="listing-item mb-0">
        <div className="listing-img">
          <div onClick={() => navigate(`/club/${club.id}`)}>
            <img
              className="club-images"
              src={organization_images || "https://cbtstrongr.s3.amazonaws.com/images/no-image.jpg"}
              alt={t("venueAlt")}
            />
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
            <div onClick={() => navigate(`/club/${club.id}`)}>{organization.organization_name}</div>
          </h3>
          <div className="listing-details-group">
            <p>{location_description}</p>
            <ul>
              <li>
                <span>
                  <MapPin className="text-blue-600 mr-2" />
                  {address_line_1.replace(/,\s*$/, "")}
                </span>
              </li>
              {club.next_availabilty && club.next_availabilty.length > 0 && (
                <li>
                  <span
                    className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 link-style"
                    onClick={openModal}
                  >
                    <Calendar className="mr-2" />
                    <span className="font-medium">{t("nextAvailability")}</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
          <div className="listing-button">
            <div className="listing-venue-owner">
              <div className="navigation" onClick={() => navigate(`/club/${club.id}`)}>
                <img
                  src={organization_images || "https://cbtstrongr.s3.amazonaws.com/images/no-image.jpg"}
                  alt={t("venueAlt")}
                  className="w-8 h-8 rounded-full mr-2"
                />
                {organization.organization_name}
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleClickOutside}>
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Availability Details</h2>
              <button onClick={closeModal} className="modal-close">
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              {club.next_availabilty &&
                club.next_availabilty.map((availability, index) => (
                  <div key={index} className="availability-card">
                    <div className="availability-header">
                      <GameIcon game={availability.game} />
                      <span className="availability-game">{availability.game}</span>
                    </div>
                    <div className="availability-details">
                      <p className="availability-info">
                        <span className="availability-label">Court:</span>
                        {availability.court}
                      </p>
                      <p className="availability-info">
                        <span className="availability-label">Date:</span>
                        {formatDate(availability.next_availability.date)}
                      </p>
                      <p className="availability-info">
                        <span className="availability-label">Time:</span>
                        {availability.next_availability.start_time.slice(0, 5)} - {availability.next_availability.end_time.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                ))}
              <div className="modal-footer">
                <button onClick={closeModal} className="modal-close-btn">
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetails;
