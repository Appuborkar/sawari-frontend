import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import TicketCard from "../components/TicketCard";
import moment from "moment";
import Loader from "../components/Loader"

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
        setTickets(res.data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)));
      } catch (err) {
        console.error("Error fetching tickets:", err);
        toast.error("Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [token]);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this ticket?");
    if (!confirmCancel) return;

    try {
      setCanceling(bookingId);
      const res = await axios.put(`${API_URL}/api/booking/cancel/${bookingId}`, {},
        { headers: { Authorization: `Bearer ${token}` } });

      toast.success(res.data.message || "Ticket cancelled successfully");

      setTickets((prev) =>
        prev.map((t) =>
          t._id === bookingId ? { ...t, status: "cancelled" } : t
        )
      );
    } catch (err) {
      console.error("Error cancelling ticket:", err);
      toast.error(err.response?.data?.message || "Failed to cancel ticket");
    } finally {
      setCanceling(null);
    }
  };

  const canCancelTicket = (ticket) => {

    if (ticket.status === "cancelled") return false;

    const now = moment();
    const journeyStart = moment(`${ticket.busId.departureDate} ${ticket.busId.boardingTime}`, "DD-MM-YYYY HH:mm");
    
    const journeyEnd = moment(`${ticket.busId.departureDate} ${ticket.busId.alightingTime}`, "DD-MM-YYYY HH:mm");
    

    if (journeyEnd.isBefore(journeyStart)) {
      journeyEnd.add(1, "day");
    }

    if (journeyEnd.isValid() && now.isAfter(journeyEnd)) return false;

    const hoursLeft = journeyStart.diff(now, "hours", true);

    if (hoursLeft < 4) return false;

    return true;
  };


  if (loading) return <Loader message='loading ticket details...' />;
  if (!tickets.length) return <p>No tickets booked yet.</p>;

  return (
    <div className="tickets-container">
      <h2 className='heading'>My Tickets</h2>
      <div className="tickets-grid">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket._id}
            ticketDetails={ticket}
            compact                // 👈 compact view        // show download button
            canCancel={canCancelTicket(ticket)}   // enable cancel
            canceling={canceling === ticket._id}
            onCancel={() => handleCancel(ticket._id)}
          />
        ))}

      </div>
    </div>
  );
};

export default MyTickets;









