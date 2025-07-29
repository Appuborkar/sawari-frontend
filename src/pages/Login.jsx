import axios from "axios";
import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading] = useState(false);
  const navigate = useNavigate();
  const {login} = useAuth();

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

    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        const { authToken, user: userData } = response.data;

        login(userData, authToken); 
        setMessage("Login successful")
        navigate("/");
        
      } catch (error) {
        console.error("Login failed", error.response?.data || error.message);
        alert(JSON.stringify(error.response?.data, null, 2));
      }
    }
  };

  return (
    <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          {message && <p className="message">{message}</p>}
          <label className="login-label">Email <sup className="supertext">*</sup></label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <label className="login-label">Password <sup className="supertext">*</sup></label>
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
            <hr />
            <div className="D-signup">
            Don't have an account <Link to='/signup'>click here</Link>
          </div>
        </form>
    </div>
  );
};

export default Login;
