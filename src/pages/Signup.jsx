import axios from "axios";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const validate = () => {
    const temp = {};
    if (!formData.name.trim()) temp.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) temp.email = "Invalid email";
    if (!/^\d{10}$/.test(formData.mobile)) temp.mobile = "10-digit number only";
    if (formData.password.length < 8) temp.password = "Min 8 characters";
    if (formData.password !== formData.confirmPassword)
      temp.confirmPassword = "Passwords do not match";
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, photo: file });
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      
      const res = await axios.post("http://localhost:5000/api/auth/signup", data);

      const result = res.data;

      if (result.authToken) {
        login(result.user, result.authToken);
        navigate("/");
      } else {
        setMessage(result.msg || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="signup-form">
      <h2 className='heading'>Sign Up</h2>
      {message && <p>{message}</p>}

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
      {errors.name && <p className="error">{errors.name}</p>}

      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      {errors.email && <p className="error">{errors.email}</p>}

      <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} />
      {errors.mobile && <p className="error">{errors.mobile}</p>}

      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      {errors.password && <p className="error">{errors.password}</p>}

      <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

      <button type="submit" disabled={loading} className='submitBtn'>
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
      <hr/>
      <div className="D-log">
        Already have an account <Link to='/login'>Click here</Link>
      </div>
    </form>
     
    </div>
  );
};

export default Signup;
