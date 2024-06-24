import React from "react";
import VenueDetails from "./VenueDetails";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../css/venue.css";
import venueImage1 from "../images/venue1.jpg";
import venueImage2 from "../images/venue2.jpg";
import venueImage3 from "../images/venue3.jpg";
import venueImage4 from "../images/venue4.jpg";

const Venue = () => {
  const Venues = [
    {
      name: "Ramesh Kumar",
      description:
        "outdoor sports, concerts, or other events and consists of a field or stage completely surrounded by a tiered structure designed to allow spectators to stand or sit and view the event.",
      address: "Ramapuram",
      img: venueImage1,
    },
    {
      name: "Brandon Savage",
      description:
        "outdoor sports, concerts, or other events and consists of a field or stage completely surrounded by a tiered structure designed to allow spectators to stand or sit and view the event.",
      address: "Ashok Nagar",
      img: venueImage2,
    },
    {
      name: "Steve Burns",
      description:
        "outdoor sports, concerts, or other events and consists of a field or stage completely surrounded by a tiered structure designed to allow spectators to stand or sit and view the event.",
      address: "Ashok Nagar",
      img: venueImage3,
    },
    {
      name: "Kevin Canlas",
      description:
        "outdoor sports, concerts, or other events and consists of a field or stage completely surrounded by a tiered structure designed to allow spectators to stand or sit and view the event.",
      address: "Ashok Nagar",
      img: venueImage4,
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
    <section className="section featured-venues">
      <div className="container">
        <div className="section-heading aos" data-aos="fade-up">
          <h2>
            Featured <span>Venues</span>
          </h2>
          <p className="sub-title">
            Advanced sports venues offer the latest facilities, dynamic and
            unique environments for enhanced badminton performance.
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
                {Venues.length === 0 ? (
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
                  Venues.map((testiMonialDetail) => {
                    return (
                      <VenueDetails
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

        <div
          className="view-all text-center aos viewall-feature"
          data-aos="fade-up"
        >
          <a
            href="javascript:void(0);"
            className="btn btn-secondary d-inline-flex align-items-center"
          >
            View All Featured
            <span className="lh-1">
              <i className="feather-arrow-right-circle ms-2"></i>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Venue;
