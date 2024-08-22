import React from "react";
import VenueDetails from "./VenueDetails";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../css/venue.css";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Venue = () => {
  const { t } = useTranslation("venue");
  const { topRatedClubs } = useSelector(
    (state) => state.topRatedClubs
  );

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
    <section className="section featured-venues">
      <div className="container">
        <div className="section-heading aos" data-aos="fade-up">
          <h2>
            {t("heading")} <span>{t("sub")}</span>
          </h2>
          <p className="sub-title">
            {t("subTitle")}
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
                { topRatedClubs && topRatedClubs.length === 0 ? (
                  <div className="item">
                    <div className="shadow-effect">
                      <p>
                        The most fascinating thing about the ground is the crowd
                        support. It is common knowledge that the Chepauk crowd
                        is the most unbiased and the most knowledgeable crowd in
                        the country.
                      </p>
                    </div>
                    <div className="testimonial-name">
                      <h5>Rajon Rony</h5>
                      <small>ITALY</small>
                    </div>
                  </div>
                ) : (
                  topRatedClubs?.map((club) => (
                    <VenueDetails club={club} key={club.id} />
                  ))
                )}
              </OwlCarousel>
            </div>
          </div>
        </div>

        <div
          className="view-all text-center aos viewall-feature"
          data-aos="fade-up"
        >
          <div
            className="btn btn-secondary d-inline-flex align-items-center"
          >
            {t("viewAll")}
            <span className="lh-1">
              <i className="feather-arrow-right-circle ms-2"></i>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Venue;
