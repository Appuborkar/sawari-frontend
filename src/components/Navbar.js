import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminContext =
    location.pathname.startsWith("/adminLogin") ||
    location.pathname.startsWith("/dashboard");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          localStorage.removeItem("authToken");
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={"/Assets/Logo.jpeg"} alt="Logo" className="logo-img" />
        </Link>
        <span className="sawari">Sawari</span>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-item" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/about" className="nav-item" onClick={() => setMenuOpen(false)}>
          About Us
        </Link>

        {!isAdminContext && (
          user ? (
            <div className="user-profile">
              <Link to="/profile" className="my-profile" onClick={() => setMenuOpen(false)}>
                MyProfile
              </Link>
              <div className="logout-btn" onClick={handleLogout}>
                Logout
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/Signin" className="nav-item" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/Signup" className="nav-item signup-btn" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )
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
