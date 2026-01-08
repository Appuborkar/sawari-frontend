import React, { useRef } from "react";
import QRCode from "react-qr-code";
import pdfGenerator from "../utils/pdfGenerator";
import Loader from '../components/Loader';

const TicketCard = ({
  ticketDetails,
  compact = false,
  onCancel,
  canceling,
  canCancel,
}) => {
  const qrRef = useRef();
  if (!ticketDetails) return <Loader>{message="Loading ticket..."}</Loader>;

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
    bookedAt,
  } = ticketDetails;

  const handleDownloadPDF = async () => {
    pdfGenerator(ticketDetails, qrRef);
  };

  return (
    <div className={`ticket-card ${compact ? "compact-card" : ""}`}>
      <div>
        <div className="ticket-header">
          <h2 className="ticket-title">SAWARI BUS E-TICKET</h2>
          <span className={`ticket-status ${status.toLowerCase()}`}>
            {status.toUpperCase()}
          </span>
        </div>

        <hr className="divider" />

        <div className="journey-section">
          {!compact && (<h3>Journey Details</h3>)}
          <div className="ticket-sub-header">
            <p><strong>Ticket No:</strong> {ticketNumber}</p>
            <p><strong>Date:</strong> {busId?.departureDate}</p>
          </div>
          <p><strong>Route:</strong> {busId?.source} – {busId?.destination}</p>
          <p><strong>Operator:</strong> {busId?.operator}</p>
          <p><strong>Seat(s):</strong> {seats?.join(", ")}</p>
          {!compact && (
            <>
              <p><strong>Bus Type:</strong> {busId?.busType}</p>
              <p><strong>Boarding:</strong> {boardingPoint} ({boardingTime})</p>
              <p><strong>Dropping:</strong> {droppingPoint} ({droppingTime})</p>

              <hr className="divider" />

              <div className="passenger-section">
                <h3>Passenger Details</h3>

                <div className="passenger-list">
                  {passengers?.map((p, index) => (
                    <div key={index} className="passenger-card">
                      <div className="passenger-header">
                        <strong>Passenger {index + 1}</strong>
                      </div>
                      <div className="passenger-info">
                        <p><strong>Name:</strong> {p.name}</p>
                        <p><strong>Age:</strong> {p.age}</p>
                        <p><strong>Gender:</strong> {p.gender}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="divider" />

              <div className="fare-section">
                <h3>Fare Summary</h3>
                <div className="fare-grid">
                  <p><strong>Base Fare: </strong> ₹{(totalFare * 0.9).toFixed(2)}</p>
                  <p><strong>GST (10%): </strong> ₹{(totalFare * 0.1).toFixed(2)}</p>
                  <p className="total-fare">
                    <strong>Total Fare: </strong> ₹{totalFare.toFixed(2)}
                  </p>
                </div>
              </div>

              <hr className="divider" />

              <div className="contact-info">
                <h3>Contact Info</h3>
                <p><strong>Mobile:</strong> {contactInfo?.mobile}</p>
                <p><strong>Email:</strong> {contactInfo?.email}</p>
              </div>
            </>)}
          <div className="contact-qr-section">
            <div className="qr-section" ref={qrRef}>
              <QRCode value={`Ticket:${ticketNumber}`} size={50} />
              <p>Scan to verify</p>
            </div>

          </div>
          <p><strong>Booking At: </strong>{new Date(bookedAt).toLocaleString()}</p>

          <div className={`buttons-section ${canCancel ? 'has-cancel' : 'no-cancel'}`}>
            <div className="download-btn-container">
              <button onClick={handleDownloadPDF} className="download-btn">
                Download Ticket
              </button>
            </div>

            {canCancel && (
              <div className="compact-btn-group">
                <button
                  onClick={onCancel}
                  disabled={canceling}
                  className="ticket-cancel-btn-small"
                >
                  {canceling ? "Canceling..." : "Cancel"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
