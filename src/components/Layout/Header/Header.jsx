import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header>
      <nav className="header-nav">
        <ul className="nav-left">
          <li>
            <Link
              to={isLoggedIn ? "/" : "/login"}
              className={location.pathname === "/" ? "active" : ""}
            >
              <img src="/assests/images/bookstoreimg.svg" alt="Bookstore" />
            </Link>
          </li>
        </ul>

        <ul className="nav-center">
          {isLoggedIn && (
            <li>
              <Link
                to="/home"
                className={location.pathname === "/home" ? "active" : ""}
              >
                Home
              </Link>
            </li>
          )}
        </ul>
        <ul className="nav-right">
          {isLoggedIn ? (
            <>
              <li>
                <Link
                  to="/favorites"
                  className={location.pathname === "/favorites" ? "active" : ""}
                >
                  <img
                    src="/assests/images/favorite-heart.svg"
                    alt="Favorites"
                  />
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className={location.pathname === "/login" ? "active" : ""}
              >
                <img src="/assests/images/userimg.svg" alt="Login" />
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
