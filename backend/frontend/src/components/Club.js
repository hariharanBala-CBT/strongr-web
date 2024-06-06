import React from "react";
import "../css/club.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
// import { LinkContainer } from "react-router-bootstrap";
import Rating from "./Rating";
import { useNavigate } from "react-router-dom";

function Club({ clubs }) {
  const navigate = useNavigate();

  const handleViewDetails = (club) => {
    navigate(`/club/${club.id}`);
  };

  return (
    <div className="clubs-display">
      {clubs &&
        clubs.map((club) => (
          <div className="flip-card" onClick={() => handleViewDetails(club)}>
            <div className="flip-card-inner">
              <Card key={club.id} className="flip-card-front">
                <div className="flip-card-front">
                  <Card.Img
                    variant="top"
                    src={club && club?.organization_images}
                    alt="Image"
                    className="image"
                  />

                  <Card.Body>
                    <Card.Title>
                      {club.organization.organization_name}
                    </Card.Title>
                    {/* <Card.Text
                      style={{ textDecoration: "none", color: "gray" }}
                    >
                      {club.numRatings > 0 && (
                        <Rating
                          value={club.rating}
                          text={`${club.numRatings} reviews`}
                          color={"#f8e825"}
                        />
                      )}

                      <div>{club.address_line_1}</div>
                    </Card.Text> */}
                  </Card.Body>
                </div>
              </Card>
              <Card key={club.id} className="flip-card-back">
                <Card.Body className="content">
                  <Card.Title>{club.organization.organization_name}</Card.Title>
                  <Card.Text style={{ textDecoration: "none", color: "gray" }}>
                    {club.numRatings >= 0 && (
                      <Rating
                        value={club.rating}
                        text={`${club.numRatings} reviews`}
                        color={"#f8e825"}
                      />
                    )}

                    <div>{club.address_line_1}</div>
                    <strong>{club?.area?.area_name}</strong>
                    <Button
                      variant="outline-dark"
                      onClick={() => handleViewDetails(club)}
                    >
                      View Details
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Club;
