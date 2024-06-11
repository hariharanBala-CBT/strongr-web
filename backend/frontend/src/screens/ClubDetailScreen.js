import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import toast, { Toaster } from "react-hot-toast";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { LinkContainer } from "react-router-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { useHomeContext } from "../context/HomeContext";

import Header from "../components/Header";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { Alert, Box, CircularProgress, Modal } from "@mui/material";

import {
  listclubLocation,
  listclubGame,
  listclubAmenities,
  listclubWorking,
  listClubImages,
  listCourts,
  createClubReview,
  listClubReviews,
  login,
  } from "../actions/actions";

import { CLUB_CREATE_REVIEW_RESET } from "../constants/constants";

import "../css/clubdetailscreen.css";

const linkStyle = {
  textDecoration: "underline",
  color: "purple",
  cursor: "pointer",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ClubDetailScreen() {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const { setSelectedCourt } = useHomeContext();

  const { userInfo, LoginError, userLoginSuccess } = useSelector(
    (state) => state.userLogin
  );
  const clubReviewCreate = useSelector((state) => state.clubReviewCreate);
  const { clubReviews } = useSelector((state) => state.clubReviews);

  const { loading: loadingclubReview, success: successclubReview } =
  clubReviewCreate;

  const gameName = localStorage.getItem("selectedGame");

  const loginAndRedirect = (e) => {
    e.preventDefault();
    setIsLogin(true);
    setLoader(true);
    dispatch(login(username, password));
    setUsername("");
    setPassword("");
    setLoader(true);
  };

  useEffect(() => {
    if (id) {
      dispatch(listClubReviews(id));
      dispatch(listclubLocation(id));
      dispatch(listclubGame(id));
      dispatch(listclubAmenities(id));
      dispatch(listclubWorking(id));
      dispatch(listClubImages(id));
      dispatch(listCourts(id, gameName));
    }
  }, [dispatch, gameName, id, successclubReview]);

  useEffect(() => {
    if (successclubReview) {
      toast.success("Review submitted");
    }
  }, [successclubReview]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createClubReview(id, {
        rating: Number(rating),
        comment,
      })
    ).then(() => {
      setRating(0);
      setComment("");
      dispatch({
        type: CLUB_CREATE_REVIEW_RESET,
      });
    });
  };


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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (userInfo) {
      setLoader(false);
    } else if (!userInfo) {
      setLoader(false);
      setOpenForm(true);
    }
  };

  useEffect(() => {
    if (LoginError && isLogin) {
      toast.error("Incorrect Credentials");
      setOpenForm(true);
      setLoader(false);
      setIsLogin(false);
    }
  }, [isLogin, LoginError]);

  useEffect(() => {
    if (userLoginSuccess && isLogin) {
      toast.success("Logged in successfully");
      setOpenForm(false);
      setIsLogin(false);
    }
  }, [isLogin, userLoginSuccess]);

  useEffect(() => {
    const fixImageUrls = () => {
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("https//")) {
          img.setAttribute("src", src.replace("https//", "https://"));
        }
      });
    };

    fixImageUrls();
  }, [clubImage]);

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
            {clubImage ? (
              clubImage?.map((image) => (
                <div key={image.id}>
                  <img
                    src={image.image}
                    alt="carousel-img"
                    className="carousel-img"
                  />
                </div>
              ))
            ) : (
              <>
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
              </>
            )}
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

          <div className="write-review">
            <h4>Write a review</h4>

            {loadingclubReview && <Loader />}

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
                  required
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
                Please{" "}
                <a href="#" onClick={handleSubmit}>
                  login
                </a>{" "}
                to write a review
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
      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {loader ? (
          <Box sx={style} className="otp-loader">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={style}>
            <Alert severity="info">Login to write a review</Alert>
            <form onSubmit={loginAndRedirect} className="booking-login-form">
              <h2 className="login-title">Login</h2>

              <label>Username</label>
              <input
                required
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />

              <label>Password</label>
              <input
                required
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <div className="login-button">
                <Button
                  type="submit"
                  className="btn-check-availability-home"
                  text="Login"
                />
              </div>
              <span>Don't have an account?</span>
              <LinkContainer to="/signup" style={linkStyle}>
                <span>Signup</span>
              </LinkContainer>
            </form>
          </Box>
        )}
      </Modal>
      <Footer />
    </div>
  );
}

export default ClubDetailScreen;
