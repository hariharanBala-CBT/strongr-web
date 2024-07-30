import { LinkContainer } from "react-router-bootstrap";
import { LogOut } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/actions";
import "../css/header.css";
import Logo from "../images/logo.png";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

function Header({ location }) {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { t } = useTranslation("header");
  const logoutHandler = () => {
    dispatch(logout());
  };

  const currentUrl = window.location.origin; //yields: "https://stacksnippets.net/js"
  // const baseUrl = currentUrl.split('/').slice(0, 3).join('/');

  return (
    <header className="header header-trans">
      <div className="container-fluid header-wrapper">
        <nav className="navbar navbar-expand-lg header-nav">
          <div className="navbar-header">
            <a id="mobile_btn" href="!#">
              <span className="bar-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </a>
            <LinkContainer to="/">
              <a href="#" className="navbar-brand logo">
                <img src={Logo} className="img-fluid" alt={t("logoAlt")} />
              </a>
            </LinkContainer>
          </div>
          <div className="main-menu-wrapper">
            <div className="menu-header">
              <a href="!#" className="menu-logo">
                <img
                  src="assets/img/logo-black.svg"
                  className="img-fluid"
                  alt={t("logoAlt")}
                />
              </a>
              <a
                id="menu_close"
                className="menu-close"
              >
                {" "}
                <i className="fas fa-times"></i>
              </a>
            </div>
            <ul className="main-nav">
              <li className="active">
                <a href="#/">{t("home")}</a>
              </li>
              <li>
                <a href="#">{t("contactUs")}</a>
              </li>
            </ul>
          </div>
          <ul className="nav header-navbar-rht header-right-banner">
            <li>
              <div className="link language-dropdown">
                <LanguageSelector />
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link btn btn-white log-register">
                {userInfo ? (
                  <LinkContainer to="/profile">
                    <div className="link dropdown">
                      <i className="fas fa-user icon-button"></i>{" "}
                      {userInfo.first_name}
                    </div>
                  </LinkContainer>
                ) : (
                  <LinkContainer to="/login">
                    <div className="link">
                      <i className="fas fa-user icon-button"></i> {t("login")}
                    </div>
                  </LinkContainer>
                )}
              </div>
            </li>
            <li className="nav-item">
              {!userInfo && (
                <a
                  href={`${currentUrl}/orglogin/`}
                  className="nav-link btn btn-secondary log-clublist"
                >
                  <span>
                    <i className="feather-check-circle"></i>
                  </span>
                  {t("workWithUs")}
                </a>
              )}
            </li>
            <li className="nav-item">
              {userInfo && (
                <div
                  className="nav-link btn btn-white log-register"
                  onClick={logoutHandler}
                >
                  <span>
                    <LogOut />
                  </span>
                  {t("logout")}
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
