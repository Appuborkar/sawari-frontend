import React from "react";
import { toast } from "react-toastify";
import { useBooking } from "../contexts/BookingContext";
import { GiSteeringWheel } from "react-icons/gi";

const MAX_SEATS = 5;

const SeatMapping = ({ seats, setSeats }) => {
  const { selectedSeats, setSelectedSeats } = useBooking();

  const handleSeatClick = (seat) => {
    if (!seat || seat.status === "booked") return;

    if (!selectedSeats.includes(seat.seatNumber) && selectedSeats.length >= MAX_SEATS) {
      toast.warning(`You can only select up to ${MAX_SEATS} seats.`);
      return;
    }

    const updatedSelection = selectedSeats.includes(seat.seatNumber)
      ? selectedSeats.filter((s) => s !== seat.seatNumber)
      : [...selectedSeats, seat.seatNumber];

    setSelectedSeats(updatedSelection);
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
      <div className="driver">
        <GiSteeringWheel />
      </div>
      <div className="bus-layout">{renderBusLayout()}</div>
    </div>
  );
};

export default SeatMapping;
