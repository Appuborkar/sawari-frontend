import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

 
const Navbar = () => {
  const API_BASE_URL = process.env.REACT_APP_URL;
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch User Profile from Backend
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      axios
        .get(`${API_BASE_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user); // Store user data
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          localStorage.removeItem("authToken"); // Remove invalid token
          setUser(null);
        });
    }
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    setUser(null); // Reset user state
    navigate("/"); // Redirect to homepage
  };

  return (
    <nav className="navbar">
      {/* Logo & Sawari Name */}
      <div className="logo">
        <Link to="/">
          <img src={"/Assets/Logo.jpeg"} alt="Logo" className="logo-img" />
        </Link>
        <span className="sawari">Sawari</span> {/* Stylish Sawari Name */}
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-item" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/about" className="nav-item" onClick={() => setMenuOpen(false)}>
          About Us
        </Link>

        {/*If User Logged In, Show Profile, My Profile & Logout */}
        {user ? (
          <div className="user-profile">
           
            {/* My Profile Link */}
            <Link to="/profile" className="my-profile" onClick={() => setMenuOpen(false)}>
              MyProfile
            </Link>

            {/* Logout Button */}
            <div className="logout-btn" onClick={handleLogout}>
              Logout
            </div>
          </div>
        ) : (
          // ✅ If No User Logged In, Show Sign In / Sign Up
          <div className="auth-links">
            <Link to="/Signin" className="nav-item" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
            <Link to="/Signup" className="nav-item signup-btn" onClick={() => setMenuOpen(false)}>
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Hamburger Menu */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;
