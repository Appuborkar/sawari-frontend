import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Profile = () => {
  const { user, setUser, token } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    photo: null,
  });
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        photo: user.photo || null,
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);
    if (formData.photo instanceof File) data.append("photo", formData.photo);

    try {
      const res = await axios.put(`${API_URL}/api/auth/update-profile`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);

      setPreviewPhoto(null);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => previewPhoto && URL.revokeObjectURL(previewPhoto);
  }, [previewPhoto]);

  if (!user) return <Loader message='Loading Profile...'/>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      <div className="profile-card">
        <img
          src={previewPhoto || user.photo || "/default-avatar.png"}
          alt="Profile"
          className="profile-image"
        />

        {editMode ? (
          <form onSubmit={handleUpdate} className="profile-form">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setPreviewPhoto(null);
              }}
            className="cancel-btn">
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile-info">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Mobile:</strong> {user.mobile}
            </p>
            <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
            <Link to="/viewticket" className="viewTicket-btn">View Tickets</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
