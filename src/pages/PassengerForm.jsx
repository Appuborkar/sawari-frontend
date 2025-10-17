import React, { useState } from "react";
import { useBooking } from "../contexts/BookingContext";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PassengerForm = () => {

  const { bookingData ,clearBookingData} = useBooking();
  const { user } = useAuth();
  const userId = user?._id;
  const navigate=useNavigate();
  
  const {
    selectedSeats,
    busId,
    source,
    destination,
    selectedDropping,
    selectedBoarding,
    boardingTime,
    droppingTime,
    totalFare,
  } = bookingData;

  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    passengers: selectedSeats.map((seat) => ({
      seatNumber: seat,
      name: "",
      age: "",
      gender: "",
    })),
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let tempErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Enter valid email format";
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      tempErrors.mobile = "Mobile number must be 10 digits";
    }

    formData.passengers.forEach((p, index) => {
      if (!/^[a-zA-Z\s]{3,}$/.test(p.name)) {
        tempErrors[`name${index}`] =
          "Name must be at least 3 characters (letters only)";
      }
      if (!/^\d+$/.test(p.age) || p.age < 12 || p.age > 100) {
        tempErrors[`age${index}`] = "Age must be between 12 and 100";
      }
      if (!p.gender) {
        tempErrors[`gender${index}`] = "Select your gender";
      }
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePassengerChange = (index, e) => {
    const updatedPassengers = [...formData.passengers];
    updatedPassengers[index][e.target.name] = e.target.value;
    setFormData({ ...formData, passengers: updatedPassengers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const payload = {
      userId,
      seats: selectedSeats,
      boardingPoint: selectedBoarding,
      droppingPoint: selectedDropping,
      totalFare,
        email: formData.email,
        mobile: Number(formData.mobile),
      passengers: formData.passengers.map((p) => ({
        name: p.name,
        age: Number(p.age),
        gender: p.gender,
      })),
    };

try {
  const result = await axios.post(`${API_URL}/api/booking/${busId}/confirm`, payload);

  if (result.data.ok) {
    toast.success("Booking Confirmed");
    navigate(`/ticket/${result.data.bookingId}`)
    clearBookingData();
  }
} catch (error) {
  const msg = error.response?.data?.message || "Failed to confirm booking";
  console.error("Error confirming booking:", msg);
  toast.error(msg);
  navigate(`/select-seat/${busId}`);
} finally {
  setLoading(false);
}
  };

 return (
  <div className="passenger-form-container">
    <div className="booking-summary">
      <h1>Booking Summary</h1>
      <span>{source} → {destination}</span>
      <span>Boarding: {selectedBoarding} ({boardingTime})</span>
      <span>Dropping: {selectedDropping} ({droppingTime})</span>
      <span>Seats: {selectedSeats.join(", ")}</span>
      <span>Total Fare: ₹{totalFare}</span>
    </div>

    <form onSubmit={handleSubmit} className="passenger-form">
      <h2>Contact Details</h2>

      <label>Email</label>
      <input
        type="email"
        name="email"
        placeholder="e.g. example@gmail.com"
        value={formData.email}
        onChange={handleChange}
        required
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <label>Mobile</label>
      <input
        type="tel"
        name="mobile"
        placeholder="e.g. 9988776655"
        value={formData.mobile}
        onChange={handleChange}
        required
      />
      {errors.mobile && <p className="error">{errors.mobile}</p>}

      <h2>Passenger Details</h2>
      {formData.passengers.map((passenger, index) => (
        <div key={passenger.seatNumber} className="passenger-block">
          <h3>Passenger for Seat {passenger.seatNumber}</h3>

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={passenger.name}
            onChange={(e) => handlePassengerChange(index, e)}
            placeholder="Passenger Name"
            required
          />
          {errors[`name${index}`] && (
            <p className="error">{errors[`name${index}`]}</p>
          )}

          <label>Age</label>
          <input
            type="number"
            name="age"
            value={passenger.age}
            onChange={(e) => handlePassengerChange(index, e)}
            placeholder="e.g. 18"
            required
          />
          {errors[`age${index}`] && (
            <p className="error">{errors[`age${index}`]}</p>
          )}

          <label>Gender</label>
          <select
            name="gender"
            value={passenger.gender}
            onChange={(e) => handlePassengerChange(index, e)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors[`gender${index}`] && (
            <p className="error">{errors[`gender${index}`]}</p>
          )}
        </div>
      ))}

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Confirm Booking"}
      </button>
    </form>
  </div>
);

};

export default PassengerForm;
