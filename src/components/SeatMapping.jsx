import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import { getOrCreateGuestId } from "../utils/clientId";
import { removeFromStorage, getFromStorage } from "../utils/storage";

const socket = io("http://localhost:5000");

const SeatMapping = () => {
  const { busId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [clientId, setClientId] = useState(null); // manage dynamically
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/booking/${busId}/seats`)
      .then((res) => setSeats(res.data));

    socket.on("seat-updated", (updatedSeats) => {
      setSeats(updatedSeats);
    });

    return () => {
      socket.off("seat-updated");
    };
  }, [busId]);

  const handleSeatClick = async (seat) => {
    if (seat.status === "booked") return;

    let updatedSeats;

    if (selectedSeats.includes(seat.seatNumber)) {
      // Deselect seat
      updatedSeats = selectedSeats.filter((s) => s !== seat.seatNumber);
    } else {
      // Select seat
      updatedSeats = [...selectedSeats, seat.seatNumber];
    }

    setSelectedSeats(updatedSeats);

    // Logic for guest vs logged-in user
    if (user) {
      setClientId(user._id);
    } else {
      if (updatedSeats.length > 0) {
        // generate guestId only if none exists
        const guestId = getFromStorage("guestId") || getOrCreateGuestId();
        setClientId(guestId);
      } else {
        // no seats selected → remove guestId
        removeFromStorage("guestId");
        setClientId(null);
      }
    }

    try {
      if (updatedSeats.length > 0) {
        await axios.post(`http://localhost:5000/api/booking/${busId}/hold`, {
          seats: [seat.seatNumber],
          clientId: user ? user._id : getFromStorage("guestId"),
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to hold seat");
    }
    console.log(getFromStorage("guestId"));
  };

  return (
    <div className="seat-container">
      <div className="driver-seat">🚌 Driver</div>
      <div className="seat-grid">
        {seats.map((seat) => (
          <button
            key={seat.seatNumber}
            onClick={() => handleSeatClick(seat)}
            className={`seat ${seat.status} ${selectedSeats.includes(seat.seatNumber) ? "selected" : ""}`}
            disabled={seat.status === "booked"}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>

      <button disabled={selectedSeats.length === 0}>
        Confirm Booking
      </button>
    </div>
  );
};

export default SeatMapping;
