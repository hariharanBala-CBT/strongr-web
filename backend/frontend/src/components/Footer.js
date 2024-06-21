import React from "react";
import "../css/footer.css";
import { Phone, Mail } from "react-feather";

function Footer({ name }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Contact us</h4>
                <div className="footer-address-blk">
                  <div className="footer-call">
                    <span>Toll free Customer Care</span>
                    <p>
                      <span>
                        <Phone size={20} />
                      </span>
                      9999999999
                    </p>
                  </div>
                  <div className="footer-call">
                    <span>Need Live Support</span>
                    <p>
                      <span>
                        <Mail size={20} />
                      </span>
                      strongr@gmail.com
                    </p>
                  </div>
                </div>
                <div className="social-icon">
                  <ul>
                    <li>
                      <a href="javascript:void(0);" className="facebook">
                        <i className="fab fa-facebook-f"></i>{" "}
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);" className="twitter">
                        <i className="fab fa-twitter"></i>{" "}
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);" className="instagram">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);" className="linked-in">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Quick Links</h4>
                <ul>
                  <li>
                    <a href="javascript:void(0);">About us</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Services</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Events</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Blogs</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Contact us</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Support</h4>
                <ul>
                  <li>
                    <a href="javascript:void(0);">Contact Us</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Faq</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Pricing</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">Other Links</h4>
                <ul>
                  <li>
                    <a href="javascript:void(0);">Coaches</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Sports Venue</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Join As Coach</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Add Venue</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">My Account</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="copyright">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="copyright-text">
                  <p className="mb-0">
                    &copy; 2024 STRONGR - All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
