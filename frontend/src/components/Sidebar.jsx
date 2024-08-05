import React, { useState, useContext } from "react";
import {
  FaBars,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaPlusCircle,
  FaDoorOpen,
  FaListAlt,
  FaShare,
} from "react-icons/fa";
import { LiaBarsSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import api from "../apiConfig";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <div>
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        <LiaBarsSolid />
      </button>
      {isOpen && (
        <div className="sidebar">
          {user ? (
            <ul className="sub-menu">
              <li>
                <Link to="/whiteboards/create">
                  <FaPlusCircle className="symbol" /> Create new Whiteboard
                </Link>
              </li>
              <li>
                <Link to="/whiteboards/create">
                  <FaShare className="symbol" /> Share this Whiteboard
                </Link>
              </li>
              <li>
                <Link to="/whiteboards/join">
                  <FaDoorOpen className="symbol" /> Join Existing Whiteboard
                </Link>
              </li>

              <li>
                <Link to={`/whiteboards/${user.username}/all`}>
                  <FaListAlt className="symbol" /> View All Whiteboards
                </Link>
              </li>
              <li>
                <Link to="#" onClick={handleLogout}>
                  <FaSignOutAlt className="symbol" /> Log Out
                </Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link to="/users/login">
                  <FaSignInAlt className="symbol" /> Log In
                </Link>
              </li>
              <li>
                <Link to="/users/signup">
                  <FaUserPlus className="symbol" /> Sign Up
                </Link>
              </li>
              <li>
                <span>For live collaboration log in / signup</span>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
