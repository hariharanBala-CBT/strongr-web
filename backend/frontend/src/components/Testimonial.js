import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../css/testimonial.css";
import TestimonialDetails from "./TestimonialDetails";
import testimonialProfile from "../images/profile.jpg";
import { useTranslation } from "react-i18next";

const Testimonial = () => {
  const { t } = useTranslation("testimonial");
  const testiMonials = [
    {
      title: "Personalized Attention",
      name: "Ariyan Rusov",
      description:
        "StrongrSports' coaching services enhanced my badminton skills. Personalized attention from knowledgeable coaches propelled my game to new heights.",
      gametype: "Badminton",
      img: testimonialProfile,
    },
    {
      title: "Quality Matters !",
      name: "Darren Valdez",
      description:
        "StrongrSports' advanced badminton equipment has greatly improved my performance on the court. Their quality range of rackets and shoes made a significant impact.",
      gametype: "Badminton",
      img: testimonialProfile,
    },
    {
      title: "Excellent Professionalism !",
      name: "Elinor Dunn",
      description:
        "StrongrSports' unmatched professionalism and service excellence left a positive experience. Highly recommended for court rentals and equipment purchases.",
      gametype: "Badminton",
      img: testimonialProfile,
    },
    {
      title: "Personalized Attention",
      name: "Ariyan Rusov",
      description:
        "StrongrSports' coaching services enhanced my badminton skills. Personalized attention from knowledgeable coaches propelled my game to new heights.",
      gametype: "Badminton",
      img: testimonialProfile,
    },
  ];
  //Owl Carousel Settings
  const options = {
    loop: true,
    center: true,
    items: 3,
    margin: 0,
    autoplay: true,
    dots: true,
    autoplayTimeout: 8500,
    smartSpeed: 450,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3,
      },
      1000: {
        items: 3,
      },
    },
  };
  return (
    <section className="section our-testimonials">
      <div className="container">
        <div className="section-heading aos" data-aos="fade-up">
          <h2>
            {t("our")} <span>{t("testimonials")}</span>
          </h2>
          <p className="sub-title">
          {t("subtitle")}
          </p>
        </div>
        <div className="row">
          <div className="featured-slider-group">
            <div className="owl-carousel featured-venues-slider owl-theme">
              <OwlCarousel
                id="customer-testimonoals"
                className="owl-carousel owl-theme"
                {...options}
              >
                {testiMonials.length === 0 ? (
                  <div className="testimonial-group">
                    <div className="testimonial-review">
                      <div className="rating-point">
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <i className="fas fa-star filled"></i>
                        <span> 5.0</span>
                      </div>
                      <h5>Personalized Attention</h5>
                      <p>
                        StrongrSports' coaching services enhanced my badminton
                        skills. Personalized attention from knowledgeable
                        coaches propelled my game to new heights.
                      </p>
                    </div>
                    <div className="listing-venue-owner">
                      <span className="navigation">
                        <img src={testimonialProfile} alt="User" />
                      </span>
                      <div className="testimonial-content">
                        <h5>
                          <>Ariyan Rusov</>
                        </h5>
                        <span
                          className="btn btn-primary "
                        >
                          Badminton
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  testiMonials.map((testiMonialDetail) => {
                    return (
                      <TestimonialDetails
                        testiMonialDetail={testiMonialDetail}
                        key={testiMonialDetail._key}
                      />
                    );
                  })
                )}
              </OwlCarousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
