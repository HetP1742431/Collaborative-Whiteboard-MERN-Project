import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { api } from "../apiConfig";
import "./Navbar.css";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="../../Logo.png" alt="Logo" width="125" height="75" />
        </a>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/whiteboards/create">
                    Create New Whiteboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/whiteboards/join">
                    Join Existing Whiteboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={`/whiteboards/${user.username}/all`}
                  >
                    My Whiteboards
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-primary text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/users/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link btn btn-primary text-white"
                    to="/users/signup"
                  >
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
