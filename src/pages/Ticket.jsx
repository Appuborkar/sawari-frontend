import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// import "../styles/Ticket.css"; // <-- Import custom CSS file

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Ticket = () => {
  const ticketRef = useRef();
  const { bookingId } = useParams();
  const [ticketDetails, setTicketDetails] = useState(null);
  const { token } = useAuth();

  // ✅ Download ticket as PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(ticketRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("bus-ticket.pdf");
  };

  // ✅ Fetch ticket details
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
  } = ticketDetails;

  return (
    <div className="ticket-container">
      <div className="ticket-card" ref={ticketRef}>
        <h2 className="ticket-title">🎫 Bus Ticket</h2>
        <hr className="divider" />

        <div className="ticket-info">
          <p><strong>Ticket No:</strong> {ticketNumber}</p>
          <p><strong>Status:</strong> {status}</p>

          <p><strong>Operator:</strong> {busId?.operator}</p>
          <p><strong>From:</strong> {busId?.source}</p>
          <p><strong>To:</strong> {busId?.destination}</p>

          <p><strong>Passenger:</strong> {passengers?.[0]?.name}</p>
          <p><strong>Age:</strong> {passengers?.[0]?.age}</p>
          <p><strong>Gender:</strong> {passengers?.[0]?.gender}</p>

          <p><strong>Seat(s):</strong> {seats?.join(", ")}</p>
          <p><strong>Boarding:</strong> {boardingPoint}</p>
          <p><strong>Dropping:</strong> {droppingPoint}</p>

          <p><strong>Total Fare:</strong> ₹{totalFare}</p>

          <p><strong>Contact:</strong> {contactInfo?.mobile}</p>
          <p><strong>Email:</strong> {contactInfo?.email}</p>
        </div>

        <div className="qr-section">
          <QRCode value={`Ticket:${ticketNumber}`} size={100} />
          <p className="qr-text">Scan to verify</p>
        </div>
      </div>

      <div className="download-btn-container">
        <button onClick={downloadPDF} className="download-btn">
          Download Ticket PDF
        </button>
      </div>
    </div>
  );
};

export default Ticket;
