import React, { useState } from "react";
import "../css/club.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
import Rating from "./Rating";

function Club({ clubs, onClick }) {
  const [isButtonVisible, setButtonVisibility] = useState(false);

  const showButton = () => {
    setButtonVisibility(true);
  };

  const hideButton = () => {
    setButtonVisibility(false);
  };

  const handleViewDetails = (club) => {
    onClick(club.id);
  };

  return (
    <div className="clubs-display">
      {clubs &&
        clubs.map((club) => (
          <Card
            key={club.id}
            onMouseEnter={showButton}
            onMouseLeave={hideButton}
          >
            {isButtonVisible && (
              <LinkContainer to={`/club/${club.id}`}>
                <Button variant="outline-dark" onClick={() => handleViewDetails(club)}>View Details</Button>
              </LinkContainer>
            )}

            <Card.Img
              variant="top"
              src={club.organization_images[0]}
              alt="Image"
              className="image"
            />

            <Card.Body>
              <Card.Title>
                {club.organization.organization_name}
                {/* <small className="text-muted">500/hr</small> */}
              </Card.Title>
              <Card.Text style={{ textDecoration: "none", color: "gray" }}>
                {club.numRatings > 0 && (
                  <Rating
                    value={club.rating}
                    text={`${club.numRatings} reviews`}
                    color={"#f8e825"}
                  />
                )}

                <div>{club.address_line_1}</div>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
    </div>
  );
}

export default Club;
