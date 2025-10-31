import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TicketCard from "../components/TicketCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Ticket = () => {
  const { bookingId } = useParams();
  const { token } = useAuth();
  const [ticketDetails, setTicketDetails] = useState(null);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/booking/ticket/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTicketDetails(response.data);
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    if (bookingId && token) fetchTicketDetails();
  }, [bookingId, token]);

  return (
    <div className="ticket-container">
      {ticketDetails ? (
        <TicketCard ticketDetails={ticketDetails} showDownload />
      ) : (
        <p>Loading ticket...</p>
      )}
    </div>
  );
};

export default Ticket;
