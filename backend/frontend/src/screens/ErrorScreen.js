import React from "react";
import "../css/errorscreen.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function ErrorScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation("errorscreen");

  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>Oops!</h1>
          <h2>404 - The Page can't be found</h2>
        </div>
        <Button onClick={() => navigate("/")}>Go To Homepage</Button>
      </div>
    </div>
  );
}

export default ErrorScreen;
