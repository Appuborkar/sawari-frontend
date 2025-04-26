import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FaBus, FaPlus, FaSignOutAlt, FaTicketAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [busDetails, setBusDetails] = useState({});
  const [view, setView] = useState("buses");
  const [form, setForm] = useState({
    source: "",
    destination: "",
    departureDate: "",
    price: "",
    boardingTime: "",
    alightingTime: "",
    duration: "",
    distance: "",
    seats: 40,
  });

  const navigate = useNavigate(); 

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bus/buses");
      setBuses(res.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/booking/bookings");
      setBookings(res.data);

      const uniqueBusIds = [...new Set(res.data.map((booking) => booking.busId?._id))];
      const busData = {};

      await Promise.all(
        uniqueBusIds.map(async (busId) => {
          if (busId) {
            try {
              const busRes = await axios.get(`http://localhost:5000/api/bus/details/${busId}`);
              busData[busId] = busRes.data;
            } catch (error) {
              console.error("Error fetching bus details:", error);
            }
          }
        })
      );
      setBusDetails(busData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bus/delete/${id}`);
        fetchBuses();
      } catch (error) {
        console.error("Error deleting bus:", error);
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/bus/newbus", form);
      fetchBuses();
      setForm({
        source: "",
        destination: "",
        departureDate: "",
        price: "",
        boardingTime: "",
        alightingTime: "",
        duration: "",
        distance: "",
        seats: 40,
      });
    } catch (error) {
      console.error("Error adding bus:", error);
    }
  };

  // Admin Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/adminLogin");
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <button onClick={() => setView("buses")}><FaBus /> Manage Buses</button>
        <button onClick={() => { setView("bookings"); fetchBookings(); }}><FaTicketAlt /> View Bookings</button>
        <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
      </aside>

      <main className="content">
        {view === "buses" && (
          <div className="bus-management">
            <h2 style={{ textAlign: "center" }}>Welcome to Admin Page</h2>
            <h2>All Buses</h2>
            <div className="bus-list">
              {buses.map((bus) => (
                <div key={bus._id} className="bus-card">
                  <FaTrash className="delete-icon" onClick={() => handleDelete(bus._id)} />
                  <h4>Source:{bus.source} → Destination:{bus.destination}</h4>
                  <p>Departure Date: {bus.departureDate}</p>
                  <p>Total Fare: ₹{bus.price}</p>
                  <p>Boarding Time: {bus.boardingTime}</p>
                  <p>Alighting Time: {bus.alightingTime}</p>
                  <p>Distance: {bus.distance}</p>
                  <p>Duration: {bus.duration}</p>
                  <p>Total Seats: {bus.totalSeats}</p>
                </div>
              ))}
            </div>

            <div className="add-bus">
              <h3>Add New Bus</h3>
              <form onSubmit={handleSubmit}>
                <input type="text" name="source" placeholder="Source" value={form.source} onChange={handleChange} required />
                <input type="text" name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} required />
                <input
                  type="date"
                  name="departureDate"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.departureDate}
                  onChange={handleChange}
                  required
                />
                <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
                <input type="time" name="boardingTime" value={form.boardingTime} onChange={handleChange} required />
                <input type="time" name="alightingTime" value={form.alightingTime} onChange={handleChange} required />
                <input type="text" name="duration" placeholder="Duration" value={form.duration} onChange={handleChange} required />
                <input type="text" name="distance" placeholder="Distance" value={form.distance} onChange={handleChange} required />
                <button type="submit"><FaPlus /> Add Bus</button>
              </form>
            </div>
          </div>
        )}

        {view === "bookings" && (
          <div className="view-bookings">
            <h2>All Bookings</h2>
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <h3>Ticket No: {booking.ticketNumber}</h3>
                {busDetails[booking.busId?._id] ? (
                  <p>Source: {busDetails[booking.busId._id].source} → Destination: {busDetails[booking.busId._id].destination}</p>
                ) : (
                  <p>Loading bus details...</p>
                )}
                <p><h4>Booked by: {booking.userId?.name || "Unknown"}</h4></p>
                <div>
                  <h4>Passengers Details:</h4>
                  {booking.passengers.map((passenger, index) => (
                    <p key={index}>Name: {passenger.name}, Age: {passenger.age} yrs, Gender: {passenger.gender}, Mobile No: {passenger.mobile}</p>
                  ))}
                </div>
                <p>Seat Number: {booking.seats.join(", ")}</p>
                <p>Total Fare: ₹{booking.totalFare}</p>
                <p className={`font-semibold ${booking.status === "confirmed" ? "text-green-500" : "text-red-500"}`}>
                  Status: {booking.status}
                </p>
                <p>Booking Time: {booking.bookedAt}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
