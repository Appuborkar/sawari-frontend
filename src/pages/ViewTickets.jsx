import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ViewTickets = () => {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/booking/all-tickets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sortedTickets = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setTickets(sortedTickets);
        
      } catch (err) {
        console.error("Error fetching tickets:", err);
        toast.error("Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [token]);

  console.log("Fetched tickets:", sortedTickets);
  console.log("Tickets set in state:", tickets);

  const handleCancel = async (ticketId, departureTime) => {
    const currentTime = new Date();
    const depTime = new Date(departureTime);
    const hoursLeft = (depTime - currentTime) / (1000 * 60 * 60);

    if (hoursLeft < 4) {
      toast.error("Cannot cancel ticket within 4 hours of departure");
      return;
    }

    try {
      setCanceling(ticketId);
      await axios.delete(`${API_URL}/api/tickets/cancel/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(tickets.filter((t) => t._id !== ticketId));
      toast.success("Ticket canceled successfully!");
    } catch (err) {
      console.error("Error canceling ticket:", err);
      toast.error("Failed to cancel ticket");
    } finally {
      setCanceling(null);
    }
  };

  if (loading) return <p className="tickets-loading">Loading tickets...</p>;
  if (!tickets.length) return <p className="tickets-empty">No tickets booked yet.</p>;

  return (
    <div className="tickets-container">
      <h2 className="tickets-title">My Tickets</h2>
      <div className="tickets-grid">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="ticket-card">
            <p className="ticket-bus">Bus: {ticket.busId.operator}</p>
            <p>Seats: <span>{ticket.seats.join(", ")}</span></p>
            <p>From: <span>{ticket.busId.source}</span> To: <span>{ticket.busId.destination}</span></p>
            <p>Boarding Time: <span>{ticket.busId.boardingTime}</span></p>
            <p>Departure: <span>{ticket.busId.droppingTime}</span></p>
            <p>Booking Date: <span>{new Date(ticket.createdAt).toLocaleString()}</span></p>
            <button
              onClick={() => handleCancel(ticket._id, ticket.departureTime)}
              disabled={canceling === ticket._id}
              className="ticket-cancel-btn"
            >
              {canceling === ticket._id ? "Canceling..." : "Cancel Ticket"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewTickets;
