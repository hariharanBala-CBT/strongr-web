import "../css/header.css";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/actions";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

function Header({ location }) {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <nav className={location}>
        <LinkContainer to="/">
          <div className="logo">
            <Tooltip title="Strongr" className="logo-icon">
              <IconButton className="title">
                <i className="fas fa-bolt icon-button" ></i> Strongr.
              </IconButton>
            </Tooltip>
          </div>
        </LinkContainer>

        <div className="nav-links">
          {userInfo ? (
            <LinkContainer to="/profile">
              <div className="link dropdown">
                <i className="fas fa-user icon-button"></i> {userInfo.first_name}
              </div>
            </LinkContainer>
          ) : (
            <LinkContainer to="/login">
              <div className="link">
                <i className="fas fa-user icon-button"></i> Login
              </div>
            </LinkContainer>
          )}

          {!userInfo && (
            <a href="http://127.0.0.1:8000/signup/" className="link">
              Work with us
            </a>
          )}

          {userInfo && (
            <div className="link" onClick={logoutHandler}>
              <Tooltip title="Logout" className="logout-icon">
                <IconButton>
                  <i className="fas fa-sign-out-alt icon-button"></i>
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
