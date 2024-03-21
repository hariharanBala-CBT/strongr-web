import React, { useState } from "react";
import "../css/club.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";

function Club({ clubs }) {
  const [isButtonVisible, setButtonVisibility] = useState(false);

  const showButton = () => {
    setButtonVisibility(true);
  };

  const hideButton = () => {
    setButtonVisibility(false);
  };

  return (
    <div className="clubs-display">
      {clubs && clubs.map((club) => (
        <Card key={club.id} onMouseEnter={showButton} onMouseLeave={hideButton}>
          {isButtonVisible && (
            <LinkContainer to={`/club/${club.id}`}>
              <Button variant="outline-dark">View Details</Button>
            </LinkContainer>
          )}

          <Card.Img
            variant="top"
            src="https://source.unsplash.com/Jr5x1CAWySo"
            alt="Image"
          />

          <Card.Body>
            <Card.Title>
              {club.organization.organization_name}
              {/* <small className="text-muted">500/hr</small> */}
            </Card.Title>
            <Card.Text style={{ textDecoration: "none", color: "gray" }}>
              <div>{club.address_line_1}</div>
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default Club;
