import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBusAlt, FaClock, FaMapMarkerAlt, FaRupeeSign, FaTicketAlt, FaUser } from "react-icons/fa";
const ViewTickets = () => {
  const API_BASE_URL = process.env.REACT_APP_URL; 
  const [tickets, setTickets] = useState([]); // Store multiple tickets
  const [busDetails, setBusDetails] = useState({}); // Store bus details for each ticket

  useEffect(() => {

    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/booking/viewticket`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          withCredentials: true,
        });

        // Sort tickets by creation date in descending order
        const sortedTickets = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTickets(sortedTickets);

        // Fetch bus details for each unique busId
        const uniqueBusIds = [...new Set(sortedTickets.map(ticket => ticket.busId))];

        const busData = {};
        await Promise.all(
          uniqueBusIds.map(async (busId) => {
            try {
              const busRes = await axios.get(`${API_BASE_URL}/api/bus/details/${busId}`);
              busData[busId] = busRes.data;
            } catch (error) {
              console.error("Error fetching bus details:", error);
            }
          })
        );

        setBusDetails(busData);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTickets();
  }, []); // ✅ No unnecessary dependencies in the array

  if (tickets.length === 0) return <p>Loading ticket details...</p>;

  return (
    <div className="ticket-container">
      <h3 className="your-tickets-heading"> Your Tickets</h3> {/* Added heading here */}
      {tickets.map((ticket) => (
        <div key={ticket._id} className="ticket-card">
          <div className="ticket-header">
            <FaTicketAlt className="ticket-icon" />
            <h2>E-Ticket</h2>
          </div>
          <div className="ticket-details">
            <p>
              <strong>Ticket No:</strong> {ticket.ticketNumber}
            </p>

            {busDetails[ticket.busId] ? (
              <>
                <p>
                  <FaMapMarkerAlt className="icon" /> <strong>From:</strong>{" "}
                  {busDetails[ticket.busId].source} → <strong>To:</strong>{" "}
                  {busDetails[ticket.busId].destination}
                </p>
                <p>
                  <FaClock className="icon" /> <strong>Departure:</strong>{" "}
                  {busDetails[ticket.busId].departureDate} | <strong>Time:</strong>{" "}
                  {busDetails[ticket.busId].boardingTime}
                </p>
              </>
            ) : (
              <p>Loading bus details...</p>
            )}

            {/* Safe check before mapping passengers */}
            {Array.isArray(ticket.passengers) && ticket.passengers.length > 0 ? (
              ticket.passengers.map((passenger, index) => (
                <div key={passenger._id} className="passenger-card">
                  <p>
                    <FaUser className="icon" /> <strong>Passenger {index + 1}:</strong>{" "}
                    {passenger.name}
                  </p>
                  <p>
                    <strong>Age:</strong> {passenger.age} | <strong>Gender:</strong>{" "}
                    {passenger.gender}
                  </p>
                  <p>
                    <strong>Mobile No:</strong> {passenger.mobile}
                  </p>
                  <p>
                    <FaBusAlt className="icon" /> <strong>Seat No:</strong>{" "}
                    {ticket.seats[index] !== undefined ? ticket.seats[index] : "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p>No passenger details available.</p>
            )}

            <p>
              <FaRupeeSign className="icon" /> <strong>Total Fare:</strong> ₹{ticket.totalFare}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewTickets;
