import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from '../components/Loader';
import BoardingDroppingPoints from "../components/BoardingDroppingPoints";
import SeatMapping from "../components/SeatMapping";
import { useBooking } from "../contexts/BookingContext";
import { useAuth } from "../contexts/AuthContext";
import { useReleaseSeats } from "../hooks/useReleaseSeats";
import BackButton from "../components/BackButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SeatMap = () => {

  const { token, user } = useAuth();
  const { busId } = useParams();
  const navigate = useNavigate();
  const { bookingData, setBookingData } = useBooking();
  const { selectedSeats, selectedBoarding, selectedDropping } = bookingData;

  const [seats, setSeats] = useState([]);
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useReleaseSeats();

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/api/bus/${busId}/busdetails`);
        setSeats(data.seat || []);
        setBoardingPoints(data.boardingPoints || []);
        setDroppingPoints(data.droppingPoints || []);
        setPrice(data.price || 0);
      } catch (err) {
        console.error("Error fetching seats:", err);
        toast.error("Failed to load seat details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [busId]);

  useEffect(() => {
    const totalFare = price * selectedSeats.length;
    setBookingData((prev) => ({ ...prev, totalFare }));
  }, [price, selectedSeats, setBookingData]);

 const userId = token ? user?._id : sessionStorage.getItem("guestId");
useEffect(()=>{
 const cancelHold = async () => {
    if (!busId || !userId) return;

    try {
      await axios.delete(`${API_URL}/api/booking/cancel-hold`, {
        params: { busId, userId },
      });
    } catch (err) {
      console.error("Failed to cancel hold:", err);
    }
  };
cancelHold()},
  [busId,userId])

  
  const bookingPayload = {
    userId,
    seats: selectedSeats,
    boardingPoint: selectedBoarding,
    droppingPoint: selectedDropping,
  };

  const handleContinue = async () => {
    try {
      await axios.post(`${API_URL}/api/booking/${busId}/hold`, bookingPayload);
      toast.success("Seats held successfully!");
      if (!token) {
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

  if (loading) return <Loader message='Loading seat map...'/>

  return (
    <div>
      <BackButton title={"back"}/>
    <div className="seatmap-page">
      
      <SeatMapping seats={seats} setSeats={setSeats} />
      <aside className="pointsAside">
      <BoardingDroppingPoints
        boardingPoints={boardingPoints}
        droppingPoints={droppingPoints}
      />
      
        <section className="seats-summary">
          <div >
          <p>Selected Seats: {selectedSeats.join(", ")}</p>
          <p>Total Price: ₹{totalFare}</p>
          </div>
          {isAllSelected && (<button onClick={handleContinue} className={`continueBtn`}>Continue</button>)}
        </section>
      
      </aside>
    </div>
    </div>
  );
};

export default SeatMap;
