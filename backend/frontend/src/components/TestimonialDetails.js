import React from "react";
const TestimonialDetails = ({ testiMonialDetail }) => {
  const { description, gametype, img, name, title } = testiMonialDetail;
  return (
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
        <h5>{title}</h5>
        <p>{description}</p>
      </div>
      <div className="listing-venue-owner">
        <a className="navigation">
          <img src={img} alt="User" />
        </a>
        <div className="testimonial-content">
          <h5>
            <a>{name}</a>
          </h5>
          <a className="btn btn-primary ">
            {gametype}
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestimonialDetails;
