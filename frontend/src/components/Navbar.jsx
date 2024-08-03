import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <nav className="navbar">
          <a className="navbar-brand" href="/">
            <img src="../../Logo.png" alt="Logo" width="125" height="75" />
          </a>
        </nav>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
