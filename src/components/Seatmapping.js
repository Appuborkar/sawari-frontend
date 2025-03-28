import axios from "axios";
import { useEffect, useState } from "react";
import { FaChair } from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";
 
const Seatmapping = () => {
  const API_BASE_URL = process.env.REACT_APP_URL;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const busId = queryParams.get("busId");

  const totalSeats = 40;
  const maxBookingLimit = 5;

  const [seats, setSeats] = useState(Array(totalSeats).fill("available"));
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  // Fetch Seat Status from Backend
  useEffect(() => {
    if (!busId) return;

    axios
      .get(`${API_BASE_URL}/api/bus/${busId}/seats`)
      .then((res) => {
        console.log("Seats Response:", res.data);
        const updatedSeats = Array(totalSeats).fill("available");
        res.data.forEach((seat) => {
          updatedSeats[seat.seatNumber - 1] = seat.status;
        });
        setSeats(updatedSeats);
      })
      .catch((err) => console.error("Error fetching seat data:", err));
  }, [busId]);

  // Handle Seat Selection
  const handleSeatClick = async (row, col) => {
    const seatNumber = row * 4 + col;  
    console.log("Selected Seat Number:", seatNumber + 1); 

    if (seats[seatNumber] === "booked") return;

    let newSelectedSeats = [...selectedSeats];

    if (newSelectedSeats.includes(seatNumber + 1)) {
      newSelectedSeats = newSelectedSeats.filter((seat) => seat !== seatNumber + 1);
      setSeats((prevSeats) => {
        const updatedSeats = [...prevSeats];
        updatedSeats[seatNumber] = "available"; 
        return updatedSeats;
      });
    } else {
      if (newSelectedSeats.length < maxBookingLimit) {
        newSelectedSeats.push(seatNumber + 1);
        try {
          console.log("Sending Temp-Hold Request:", { seatNumber: seatNumber + 1 });
          await axios.post(`${API_BASE_URL}/api/bus/${busId}/temp-hold`, { seatNumber: seatNumber + 1 });

          setSeats((prevSeats) => {
            const updatedSeats = [...prevSeats];
            updatedSeats[seatNumber] = "temp"; 
            return updatedSeats;
          });

          // Save temporarily held seats in local storage
          localStorage.setItem("tempSelectedSeats", JSON.stringify(newSelectedSeats));
        } catch (err) {
          console.error("Error holding seat temporarily:", err);
        }
      }
    }
    setSelectedSeats(newSelectedSeats);
  };

  // Confirm Booking (Navigates to Passenger Form)
  const proceedToPassengerForm = async () => {
    try {
      localStorage.setItem("tempSelectedSeats", JSON.stringify(selectedSeats));
      navigate(`/pas-details?busId=${busId}`);
    } catch (err) {
      console.error("Error proceeding to passenger form:", err);
    }
  };
  

  // Release Unconfirmed Temporary Seats (if form is not filled within time)
  useEffect(() => {
    if (!busId) return;

    const timeout = setTimeout(() => {
      const tempSeats = JSON.parse(localStorage.getItem("tempSelectedSeats")) || [];
      if (tempSeats.length > 0) {
        console.log("Releasing Temporary Seats:", tempSeats);
        axios
          .post(`${API_BASE_URL}/api/booking/${busId}/release`, { seats: tempSeats })
          .then(() => {
            setSeats((prevSeats) => {
              const updatedSeats = [...prevSeats];
              tempSeats.forEach((seat) => (updatedSeats[seat - 1] = "available"));
              return updatedSeats;
            });

            localStorage.removeItem("tempSelectedSeats");
          })
          .catch((err) => console.error("Error releasing temporary seats:", err));
      }
    }, 5 * 60 * 1000); // Release seats if form isn't filled in 5 minutes

    return () => clearTimeout(timeout);
  }, [busId]);

  return (
    <div className="seat-selection">
      <div className="seat-indicator">
        <div className="indicator available">
          <FaChair /> Available
        </div>
        <div className="indicator selected">
          <FaChair /> Selected
        </div>
        <div className="indicator booked">
          <FaChair /> Booked
        </div>
      </div>

      <div className="bus-layout">
        <div className="driver-seat">
          <GiSteeringWheel size={40} />
        </div>

        <div className="seats">
          {[...Array(10)].map((_, row) => (
            <div className="seat-row" key={row}>
              {[...Array(4)].map((_, col) => {
                const seatNumber = row * 4 + col + 1; 
                return (
                  <div
                    key={seatNumber}
                    className={`seat ${seats[seatNumber - 1]} ${selectedSeats.includes(seatNumber) ? "selected" : ""}`}
                    onClick={() => handleSeatClick(row, col)}
                  >
                    <FaChair size={27} />
                    <span className="seat-number">{seatNumber}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <button className="next-btn" onClick={proceedToPassengerForm} disabled={selectedSeats.length === 0}>
        Next
      </button>
    </div>
  );
};

export default Seatmapping;
