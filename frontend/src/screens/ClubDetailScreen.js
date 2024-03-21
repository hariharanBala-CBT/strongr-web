import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "../css/clubdetailscreen.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  listclubLocation,
  listclubGame,
  listclubAmenities,
  listclubWorking,
  listClubImages,
} from "../actions/actions";
import { IoMdCloseCircleOutline } from "react-icons/io";

function ClubDetailScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listclubLocation(id));
    dispatch(listclubGame(id));
    dispatch(listclubAmenities(id));
    dispatch(listclubWorking(id));
    dispatch(listClubImages(id));
  }, [dispatch, id]);

  const [isPopupVisible, setPopupVisible] = useState(false);

  const handlePopupToggle = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("popup-overlay")) {
      setPopupVisible(false);
    }
  };

  const Location = useSelector((state) => state.Location);
  const { error, loading, clubLocation } = Location;

  const Games = useSelector((state) => state.clubGame);
  const { gameError, gameLoading, clubGame } = Games;

  const WorkingDays = useSelector((state) => state.clubWorking);
  const { daysError, daysLoading, clubWorking } = WorkingDays;

  const Amenities = useSelector((state) => state.clubAmenities);
  const { amenitiesError, amenitiesLoading, clubAmenity } = Amenities;

  const Images = useSelector((state) => state.clubImages);
  const { imageError, imageLoading, clubImage } = Images;

  const handleClick = () => {
    navigate(`/booking/${clubLocation.id}`);
  };

  return (
    <div>
      <Header location="nav-all" />
      <div className="club-detail">
        <div className="carousel-container">
          <Carousel
            autoPlay
            infiniteLoop
            transition="crossfade"
            width={600}
            showThumbs={false}
          >
            {clubImage?.map((image) => (
              <div>
                <img
                  key={image.id}
                  src={image.image}
                  alt="carousel-img"
                  className="carousel-img"
                />
              </div>
            ))}

            <div>
              <img
                src="https://source.unsplash.com/Jr5x1CAWySo"
                alt="carousel-img"
                className="carousel-img"
              />
            </div>
            <div>
              <img
                src="https://source.unsplash.com/Jr5x1CAWySo"
                alt="carousel-img"
                className="carousel-img"
              />
            </div>
          </Carousel>
        </div>

        <div className="details">
          <h1>{clubLocation?.organization?.organization_name}</h1>
          <h3>Games:</h3>
          {clubGame?.map((game) => (
            <span key={game.id}>
              {game.game_type.game_name}: ₹{game.pricing}
              <br />
            </span>
          ))}
          <div>
            <h3 className="fs-5 mt-5 fw-bolder">Location:</h3>
            <div className="lead">
              <span>
                {clubLocation?.address_line_1}
                <br />
                {clubLocation?.address_line_2}
                <br />
                {clubLocation?.pincode}
              </span>
            </div>
          </div>
          <div className="mt-4 mb-3">
            <button className="popup1" onClick={handlePopupToggle}>
              View Timings
            </button>
            {isPopupVisible && (
              <div className="popup-overlay" onClick={handleOverlayClick}>
                <div className="popup-content">
                  <IoMdCloseCircleOutline onClick={handlePopupToggle} style={{ float: 'right' }} />
                  <h4>Working Timings</h4>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clubWorking?.map((day) => (
                        <tr key={day.id}>
                          <td>{day.days}</td>
                          <td>{day.work_from_time}</td>
                          <td>{day.work_to_time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div>
              <h3>Amenities:</h3>
              <ul>
                {clubAmenity?.is_parking === true && <li>Parking</li>}
                {clubAmenity?.is_restrooms === true && <li>Restrooms</li>}
                {clubAmenity?.is_changerooms === true && <li>ChangeRooms</li>}
                {clubAmenity?.is_powerbackup === true && <li>Power Backup</li>}
                {clubAmenity?.is_beverages_facility === true && (
                  <li>Beverages Facility</li>
                )}
                {clubAmenity?.is_coaching_facilities === true && (
                  <li>Coaching Facility</li>
                )}
              </ul>
            </div>
          </div>

          <button onClick={handleClick} className="btn1">
            Book Now
          </button>
        </div>
      </div>
      <div className="similar-clubs">
        {/* <h1>Similar Club</h1>
        <div>
          <Club link="/" />
          <Club link="/" />
          <Club link="/" />
          <Club link="/" />
        </div> */}
      </div>
    </div>
  );
}

export default ClubDetailScreen;