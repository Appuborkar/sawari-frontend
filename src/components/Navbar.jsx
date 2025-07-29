import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import {Logo} from '../assets/image'
import { FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const { logout, user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) return null;

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={Logo} alt="logo" className="img-logo" />
        <span className="sawari">Sawari</span>
      </div>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? "active-link" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => `nav-item ${isActive ? "active-link" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          About Us
        </NavLink>
        {!user ? (
          <div className="auth-links">
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-item ${isActive ? "active-link" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>

            <NavLink
              to="/signup"
              className="nav-item signup-btn"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </NavLink>
          </div>
        ) : (
          <div className="user-links">
            <NavLink
              to="/profile"
              className={({ isActive }) => `nav-item ${isActive ? "active-link" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </NavLink>

            <button className="nav-item logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;
