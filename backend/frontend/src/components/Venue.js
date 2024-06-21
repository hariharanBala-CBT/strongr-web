import React from "react";
import VenueDetails from "./VenueDetails";
import $ from "jquery";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// import userPic from "../../image/user-one.png";
import "../css/venue.css";
import venueImage1 from "../images/venue1.jpg";
import venueImage2 from "../images/venue2.jpg";
import venueImage3 from "../images/venue3.jpg";
import venueImage4 from "../images/venue4.jpg";

// Ensure jQuery is available globally
window.jQuery = $;
window.$ = $;

const Venue = () => {
  const Venues = [
    {
      name: "Rekob Ramya",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.",
      address: "USA",
      img: venueImage1,
    },
    {
      name: "Brandon Savage",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.",
      address: "USA",
      img: venueImage2,
    },
    {
      name: "Steve Burns",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.",
      address: "USA",
      img: venueImage3,
    },
    {
      name: "Kevin Canlas",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s.",
      address: "USA",
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna.
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
            href="listing-grid.html"
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
