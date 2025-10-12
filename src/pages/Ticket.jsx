import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Ticket = () => {

  const ticketRef = useRef();
  const { bookingId } = useParams();
  console.log("bookingID", bookingId)

  const [ticketDetails, setTicketDetails] = useState(null);

  const downloadPDF = async () => {
    const canvas = await html2canvas(ticketRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('sample-ticket.pdf');
  };

  useEffect(() => {

    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/booking/ticket/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
          })
        setTicketDetails(response.data)
        console.log("ticketdetails", ticketDetails)
        console.log("api res", response.data)
      } catch (error) {
        console.error("error fetching the ticket");
      }
    }

    if (bookingId) {
      fetchTicketDetails();
    }

  }, [bookingId])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>

      {ticketDetails &&
          <div
            ref={ticketRef}
            style={{
              width: '400px',
              margin: 'auto',
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '10px',
              background: '#f9f9f9',
            }}
          >
            <div>
              <h2 style={{ textAlign: 'center' }}>🎫 Bus Ticket</h2>
              <p></p>
              <p><strong>Passenger:</strong> {ticketDetails.passengers.name}</p>
              <p><strong>Bus:</strong> {ticketDetails.busId}</p>
              <p><strong>Seat:</strong> {ticketDetails.seats.seatNumber}</p>
              <p><strong>Route:</strong> {ticketDetails.boardingPoint} ➡ {ticketDetails.droppingPoint}</p>
              <p></p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <QRCode value={`Ticket:${ticketDetails.ticketNumber}`} size={100} />
              <p style={{ fontSize: '12px' }}>Scan to verify</p>
            </div>
          </div>}



      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={downloadPDF} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Ticket;
