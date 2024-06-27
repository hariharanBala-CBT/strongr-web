import React from "react";
import { useNavigate } from "react-router-dom";

import { useHomeContext } from "../context/HomeContext";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Rating from "./Rating";

import "../css/club.css";

function Club({ clubs }) {

  const navigate = useNavigate();

  const { recentlySearchedKeywords, setRecentlySearchedKeywords } = useHomeContext();

  const handleViewDetails = (club) => {
    if (club) {
      const updatedKeywords = [
        club.id,
        ...(Array.isArray(recentlySearchedKeywords)
          ? recentlySearchedKeywords.filter((k) => k !== club.id).slice(0, 3)
          : []),
      ];
      setRecentlySearchedKeywords([]);
      setRecentlySearchedKeywords(updatedKeywords);
    }
    navigate(`/club/${club.id}`);
  };

  return (
    <div className={clubs && "clubs-display"}>
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