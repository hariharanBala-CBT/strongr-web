import React from "react";
import "../css/clubsearchscreen.css";

function Footer ({name} ){
  return (
    <footer className={name}>
      <div className="footer-content">
        <p>Copyright&copy; {new Date().getFullYear()} Strongr. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
