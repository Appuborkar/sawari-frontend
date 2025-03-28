import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_URL; 
const SignInForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);
  const validate = () => {
    let tempErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      tempErrors.email = "Invalid email format";
    if (formData.password.length < 8)
      tempErrors.password = "Password must be at least 8 characters";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data before sending:", formData); // Debugging log
    if (validate()) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/login`,
          {
            email: formData.email, // Trim spaces
            password: formData.password
          },
          {
            headers: {
              "Content-Type": "application/json", // Ensure proper JSON format
              "Accept": "application/json",
            },
          }
        );
        console.log("Login successful", response.data);
        localStorage.setItem("authToken", response.data.authToken);
        navigate("/");
        window.location.reload();
      } catch (error) {
        console.error("Login failed", error.response?.data || error.message);
        alert(JSON.stringify(error.response?.data, null, 2));
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    window.location.reload();
    navigate("/");
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/google-signin`, {
        token: credentialResponse.credential,
      });
      if (response.data.success) {
        localStorage.setItem("authToken", response.data.authToken);
        setIsLoggedIn(true);
        navigate("/dashboard");
      } else {
        setMessage("Google sign-in failed. Try again.");
      }
    } catch (error) {
      console.error("Google login failed", error);
      setMessage("Google sign-in error. Try again.");
    }
  };
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="signin-container">
        {isLoggedIn ? (
          <div className="logged-in-section">
            <p>You are logged in!</p>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        ) : (
          <form className="signin-form" onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            {message && <p className="message">{message}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}

            <button type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="links">
              <Link to="/forgot-password">Forgot Password?</Link>
              <Link to="/signup">Not Registered? Click Here</Link>
            </div>

            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setMessage("Google Sign-In Failed")} />
          </form>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignInForm;
