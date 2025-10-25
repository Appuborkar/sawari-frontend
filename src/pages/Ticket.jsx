import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import pdfGenerator from "../utils/pdfGenerator";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Ticket = () => {
  const ticketRef = useRef();
  const qrRef = useRef();
  const { bookingId } = useParams();
  const [ticketDetails, setTicketDetails] = useState(null);
  const { token } = useAuth();

  const handleDownloadPDF = () => {
    pdfGenerator(ticketDetails, qrRef);
  }
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/booking/ticket/${bookingId}?t=${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
          }
        );
        setTicketDetails(response.data);
      } catch (error) {
        console.error("Error fetching the ticket:", error);
      }
    };

    if (bookingId && token) fetchTicketDetails();
  }, [bookingId, token]);

  if (!ticketDetails) {
    return <p className="loading-text">Loading ticket...</p>;
  }

  const {
    busId,
    passengers,
    seats,
    boardingPoint,
    droppingPoint,
    totalFare,
    ticketNumber,
    status,
    contactInfo,
    boardingTime,
    droppingTime,
    bookedAt
  } = ticketDetails;

  return (
    <div className="ticket-container">
      <div className="ticket-card" ref={ticketRef}>

        <div className="ticket-header">
          <h2 className="ticket-title">SAWARI BUS E-TICKET</h2>
          <span className={`ticket-status ${status.toLowerCase()}`}>
            {status.toUpperCase()}
          </span>
        </div>

      <hr className="divider" />

        <div className="journey-section">
            <h3>Journey Details</h3>
            <div className="ticket-sub-header">
              <p><strong>Ticket No:</strong> {ticketNumber}</p>
              <p><strong>Date:</strong> {busId?.departureDate}</p>
            </div>

            <p><strong>Route:</strong> {busId?.source}-{busId?.destination}</p>
            <p><strong>Operator:</strong> {busId?.operator}</p>
            <p><strong>Bus Type:</strong> {busId?.busType}</p>
            <p><strong>Boarding:</strong> {boardingPoint} ({boardingTime})</p>
            <p><strong>Dropping:</strong> {droppingPoint} ({droppingTime})</p>
        </div>

        <hr className="divider" />

        {/* PASSENGER DETAILS */}
        <div className="passenger-section">
          <h3>Passenger Details</h3>
          <div className="passenger-grid">
            <p><strong>Name:</strong> {passengers?.[0]?.name}</p>
            <p><strong>Age:</strong> {passengers?.[0]?.age}</p>
            <p><strong>Gender:</strong> {passengers?.[0]?.gender}</p>
            <p><strong>Seat(s):</strong> {seats?.join(", ")}</p>
          </div>
        </div>

        <hr className="divider" />

        {/* FARE DETAILS */}
        <div className="fare-section">
          <h3>Fare Summary</h3>
          <div className="fare-grid">
            <p><strong>Base Fare:</strong> ₹{(totalFare * 0.9).toFixed(2)}</p>
            <p><strong>GST (10%):</strong> ₹{(totalFare * 0.1).toFixed(2)}</p>
            <p className="total-fare">
              <strong>Total Fare:</strong> ₹{totalFare.toFixed(2)}
            </p>
          </div>
        </div>

        <hr className="divider" />

        {/* CONTACT + QR SECTION */}
        <div className="contact-qr-section">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <p><strong>Mobile:</strong> {contactInfo?.mobile}</p>
            <p><strong>Email:</strong> {contactInfo?.email}</p>
          </div>
          <div className="qr-section" ref={qrRef}>
            <QRCode value={`Ticket:${ticketNumber}`} size={100} />
            <p className="qr-text">Scan to verify</p>
          </div>
        </div>
        <p className="booking-at"><strong>Booked At: </strong>
          {new Date(bookedAt).toLocaleString()}</p>
      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="download-btn-container">
        <button
          onClick={handleDownloadPDF}
          className="download-btn"
        >
          Download Ticket PDF
        </button>
      </div>
    </div>

  );
};

export default Ticket;
