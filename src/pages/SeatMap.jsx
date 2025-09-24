import BoardingDroppingPoints from "../components/BoardingDroppingPoints";
import SeatMapping from "../components/SeatMapping";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import axios from "axios";
import { useBooking } from "../contexts/BookingContext";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SeatMap = () => {
  const { token } = useAuth();
  const { busId } = useParams();
  const navigate = useNavigate();
  const {bookingData,setBookingData}=useBooking()
  const { selectedSeats, selectedBoarding, selectedDropping } =bookingData;

  const [seats, setSeats] = useState([]);
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Initialize socket
  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    // Join bus-specific room for updates
    newSocket.emit("join-bus-room", busId);

    return () => {
      newSocket.emit("leave-bus-room", busId);
      newSocket.disconnect();
    };
  }, [busId]);


  // Fetch seats & set socket listeners
useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/api/bus/${busId}/busdetails`);
        setSeats(data.seat || []);
        setBoardingPoints(data.boardingPoints || []);
        setDroppingPoints(data.droppingPoints || []);
        setPrice(data.price);
      } catch (err) {
        console.error("Error fetching seats:", err);
        toast.error("Failed to load seat details.");
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();

    if (!socket) return;

    // Listen for seat updates
    socket.on("seat-updated", (updatedSeats) => {
      setSeats((prev) =>
        prev.map((s) => {
          const updated = updatedSeats.find((u) => u.seatNumber === s.seatNumber);
          return updated ? { ...s, ...updated } : s;
        })
      );
    });

    return () => {
      socket?.off("seat-updated");
    };
  }, [busId, socket]);

  useEffect(()=>{
    const totalFare = price * selectedSeats.length;
    setBookingData(prev=>({
      ...prev,
      totalFare:totalFare
    }));
  },[price,selectedSeats,setBookingData])

  const handleContinue = async () => {
    const bookingData = {
      busId,
      guestId: sessionStorage.getItem("guestId") || token,
      seats: selectedSeats,
      boardingPoint: selectedBoarding,
      droppingPoint: selectedDropping
    };

    try {
      await axios.post(`${API_URL}/api/booking/${busId}/hold`, bookingData);
      toast.success("Seats held successfully!");
      const isLoggedIn = localStorage.getItem("token");
      if (!isLoggedIn) {
        sessionStorage.setItem("redirectAfterLogin", "/passenger-form");
        navigate("/login");
      } else {
        navigate("/passenger-form");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error holding seats. Try again.");
    }
  };

  const isAllSelected = selectedSeats.length > 0 && selectedBoarding && selectedDropping;

  const totalFare = price * selectedSeats.length;

  if (loading) return <p>Loading seat map...</p>;

  return (
    <>
      <SeatMapping seats={seats} setSeats={setSeats} />
      <BoardingDroppingPoints boardingPoints={boardingPoints} droppingPoints={droppingPoints} />
      {isAllSelected && (
        <div>
          <div>
            <span>Selected Seats: {selectedSeats.join(", ")}</span>
            <span>Total Price: {totalFare}</span>
          </div>
          <button onClick={handleContinue}>
            Continue
          </button>
        </div>)}

    </>
  );
};

export default SeatMap;