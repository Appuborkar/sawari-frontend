import { useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useReleaseSeats = () => {
  useEffect(() => {
    const releaseExpiredSeats = async () => {
      try {
        await axios.post(`${API_URL}/api/booking/release-expired`);
      } catch (err) {
        console.error("Error releasing expired seats:", err);
      }
    };

    releaseExpiredSeats();
    const interval = setInterval(releaseExpiredSeats, 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};
