import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { GiSteeringWheel } from "react-icons/gi";

const socket = io("http://localhost:5000");

const MAX_SEATS = 5;

const SeatMapping = ({ onSeatsSelected }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [holder, setHolder] = useState(null);
  const { busId } = useParams();

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/booking/${busId}/seats`,
          // { withCredentials: true }
        );

        setSeats(res.data.seats);
        setHolder(res.data.holder); 

        
        const previouslySelected = res.data.seats
          .filter(
            (s) =>
              s.status === "temp" &&
              s.heldBy === res.data.holder
          )
          .map((s) => s.seatNumber);

        setSelectedSeats(previouslySelected);
      } catch (err) {
        console.error("Error fetching seats:", err);
      }
    };

    fetchSeats();

    socket.on("seat-updated", (updatedSeats) => {
      setSeats((prev) =>
        prev.map((s) => {
          const updated = updatedSeats.find((u) => u.seatNumber === s.seatNumber);
          return updated ? { ...s, ...updated } : s;
        })
      );
    });

    socket.on("seatReleased", ({ seatNumber, status }) => {
      setSeats((prev) =>
        prev.map((s) =>
          s.seatNumber === seatNumber ? { ...s, status } : s
        )
      );
    });

    return () => {
      socket.off("seat-updated");
      socket.off("seatReleased");
    };
  }, [busId]);

  const handleSeatClick = async (seat) => {
    if (seat.status === "booked") return;

    if (
      !selectedSeats.includes(seat.seatNumber) &&
      selectedSeats.length >= MAX_SEATS
    ) {
      toast.warning(`You can only book maximum ${MAX_SEATS} seats!`);
      return;
    }

    let updatedSelection;
    if (selectedSeats.includes(seat.seatNumber)) {
      // Deselect seat
      updatedSelection = selectedSeats.filter((s) => s !== seat.seatNumber);
    } else {
      // Select seat
      updatedSelection = [...selectedSeats, seat.seatNumber];
    }

    setSelectedSeats(updatedSelection);

    
    // try {
    //   if (selectedSeats.includes(seat.seatNumber)) {
    //     await axios.post(
    //       `http://localhost:5000/api/booking/${busId}/cancel-hold`,
    //       { seats: [seat.seatNumber] },
    //       { withCredentials: true }
    //     );
    //     setSelectedSeats((prev) =>
    //       prev.filter((s) => s !== seat.seatNumber)
    //     );
    //   } 
    //   else {
    //     const res = await axios.post(
    //       `http://localhost:5000/api/booking/${busId}/hold`,
    //       { seats: [seat.seatNumber] },
    //       { withCredentials: true }
    //     );
    //     setSelectedSeats((prev) => [...prev, seat.seatNumber]);
    //     setHolder(res.data.holder); 
    //   }
    // } catch (err) {
    //   toast.warning(err.response?.data?.message || "Error handling seat");
    // }
  };

  
const renderBusLayout = () => {
  const rows = [];

  for (let row = 0; row < 10; row++) {
    // If it's the last row → 5 seats
    const cols = row === 9 ? [0, 1, 2, 3, 4] : [0, 1, 2, 3];

    rows.push(
      <div key={row} className="seat-row">
        {cols.map((col) => {
          const seatIndex = row * 4 + col; // <-- base indexing (still works)
          const seat = seats[seatIndex];
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

      <div className="actions">
        <button
          disabled={selectedSeats.length === 0}
          onClick={() => onSeatsSelected?.(selectedSeats)}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SeatMapping;
