import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MyTickets = () => {
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
          (a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)
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

  const parseJourneyDateTime = (date, time) => {
    // If date is "24-10-2025", convert to "2025-10-24"
    const [day, month, year] = date.split("-");
    return new Date(`${year}-${month}-${day}T${time}`);
  };



  const canCancelTicket = (ticket) => {
  if (ticket.status === "cancelled") return false;

  const now = new Date();
  const journeyStart = parseJourneyDateTime(ticket.busId.departureDate, ticket.busId.boardingTime);
  const journeyEnd = parseJourneyDateTime(ticket.busId.departureDate, ticket.busId.alightingTime);

  if (now > journeyEnd) return false;

  const hoursLeft = (journeyStart - now) / (1000 * 60 * 60);
  if (hoursLeft < 4) return false; 

  return true;
};



  const handleCancel = async (ticketId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this ticket?");
    if (!confirmCancel) return;

    try {
      setCanceling(ticketId);
      const res = await axios.put(`${API_URL}/api/booking/cancel/${ticketId}`, {},
        { headers: { Authorization: `Bearer ${token}` } });

      toast.success(res.data.message || "Ticket cancelled successfully");

      setTickets((prev) =>
        prev.map((t) =>
          t._id === ticketId ? { ...t, status: "cancelled" } : t
        )
      );
    } catch (err) {
      console.error("Error cancelling ticket:", err);
      toast.error(err.response?.data?.message || "Failed to cancel ticket");
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
            <p>Ticket No: {ticket.ticketNumber} Status: {ticket.status}</p>
            <p>Journey Date:{ticket.busId.departureDate}</p>
            <p className="ticket-bus">Bus: {ticket.busId.operator}</p>
            <p>Seats: <span>{ticket.seats.join(", ")}</span></p>
            <p>Route: {ticket.busId.source} to {ticket.busId.destination}</p>
            <p>
              Booking At: {new Date(ticket.bookedAt).toLocaleString()}
            </p>
            {canCancelTicket(ticket) && (
              <button
                onClick={() => handleCancel(ticket._id)}
                disabled={canceling === ticket._id}
                className="ticket-cancel-btn"
              >
                {canceling === ticket._id ? "Canceling..." : "Cancel Ticket"}
              </button>
            )}


          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;