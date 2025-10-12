import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useBooking } from "../contexts/BookingContext";

const API_URL = import.meta.env.VITE_API_URL ||"http://localhost:5000";

 export const useBookingActions = () => {
  const { token} = useAuth();
  const {bookingData}=useBooking();
  const {busId}=bookingData;
  const guestId=sessionStorage.getItem("guestId");

  const transferHold = async (customToken) => {
    const authToken=customToken || token
    try {
      const response = await axios.post(
        `${API_URL}/api/booking/transfer-hold`,
        { busId, guestId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      console.error("Error transferring seat holds:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to transfer seat holds";
      toast.error(errorMsg);
      return null;
    }
  };

  return { transferHold };
};
