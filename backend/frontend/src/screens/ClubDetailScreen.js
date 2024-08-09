import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import toast, { Toaster } from "react-hot-toast";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { LinkContainer } from "react-router-bootstrap";
import { useTranslation } from "react-i18next";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
} from "react-feather";
import profileImage from "../images/profile.jpg";
import noImage2 from "../images/venue3.jpg";

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
import { fixImageUrls } from "../utils/imageUtils";
import { formatAddress } from "../utils/spacingUtils";

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
  const { t } = useTranslation("clubdetailscreen");

  const [rating, setRating] = useState("");
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
      toast.success(t("reviewSubmitted"));
    }
  }, [successclubReview, t]);

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
    e.preventDefault();
    setPopupVisible(!isPopupVisible);
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
      toast.error(t('incorrectCredentials'));
      setOpenForm(true);
      setLoader(false);
      setIsLogin(false);
    }
  }, [isLogin, LoginError, t]);

  useEffect(() => {
    if (userLoginSuccess && isLogin) {
      toast.success(t('loggedInSuccessfully'));
      setOpenForm(false);
      setIsLogin(false);
    }
  }, [isLogin, userLoginSuccess, t]);

  useEffect(() => {
    fixImageUrls();
  }, [clubImage]);
  
  return (
    <div className="venue-club-details">
      <Header location="nav-all" />
      <Toaster />
      <section className="breadcrumb breadcrumb-list mb-0">
        <span className="primary-right-round"></span>
        <div className="container">
          <h1 className="text-white">{t("venueDetails")}</h1>
          <ul>
            <li className="breadcrumb-icons">
              <a href="/">{t("home")}</a>
            </li>
            <li className="breadcrumb-icons">
              <Link to="/clubs">
                {t("venueList")}
              </Link>
            </li>
            <li>{t("venueDetails")}</li>
          </ul>
        </div>
      </section>
      <div className="venue-info white-bg d-block">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6">
              <h1 className="d-flex align-items-center justify-content-start">
                {clubLocation?.organization?.organization_name}
                <span className="d-flex justify-content-center align-items-center">
                  <i className="fas fa-check-double"></i>
                </span>
              </h1>
              <ul className="d-sm-flex justify-content-start align-items-center">
                <li>
                  <i className="feather-map-pin">
                    <MapPin />
                  </i>
                    {formatAddress(clubLocation?.address_line_1)}
                    {formatAddress(clubLocation?.address_line_2)}
                    {(clubLocation?.pincode)}                
                  </li>
                <li>
                  <i className="feather-phone-call">
                    <Phone />
                  </i>
                  {clubLocation?.phone_number}
                </li>
                <li>
                  <i className="feather-mail">
                    <Mail />
                  </i>
                  <a href="/cdn-cgi/l/email-protection#acd5c3d9dec1cdc5c0ecc9d4cdc1dcc0c982cfc3c1">
                    {" "}
                    <span
                      className="__cf_email__"
                      data-cfemail="c6bfa9b3b4aba7afaa86a3bea7abb6aaa3e8a5a9ab"
                    >
                      strongrtest@gmail.com
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 text-right">
              <ul className="social-options float-lg-end d-sm-flex justify-content-start align-items-center">
                <li className="venue-review-info d-flex justify-content-start align-items-center">
                  <span className="d-flex justify-content-center align-items-center">
                    {clubLocation?.rating}
                  </span>
                  <div className="review">
                    <div className="rating">
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                      <i className="fas fa-star filled"></i>
                    </div>
                    <p className="mb-0">
                      <a>
                      {t("reviews", { count: clubLocation?.numRatings })}
                      </a>
                    </p>
                  </div>
                  <i className="fa-regular fa-comments"></i>
                </li>
              </ul>
            </div>
          </div>
          <hr />
          <div className="row bottom-row d-flex align-items-center">
            {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <ul className="d-sm-flex details">
                <li>
                  <div className="profile-pic">
                    <a className="venue-type">
                      <img
                        className="img-fluid"
                        src={venueTypeImage}
                        alt="Icon"
                      />
                    </a>
                  </div>
                  <div className="ms-2 venuetype-container">
                    <p>{t("venueType")}</p>
                    <h6 className="mb-0">{t("indoor")}</h6>
                  </div>
                </li>
                <li>
                  <div className="profile-pic">
                    <a>
                      <img
                        className="img-fluid"
                        src={profileImage}
                        alt="Icon"
                      />
                    </a>
                  </div>
                  <div className="ms-2 addedtype-container">
                    <p>{t("addedBy")}</p>
                    <h6 className="mb-0">Hendry Williams</h6>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-6">
              <div className="d-flex float-sm-end align-items-center">
                <p className="d-inline-block me-2 mb-0">{t("startsFrom")}:</p>
                <h3 className="primary-text mb-0 d-inline-block">
                  ₹150<span>/ hr</span>
                </h3>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="content">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-8">
              <div className="accordion" id="accordionPanel">
                <div className="accordion-item mb-4" id="overview">
                  <h4 className="accordion-header" id="panelsStayOpen-overview">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseOne"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                    >
                      {t("overview")}
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-overview"
                  >
                    <div className="accordion-body">
                      <div className="text show-more-height">
                        <p>
                        {clubLocation?.organization?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="accordion-item mb-4" id="includes">
                  <h4 className="accordion-header" id="panelsStayOpen-includes">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseTwo"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseTwo"
                    >
                      {t("includes")}
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseTwo"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-includes"
                  >
                    <div className="accordion-body">
                      <ul className="clearfix">
                        <li>
                          <i className="feather-check-square">
                            <CheckSquare />
                          </i>
                          Badminton Racket Unlimited
                        </li>
                        <li>
                          <i className="feather-check-square">
                            <CheckSquare />
                          </i>
                          Bats
                        </li>
                        <li>
                          <i className="feather-check-square">
                            <CheckSquare />
                          </i>
                          Hitting Machines
                        </li>
                        <li>
                          <i className="feather-check-square">
                            <CheckSquare />
                          </i>
                          Multiple Courts
                        </li>
                        <li>
                          <i className="feather-check-square">
                            <CheckSquare />
                          </i>
                          Spare Players
                        </li>
                        <li>
                          <i className="feather-check-square">
                            <CheckSquare />
                          </i>
                          Instant Racket
                        </li>
                        <li>
                          <i className="feather-check-square">
                            <CheckSquare />
                          </i>
                          Green Turfs
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="rules">
                  <h4 className="accordion-header" id="panelsStayOpen-rules">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseThree"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseThree"
                    >
                      {t("rules")}
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseThree"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-rules"
                  >
                    <div className="accordion-body">
                      <ul>
                        <li>
                          <p>
                            <i className="feather-alert-octagon">
                              <AlertOctagon />
                            </i>
                            Non Marking Shoes are recommended not mandatory for
                            Badminton.
                          </p>
                        </li>
                        <li>
                          <p>
                            <i className="feather-alert-octagon">
                              <AlertOctagon />
                            </i>
                            A maximum number of members per booking per
                            badminton court is admissible fixed by Venue Vendors
                          </p>
                        </li>
                        <li>
                          <p>
                            <i className="feather-alert-octagon">
                              <AlertOctagon />
                            </i>
                            No pets, no seeds, no gum, no glass, no hitting or
                            swinging outside of the cage
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div> */}
                <div className="accordion-item mb-4" id="amenities">
                  <h4
                    className="accordion-header"
                    id="panelsStayOpen-amenities"
                  >
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseFour"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseFour"
                    >
                      {t("amenities")}
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseFour"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-amenities"
                  >
                    <div className="accordion-body">
                      <ul className="d-md-flex justify-content-between align-items-center amenity">
                        {clubAmenity?.is_parking === true && (
                          <li>
                            <i
                              className="fa fa-check-circle"
                              aria-hidden="true"
                            ></i>
                            <span>{t("parking")}</span>
                          </li>
                        )}
                        {clubAmenity?.is_restrooms === true && (
                          <li>
                            <i
                              className="fa fa-check-circle"
                              aria-hidden="true"
                            ></i>
                            <span>{t("restrooms")}</span>
                          </li>
                        )}
                        {clubAmenity?.is_changerooms === true && (
                          <li>
                            <i
                              className="fa fa-check-circle"
                              aria-hidden="true"
                            ></i>
                            <span>{t("changeRooms")}</span>
                          </li>
                        )}
                        {clubAmenity?.is_powerbackup === true && (
                          <li>
                            <i
                              className="fa fa-check-circle"
                              aria-hidden="true"
                            ></i>
                            <span>{t("powerBackup")}</span>
                          </li>
                        )}
                        {clubAmenity?.is_beverages_facility === true && (
                          <li>
                            <i
                              className="fa fa-check-circle"
                              aria-hidden="true"
                            ></i>
                            <span>{t("beveragesFacility")}</span>
                          </li>
                        )}
                        {clubAmenity?.is_coaching_facilities === true && (
                          <li>
                            <i
                              className="fa fa-check-circle"
                              aria-hidden="true"
                            ></i>
                            <span>{t("coachingFacility")}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-4" id="gallery">
                  <h4 className="accordion-header" id="panelsStayOpen-gallery">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseFive"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseFive"
                    >
                      {t("gallery")}
                    </button>
                  </h4>
                  <div
                    id="panelsStayOpen-collapseFive"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-gallery"
                  >
                    <div className="accordion-body">
                      <div className="carousel-container">
                        <Carousel
                          className="cc"
                          autoPlay
                          infiniteLoop
                          transition="crossfade"
                          // width={500}
                          showThumbs={false}
                        >
                          {clubImage ? (
                            clubImage?.map((image) => (
                              <div key={image.id}>
                                <img
                                  src={image.image}
                                  alt={t("carouselImgAlt")}
                                  className="carousel-img"
                                />
                              </div>
                            ))
                          ) : (
                            <>
                              <div>
                                <img
                                  src={noImage2}
                                  alt={t("carouselImgAlt")}
                                  className="carousel-img"
                                />
                              </div>
                            </>
                          )}
                        </Carousel>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="accordion-item mb-4" id="reviews">
                  <div className="accordion-header" id="panelsStayOpen-reviews">
                    <div className="review-wrapper-new ">
                      <div>
                        <span className="w-75 mb-0">{t("review")}</span>
                      </div>
                      <div className="review-wrapper-last">
                        <div>
                          {userInfo && <button> {t("writeReview")}</button>}
                          <p>
                            {!userInfo && (
                              <span className="login-remainder">
                                {t("please")}{" "}
                                <a href="#" onClick={handleSubmit}>
                                  {t("login")}
                                </a>{" "}
                                {t("toWriteReview")}
                              </span>
                            )}
                          </p>
                        </div>
                        {/* <span>icon</span> */}
                      </div>
                    </div>
                  </div>
                  <div
                    id="panelsStayOpen-collapseSix"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-reviews"
                  >
                    <div className="accordion-body">
                       {/* <div className="row review-wrapper">
                        <div className="col-lg-3">
                          <div className="ratings-info corner-radius-10 text-center">
                            <h3>4.8</h3>
                            <span>out of 5.0</span>
                            <div className="rating">
                              <i className="fas fa-star filled"></i>
                              <i className="fas fa-star filled"></i>
                              <i className="fas fa-star filled"></i>
                              <i className="fas fa-star filled"></i>
                              <i className="fas fa-star filled"></i>
                            </div>
                          </div>
                        </div>
                       <div className="col-lg-9">
                          <div className="recommended">
                            <h5>Recommended by 97% of Players</h5>
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 mb-3">
                                <p className="mb-0">{t("qualityOfService")}</p>
                                <ul>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 mb-3">
                                <p className="mb-0">{t("qualityOfService")}</p>
                                <ul>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4 mb-3">
                                <p className="mb-0">{t("qualityOfService")}</p>
                                <ul>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                <p className="mb-0">{t("qualityOfService")}</p>
                                <ul>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                <p className="mb-0">{t("qualityOfService")}</p>
                                <ul>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <i></i>
                                  </li>
                                  <li>
                                    <span>5.0</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div> 
                      </div>*/}
                      <div className="row review-wrapper review-form-wrapper">
                        {loadingclubReview && <Loader />}

                        {userInfo && (
                          <>
                            <h4>{t("writeReview")}</h4>
                            <form onSubmit={submitHandler}>
                              <div className="row mb-3">
                                <label
                                  htmlFor="inputEmail3"
                                  className="col-sm-2 col-form-label"
                                >
                                  {t("rating")}
                                </label>
                                <div className="col-sm-10">
                                  <select
                                    className="form-select"
                                    aria-label="Default select example"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                  >
                                    <option value="" disabled hidden>{t("select")}...</option>
                                    <option value="1">1 - {t("poor")}</option>
                                    <option value="2">2 - {t("fair")}</option>
                                    <option value="3">3 - {t("good")}</option>
                                    <option value="4">4 - {t("veryGood")}</option>
                                    <option value="5">5 - {t("excellent")}</option>
                                  </select>
                                </div>
                              </div>
                              <div className="row mb-3">
                                <label
                                  htmlFor="floatingTextarea2"
                                  className="col-sm-2 col-form-label"
                                >
                                  {t("comments")}
                                </label>
                                <div className="col-sm-10">
                                  <div className="form-floating">
                                    <textarea
                                      className="form-control"
                                      id="floatingTextarea2"
                                      value={comment}
                                      onChange={(e) =>
                                        setComment(e.target.value)
                                      }
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12">
                                <button
                                  type="submit"
                                  disabled={loadingclubReview}
                                  className="btn btn-gradient pull-right write-review add-review"
                                >
                                  {t("submit")}
                                </button>
                              </div>
                            </form>
                          </>
                        )}
                      </div>
                      {clubReviews?.map((review) => (
                        <div className="review-box d-md-flex">
                          <div className="review-profile">
                            <img src={profileImage} alt={t("userAlt")}/>
                          </div>
                          <div className="review-info">
                            <h6 className="mb-2 tittle">{review.name}</h6>
                            <Rating value={review.rating} color="#FFAA00" />
                            <p>{review.comment}</p>
                            <span className="post-date">
                              {review.createdAt.substring(0, 10)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <aside className="col-12 col-sm-12 col-md-12 col-lg-4 theiaStickySidebar">
              <div className="white-bg d-flex justify-content-start align-items-center availability">
                {!isPopupVisible && (
                  <>
                    <div>
                      <span className="icon-bg">
                        <Calendar size={35} color={"#097E52"} />
                      </span>
                    </div>
                    <div className="club-timings">
                      <h4>
                        <a onClick={handleOverlayClick}>{t("viewTimings")}</a>
                      </h4>
                    </div>
                  </>
                )}
                {isPopupVisible && (
                  <div className="popup-overlay" onClick={handleOverlayClick}>
                    <div className="popup-content">
                      <IoMdCloseCircleOutline
                        onClick={handlePopupToggle}
                        style={{ float: "right" }}
                      />
                      <h4>{t("workingTimings")}</h4>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>{t("day")}</th>
                            <th>{t("startTime")}</th>
                            <th>{t("endTime")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clubWorking?.map((day) => (
                            <tr key={day.id}>
                              <td>{t(day.days)}</td>
                              <td>{day.work_from_time?.slice(0, 5)}</td>
                              <td>{day.work_to_time?.slice(0, 5)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              {/*  <div className="white-bg d-flex justify-content-start align-items-center availability">
               <div className="gamesList">
                  <h4>{t("games")}</h4>
                  {clubGame?.map((game) => (
                    <span key={game.id}>
                      {game.game_type.game_name}: ₹{game.pricing}
                      <br />
                    </span>
                  ))}
                </div>
              </div> */}
              <div className="white-bg book-court">
                <h4 className="border-bottom">{t("bookACourt")}</h4>
                <h5 className="d-inline-block">{t("games")} </h5>
                <br/>
                <p className="d-inline-block"> {t("availableNow")}</p>
                <ul className="d-sm-flex align-items-center justify-content-evenly">
                  <li>
                    <div className="games-container">
                      {clubGame?.map((game) => (
                        <div key={game.id} className="game-item">
                          <h3 className="primary-text">
                            {game.game_type.game_name}
                          </h3>
                          <p>₹{game.pricing}</p>
                        </div>
                      ))}
                    </div>
                  </li>
                  {/* <li>
                    <span>
                      <i className="feather-plus"></i>
                    </span>
                  </li> */}
                  {/* <li>
                    <h4 className="d-inline-block primary-text">₹500</h4>
                    <span>/hr</span>
                    <p>
                    {t("eachAdditionalGuest")} <br />
                    {t("maxGuests")}
                    </p>
                  </li> */}
                </ul>
                <div className="d-grid btn-block mt-3">
                  <a
                    className="btn btn-secondary d-inline-flex justify-content-center align-items-center booknow-wrapper"
                    onClick={handleClick}
                  >
                    <i className="feather-calendar">
                      <Calendar />
                    </i>
                    {t("book")}
                  </a>
                </div>
              </div>
              {/* <div className="white-bg listing-owner">
                <h4 className="border-bottom">{("listingByOwner")}</h4>
                <ul>
                  <li className="d-flex justify-content-start align-items-center">
                    <div className>
                      <a href="blog-details.html">
                        <img
                          className="img-fluid"
                          alt="Venue"
                          src={venueImage}
                        />
                      </a>
                    </div>
                    <div className="owner-info">
                      <h5>
                        <a href="blog-details.html">Manchester Academy</a>
                      </h5>
                      <p>
                        <i className="feather-map-pin"></i>
                        <span>Sacramento, CA</span>
                      </p>
                    </div>
                  </li>
                  <li className="d-flex justify-content-start align-items-center">
                    <div className>
                      <a href="blog-details.html">
                        <img
                          className="img-fluid"
                          alt="Venue"
                          src={venueImage2}
                        />
                      </a>
                    </div>
                    <div className="owner-info">
                      <h5>
                        <a href="blog-details.html">Sarah Sports Academy</a>
                      </h5>
                      <p>
                        <i className="feather-map-pin"></i>
                        <span>Sacramento, CA</span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div> */}
            </aside>
          </div>
        </div>
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
            <Alert severity="info">{t('loginToWriteReview')}</Alert>
            <form onSubmit={loginAndRedirect} className="booking-login-form">
              <h2 className="login-title">{t("login")}</h2>

              <label>{t("username")}</label>
              <input
                required
                type="text"
                placeholder={t("enterUsername")}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />

              <label>{t("password")}</label>
              <input
                required
                type="password"
                placeholder={t("enterPassword")}

                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <div className="login-button">
                <Button
                  type="submit"
                  className="btn-check-availability-home"
                  text={t("login")}
                />
              </div>
              <span>{t("dontHaveAnAccount")}</span>
              <LinkContainer to="/signup" style={linkStyle}>
                <span>{t("signup")}</span>
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
