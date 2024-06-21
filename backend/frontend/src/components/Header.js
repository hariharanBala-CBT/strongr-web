import "../css/header.css";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/actions";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Logo from "../images/logo.png";
import { User, LogOut } from "react-feather";

function Header({ location }) {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

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
            <a id="mobile_btn" href="javascript:void(0);">
              <span className="bar-icon">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </a>
            <LinkContainer to="/">
              <a href="#" className="navbar-brand logo">
                <img src={Logo} className="img-fluid" alt="Logo" />
              </a>
            </LinkContainer>
          </div>
          <div className="main-menu-wrapper">
            <div className="menu-header">
              <a href="#" className="menu-logo">
                <img
                  src="assets/img/logo-black.svg"
                  className="img-fluid"
                  alt="Logo"
                />
              </a>
              <a
                id="menu_close"
                className="menu-close"
                href="javascript:void(0);"
              >
                {" "}
                <i className="fas fa-times"></i>
              </a>
            </div>
            <ul className="main-nav">
              <li className="active">
                <a href="#/">Home</a>
              </li>
              <li className="has-submenu">
                <a href="#">
                  User <i className="fas"></i>
                </a>
              </li>
              <li className="has-submenu">
                <a href="#">
                  Pages <i className="fas"></i>
                </a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
          <ul className="nav header-navbar-rht header-right-banner">
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
                      <i className="fas fa-user icon-button"></i> Login
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
                  Work with us
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
                    Logout
                  </span>
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
