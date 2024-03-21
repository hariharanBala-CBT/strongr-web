import "../css/header.css";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../actions/actions'

function Header({ location }) {
  const dispatch = useDispatch()
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
            <i className="fas fa-bolt"></i> Strongr.
          </div>
        </LinkContainer>

        <div className="nav-links">


          {userInfo ? (
            <LinkContainer to="/profile">
              <div className="link">
                <i className="fas fa-user"></i> {userInfo.first_name}
              </div>
            </LinkContainer>
          ) : (
            <LinkContainer to="/login">
              <div className="link">
                <i className="fas fa-user"></i> Login
              </div>
            </LinkContainer>
          )}

          {!userInfo && (
            <a href="http://127.0.0.1:8000/signup/" className="link">Work with us</a>
          )}

          {userInfo && (
            <div className="link" onClick={logoutHandler}>
               <i className="fas fa-sign-out-alt"></i>
            </div>
          )}

          
        </div>
      </nav>
    </header>
  );
}

export default Header;
