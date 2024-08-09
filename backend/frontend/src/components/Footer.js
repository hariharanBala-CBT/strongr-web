import React from "react";
import { Mail, Phone } from "react-feather";
import "../css/footer.css";
import { useTranslation } from "react-i18next";

function Footer({ name }) {
  const { t } = useTranslation("footer");
  return (
    <footer id="contact-us-footer" className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">{t("contactUs")}</h4>
                <div className="footer-address-blk">
                  <div className="footer-call">
                    <span>{t("tollFreeCustomerCare")}</span>
                    <p>
                      <span>
                        <Phone size={20} />
                      </span>
                      9999999999
                    </p>
                  </div>
                  <div className="footer-call">
                    <span>{t("needLiveSupport")}</span>
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
                <h4 className="footer-title">{t("quickLinks")}</h4>
                <ul>
                  <li>
                    <a href="javascript:void(0);">{t("aboutUs")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("services")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("events")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("blogs")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("contactUs")}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">{t("support")}</h4>
                <ul>
                  <li>
                    <a href="javascript:void(0);">{t("contactUs")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("faq")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("privacyPolicy")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("termsConditions")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("pricing")}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="footer-widget footer-menu">
                <h4 className="footer-title">{t("otherLinks")}</h4>
                <ul>
                  <li>
                    <a href="javascript:void(0);">{t("coaches")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("sportsVenue")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("joinAsCoach")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("addVenue")}</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">{t("myAccount")}</a>
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
                    {t("copyright")} &copy; {new Date().getFullYear()} Strongr. {t("allRightsReserved")}
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
