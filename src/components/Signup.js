import axios from "axios";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_URL; 
const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    photo: "",
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);



  // Validation function
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      tempErrors.email = "Invalid email format";
    if (!formData.mobile.match(/^\d{10}$/))
      tempErrors.mobile = "Mobile number must be 10 digits";
    if (formData.password.length < 8)
      tempErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0]; // Get the uploaded file
  
      if (file) {
        setFormData({ ...formData, photo: file });
        setPreview(URL.createObjectURL(file)); // Create preview URL
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage("");

    const formDataToSend = new FormData();
    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("mobile", formData.mobile); // Corrected field
    formDataToSend.append("password", formData.password);


    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Server Response:", response.data); // Debugging

      if (response.data.authToken) {
        localStorage.setItem("authToken", response.data.authToken);
        setMessage("Signup successful! Redirecting to login...");
        navigate("/");
        window.location.reload();
      } else {
        setMessage(response.data.msg || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage(error.response?.data?.msg || "Signup failed. Please try again.");
      if (error.response) {
        console.log("Error Response Data:", error.response.data);
        console.log("Error Status Code:", error.response.status);
      }
    } finally {
      setLoading(false);
    }


  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Sign Up</h2>
        {message && <p>{message}</p>}
        {/* <label>Upload your photo</label> */}

        {/* Profile Photo Upload */}
        <div className="profile-photo-container">
        <label className="profile-photo-label">
  {preview ? (
    <img src={preview} alt="Profile Preview" className="profile-preview" />
  ) : (
    <FaUserCircle className="default-icon" />
  )}
  <input
    type="file"
    name="photo"
    accept="image/*"
    className="profile-photo-input"
    onChange={handleChange}
  />
</label>

        </div>


        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        {errors.email && <span className="error">{errors.email}</span>}
        <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} />
        {errors.mobile && <span className="error">{errors.mobile}</span>}
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        {errors.password && <span className="error">{errors.password}</span>}
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <button type="button" className="google-signup">
          <FcGoogle /> Sign Up with Google
        </button>
      </form>
    </div>
  );
};

export default SignupForm;

