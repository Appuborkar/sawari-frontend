import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", photo: null });
  const [previewPhoto, setPreviewPhoto] = useState(null); // New state for preview image

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/auth/profile`, { 
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      withCredentials: true 
    })
    .then(response => {
      setUser(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        mobile: response.data.mobile,
        photo: response.data.photo, 
      });
    })
    .catch(error => console.error("Error fetching profile", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      
      setFormData((prevFormData) => ({
        ...prevFormData,
        photo: file,  // Store the file for uploading
      }));

      setPreviewPhoto(previewUrl); // Store preview URL separately
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
  
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("mobile", formData.mobile);
    
    if (formData.photo instanceof File) {
      formDataToSend.append("photo", formData.photo);
    }
  
    try {
      const response = await axios.put(`${API_BASE_URL}/api/auth/update-profile`, formDataToSend, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        withCredentials: true,
      });

      setUser({
        ...response.data,
        photo: `${response.data.photo}?t=${new Date().getTime()}`, // Ensure updated image
      });

      setPreviewPhoto(null); // Reset preview after saving
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewPhoto) {
        URL.revokeObjectURL(previewPhoto);
      }
    };
  }, [previewPhoto]);

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      {user && (
        <div className="profile-card">
          <img 
            src={previewPhoto || (user.photo ? `${user.photo}?t=${new Date().getTime()}` : "/default-avatar.png")} 
            alt="Profile" 
            className="profile-image" 
          />

          {editMode ? (
            <form className="profile-form" onSubmit={handleUpdate}>
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="text" name="mobile" placeholder="Mobile No" value={formData.mobile} onChange={handleChange} required />
              <input type="file" name="photo" onChange={handleFileChange} accept="image/*" />
              <button type="submit" className="save-btn">Save</button>
              <button type="button" onClick={() => { setEditMode(false); setPreviewPhoto(null); }} className="cancel-btn">Cancel</button>
            </form>
          ) : (
            <div className="profile-info">  
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Mobile:</strong> {user.mobile}</p>
              <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
              <Link to="/viewticket" className="view-tickets-btn">View Tickets</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
