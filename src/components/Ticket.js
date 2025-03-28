import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBusAlt, FaClock, FaMapMarkerAlt, FaRupeeSign, FaTicketAlt, FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_URL; 
const Ticket = () => {
  const location = useLocation();
  const bookingId = new URLSearchParams(location.search).get("bookingId");
  const [ticket, setTicket] = useState(null);
  const [busDetails, setBusDetails] = useState(null);

  useEffect(() => {
    if (bookingId) {
      console.log("Request Body:", bookingId);
      
      // Fetch ticket details
      axios.get(`${API_BASE_URL}/api/booking/ticket/${bookingId}`)
        .then((res) => {
          setTicket(res.data);

          // Fetch bus details
          axios.get(`${API_BASE_URL}/api/bus/details/${res.data.busId}`)
            .then((response) => setBusDetails(response.data))
            .catch((error) => console.error("Error fetching bus details:", error));

          // // Store ticket if not already stored
          // axios.post("http://localhost:5000/api/ticket/create", {
          //   bookingId: bookingId,
          //   passengers: res.data.passengers,
          //   seats: res.data.seats,
          //   totalFare: res.data.totalFare,
          //   busId: res.data.busId,
          //   ticketNumber:res.data.ticketNumber
          // })
          // .then(() => console.log("Ticket stored successfully"))
          // .catch((error) => {
          //   if (error.response && error.response.status === 400) {
          //     console.log("Ticket already exists, skipping storage.");
          //   } else {
          //     console.error("Error storing ticket:", error);
          //   }
          // });
        })
        .catch((err) => console.error("Error fetching ticket details:", err));
    }
  }, [bookingId]);

  if (!ticket || !busDetails) return <p>Loading ticket details...</p>;

  return (
    <div className="ticket-container">
      <div className="ticket-card">
        <div className="ticket-header">
          <FaTicketAlt className="ticket-icon" />
          <h2>E-Ticket</h2>
        </div>
        <div className="ticket-details">
          <p><strong>Ticket No:</strong> {ticket.ticketNumber}</p>
          <p><FaMapMarkerAlt className="icon" /> <strong>From:</strong> {busDetails.source} → <strong>To:</strong> {busDetails.destination}</p>
          <p><FaClock className="icon" /> <strong>Departure:</strong> {busDetails.departureDate} | <strong>Time:</strong> {busDetails.boardingTime}</p>

          {/* 🔹 Loop through all passengers and display their details */}
          {ticket.passengers.map((passenger, index) => (
            <div key={index} className="passenger-card">
              <p><FaUser className="icon" /> <strong>Passenger {index + 1}:</strong> {passenger.name}</p>
              <p><strong>Age:</strong> {passenger.age} | <strong>Gender:</strong> {passenger.gender}</p>
              <p><strong>Mobile No:</strong> {passenger.mobile}</p>
              <p><FaBusAlt className="icon" /> <strong>Seat No:</strong> {ticket.seats[index]}</p>
            </div>
          ))}
          <p><FaRupeeSign className="icon" /> <strong>Total Fare:</strong> ₹{ticket.totalFare}</p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
