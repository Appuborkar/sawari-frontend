import React from "react";
import { toast } from "react-toastify";
import { useBooking } from "../contexts/BookingContext";
import { GiSteeringWheel } from "react-icons/gi";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";

const MAX_SEATS = 5;

const SeatMapping = ({ seats, setSeats }) => {

  const { bookingData, setBookingData } = useBooking();
  const { selectedSeats } = bookingData;
  const { token } = useAuth();

  const handleSeatClick = (seat) => {
    if (!seat || seat.status === "booked" || seat.status==="temp") return;

    if (!selectedSeats.includes(seat.seatNumber) && selectedSeats.length >= MAX_SEATS) {
      toast.warning(`You can only select up to ${MAX_SEATS} seats.`);
      return;
    }

    const updatedSelection = selectedSeats.includes(seat.seatNumber)
      ? selectedSeats.filter((s) => s !== seat.seatNumber)
      : [...selectedSeats, seat.seatNumber];

    setBookingData((prev) => ({
      ...prev,
      selectedSeats: updatedSelection
    }));

    setSeats((prev) =>
      prev.map((s) =>
        s.seatNumber === seat.seatNumber
          ? { ...s, status: selectedSeats.includes(s.seatNumber) ? "available" : "selected" }
          : s
      )
    );

    if (!token) {
      if (!sessionStorage.getItem("guestId")) {
        const newGuestId = uuidv4();
        sessionStorage.setItem("guestId", newGuestId);
      }

      if (updatedSelection.length === 0) {
        sessionStorage.removeItem("guestId");
      }
    }

  };

  const renderBusLayout = () => {
    const rows = [];
    for (let row = 0; row < 10; row++) {
      const cols = row === 9 ? [0, 1, 2, 3, 4] : [0, 1, 2, 3];
      rows.push(
        <div key={row} className="seat-row">
          {cols.map((col) => {
            const seatIndex = row === 9 ? row * 4 + col : row * 4 + col;
            const seat = seats?.[seatIndex];
            if (!seat) return <div key={col} className="seat empty"></div>;

            return (
              <div
                key={seat.seatNumber}
                className={`seat ${seat.status} ${
                  selectedSeats.includes(seat.seatNumber) ? "selected" : ""
                }`}
                onClick={() => handleSeatClick(seat)}
              >
                {seat.seatNumber}
              </div>
            );
          })}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="seatmap-container">
      <div className="seat-status-map">
        <span className="status available">Available</span>
        <span className="status booked">Booked</span>
        <span className="status selected">Selected</span>
      </div>

      <div className="layout-page">
      <div className="driver">
        <GiSteeringWheel />
      </div>

  
      <div className="bus-layout">{renderBusLayout()}</div>
      </div>
    </div>
  );
};

export default SeatMapping;