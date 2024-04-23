import React from "react";

function Rating({ value, text, color }) {
  console.log("Rating Value:", value);
  return (
    <div className="rating">
      <span>
        <i
          style={{ color }}
          className={
            value >= 1 
              ? "fas fa-star"
              : value === 0.5
              ? "fas fa-star-half-alt"
              : value < 0.5 && "far fa-star"
          }
        ></i>
      </span>

      <span>
        <i
          style={{ color }}
          className={
            value >= 2 
              ? "fas fa-star"
              : value === 1.5
              ? "fas fa-star-half-alt"
              :value < 1.5 &&  "far fa-star"
          }
        ></i>
      </span>

      <span>
        <i
          style={{ color }}
          className={
            value >= 3
              ? "fas fa-star"
              : value === 2.5
              ? "fas fa-star-half-alt"
              :value < 2.5 &&  "far fa-star"
          }
        ></i>
      </span>

      <span>
        <i
          style={{ color }}
          className={
            value >= 4 
              ? "fas fa-star"
              : value <4 && value >= 3.5
              ? "fas fa-star-half-alt"
              : value < 3.5 && "far fa-star"
          }
        ></i>
      </span>

      <span>
        <i
          style={{ color }}
          className={
            value >= 5
              ? "fas fa-star"
              : value === 4.5
              ? "fas fa-star-half-alt"
              : value < 4.5 && "far fa-star"
          }
        ></i>
      </span>

      <span>{text && text}</span>
    </div>
  );
}

export default Rating;