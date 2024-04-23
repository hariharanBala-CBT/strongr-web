import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "../css/clubdetailscreen.css";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  listclubLocation,
  listclubGame,
  listclubAmenities,
  listclubWorking,
  listClubImages,
  listCourts,
  createClubReview,
  listClubReviews,
} from "../actions/actions";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useHomeContext } from "../context/HomeContext";
import toast, { Toaster } from "react-hot-toast";

function ClubDetailScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  const gameName = localStorage.getItem("selectedGame");
  const { setSelectedCourt } = useHomeContext();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const clubReviewCreate = useSelector((state) => state.clubReviewCreate);
  const { clubReviews } = useSelector((state) => state.clubReviews);

  const {
    loading: loadingclubReview,
    error: errorclubReview,
    success: successclubReview,
  } = clubReviewCreate;

  useEffect(() => {
    if (successclubReview) {
      setRating(0);
      setComment("");
      // toast.success('Review Submitted!')
    }
    dispatch(listClubReviews(id));
    dispatch(listclubLocation(id));
    dispatch(listclubGame(id));
    dispatch(listclubAmenities(id));
    dispatch(listclubWorking(id));
    dispatch(listClubImages(id));
    dispatch(listCourts(id, gameName));
  }, [dispatch, id, gameName, successclubReview]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createClubReview(id, {
        rating: Number(rating),
        comment,
      })
    );
  };

  const [isPopupVisible, setPopupVisible] = useState(false);

  const handlePopupToggle = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("popup-overlay")) {
      setPopupVisible(false);
    }
  };

  const { clubLocation } = useSelector((state) => state.Location);
  const { clubGame } = useSelector((state) => state.clubGame);
  const { clubWorking } = useSelector((state) => state.clubWorking);
  const { clubAmenity } = useSelector((state) => state.clubAmenities);
  const { clubImage } = useSelector((state) => state.clubImages);
  const { courts } = useSelector((state) => state.courtList);

  useEffect(() => {
    if (courts) {
      setSelectedCourt(courts[0]?.name);
    }
  }, [courts, setSelectedCourt]);

  const handleClick = () => {
    navigate(`/bookinginfo/${clubLocation.id}`);
  };

  return (
    <div>
      <Header location="nav-all" />
      <Toaster />
      <div className="club-detail">
        <div className="carousel-container">
          <Carousel
            className="cc"
            autoPlay
            infiniteLoop
            transition="crossfade"
            width={600}
            showThumbs={false}
          >
            {clubImage?.map((image) => (
              <div key={image.id}>
                <img
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
          <div className="rating">
            <Rating
              value={clubLocation?.rating}
              text={`${clubLocation?.numRatings} reviews`}
              color={"#f8e825"}
            />
          </div>
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
                  <IoMdCloseCircleOutline
                    onClick={handlePopupToggle}
                    style={{ float: "right" }}
                  />
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
      <div>
        <div className="review-section">
          <h4>Reviews</h4>
          {clubLocation?.numRatings === 0 && <span>No Reviews</span>}

          <div className="review-list">
            {clubReviews?.map((review) => (
              <div key={review.id} className="review-item">
                <strong>{review.name}</strong>
                <Rating value={review.rating} color="#f8e825" />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Write a Review Form */}
          <div className="write-review">
            <h4>Write a review</h4>

            {loadingclubReview && <Loader />}
            {successclubReview && (
              <Message variant="success">Review Submitted</Message>
            )}
            {errorclubReview && (
              <Message variant="danger">{errorclubReview}</Message>
            )}

            {userInfo ? (
              <form onSubmit={submitHandler}>
                <label htmlFor="rating">Rating</label>
                <select
                  className="form-control"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>

                <label htmlFor="comment">Review</label>
                <textarea
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <div>
                  <button
                    disabled={loadingclubReview}
                    type="submit"
                    className="btn1"
                  >
                    Submit
                  </button>
                </div>
              </form>
            ) : (
              <span>
                Please <Link to="/login">login</Link> to write a review
              </span>
            )}
          </div>
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
