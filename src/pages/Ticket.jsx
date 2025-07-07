import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const StaticTicket = () => {
  const ticketRef = useRef();

  const downloadPDF = async () => {
    const canvas = await html2canvas(ticketRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('sample-ticket.pdf');
  };

  const sampleTicket = {
    _id: '123ABC456',
    name: 'Apurv Borkar',
    busName: 'Sawari Travels',
    date: '2025-06-25',
    seat: 'A1, A2',
    source: 'Mumbai',
    destination: 'Pune',
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
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
        <h2 style={{ textAlign: 'center' }}>🎫 Bus Ticket</h2>
        <p><strong>Passenger:</strong> {sampleTicket.name}</p>
        <p><strong>Bus:</strong> {sampleTicket.busName}</p>
        <p><strong>Date:</strong> {sampleTicket.date}</p>
        <p><strong>Seat:</strong> {sampleTicket.seat}</p>
        <p><strong>Route:</strong> {sampleTicket.source} ➡ {sampleTicket.destination}</p>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <QRCode value={`Ticket:${sampleTicket._id}`} size={100} />
          <p style={{ fontSize: '12px' }}>Scan to verify</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={downloadPDF} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default StaticTicket;
