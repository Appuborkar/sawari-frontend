import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Ticket = () => {
  const ticketRef = useRef();
  const { bookingId } = useParams();
  const [ticketDetails, setTicketDetails] = useState(null);

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

  const {token} =useAuth();
  
  //  Fetch ticket details using bookingId
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
  }, [bookingId,token]);

  if (!ticketDetails) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading ticket...</p>;
  }

  const { busId,passengers, seats, boardingPoint, droppingPoint, totalFare, ticketNumber, status, contactInfo } =
    ticketDetails;

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      <div
        ref={ticketRef}
        style={{
          width: "400px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "12px",
          background: "#ffffff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>🎫 Bus Ticket</h2>
        <hr />

        <div style={{ lineHeight: "1.8" }}>
          <p><strong>Ticket No:</strong> {ticketNumber}</p>
          <p><strong>Status:</strong> {status}</p>

          {/* ✅ Bus Info */}
          <p><strong>Operator:</strong> {busId?.operator}</p>
          <p><strong>From:</strong> {busId?.source}</p>
          <p><strong>To:</strong> {busId?.destination}</p>

          {/*  Passenger Info */}
          <p><strong>Passenger:</strong> {passengers?.[0]?.name}</p>
          <p><strong>Age:</strong> {passengers?.[0]?.age}</p>
          <p><strong>Gender:</strong> {passengers?.[0]?.gender}</p>

          {/*  Route Info */}
          <p><strong>Seat(s):</strong> {seats?.join(", ")}</p>
          <p><strong>Boarding:</strong> {boardingPoint}</p>
          <p><strong>Dropping:</strong> {droppingPoint}</p>

          {/*  Fare Info */}
          <p><strong>Total Fare:</strong> ₹{totalFare}</p>

          {/*  Contact Info */}
          <p><strong>Contact:</strong> {contactInfo?.mobile}</p>
          <p><strong>Email:</strong> {contactInfo?.email}</p>
        </div>

        {/* ✅ QR Code */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <QRCode value={`Ticket:${ticketNumber}`} size={100} />
          <p style={{ fontSize: "12px", marginTop: "6px" }}>Scan to verify</p>
        </div>
      </div>

      {/* ✅ Download Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={downloadPDF}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Download Ticket PDF
        </button>
      </div>
    </div>
  );
};

export default Ticket;
