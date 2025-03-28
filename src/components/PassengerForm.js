import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const API_BASE_URL = process.env.REACT_APP_URL; 
const PassengerForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const busId = new URLSearchParams(location.search).get("busId");

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [fareAmount, setFareAmount] = useState(0);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [errors, setErrors] = useState([]); // Track validation errors

  useEffect(() => {
    const storedSeats = JSON.parse(localStorage.getItem("tempSelectedSeats")) || [];
    setSelectedSeats(storedSeats);

    setPassengerDetails(
      storedSeats.map(() => ({ name: "", age: "", gender: "", mobile: "" }))
    );

    if (busId) {
      axios.get(`${API_BASE_URL}/api/bus/${busId}/price`)
        .then((res) => {
          console.log("Fare Response:", res.data);
          setFareAmount(res.data.price);
        })
        .catch((err) => console.error("Error fetching fare:", err));
    } else {
      console.error("busId is null or undefined");
    }
  }, [busId]);

  // Handle input changes with validation
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    setPassengerDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index] = { ...updatedDetails[index], [name]: value };
      return updatedDetails;
    });

    // Validate input field
    validateField(index, name, value);
  };

  // Validate individual fields
  const validateField = (index, field, value) => {
    let errorMsg = "";

    if (field === "name") {
      if (!/^[a-zA-Z\s]{3,}$/.test(value)) {
        errorMsg = "Name must be at least 3 characters and contain only letters.";
      }
    } else if (field === "age") {
      if (!/^\d+$/.test(value) || value < 1 || value > 100) {
        errorMsg = "Age must be between 1 and 100.";
      }
    } else if (field === "gender") {
      if (!value) {
        errorMsg = "Gender selection is required.";
      }
    } else if (field === "mobile") {
      if (!/^\d{10}$/.test(value)) {
        errorMsg = "Mobile number must be exactly 10 digits.";
      }
    }

    // Update errors state
    setErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = { ...updatedErrors[index], [field]: errorMsg };
      return updatedErrors;
    });
  };

  // Validate entire form before submission
  const validateForm = () => {
    let isValid = true;
    const newErrors = passengerDetails.map((passenger, index) => {
      let errorObj = {};

      if (!/^[a-zA-Z\s]{3,}$/.test(passenger.name)) {
        errorObj.name = "Name must be at least 3 characters and contain only letters.";
        isValid = false;
      }
      if (!/^\d+$/.test(passenger.age) || passenger.age < 1 || passenger.age > 100) {
        errorObj.age = "Age must be between 1 and 100.";
        isValid = false;
      }
      if (!passenger.gender) {
        errorObj.gender = "Gender selection is required.";
        isValid = false;
      }
      if (!/^\d{10}$/.test(passenger.mobile)) {
        errorObj.mobile = "Mobile number must be exactly 10 digits.";
        isValid = false;
      }

      return errorObj;
    });

    setErrors(newErrors);
    return isValid;
  };

  // Confirm booking function
  const confirmBooking = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/booking/${busId}/confirm`,
        { busId, seat: selectedSeats, passengers: passengerDetails },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );

      console.log("Booking Successful:", response.data);

      localStorage.removeItem("tempSelectedSeats");

      navigate(`/ticket?bookingId=${response.data.bookingId}`);
    } catch (err) {
      console.error("Error booking seats:", err);
      alert("Booking failed! Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      confirmBooking();
    } else {
      alert("Please correct the errors before submitting.");
    }
  };

  return (
    <div className="form-container">
      <h2>Passenger Details</h2>
      <p>Selected Seats: {selectedSeats.join(", ")}</p>
      <p>Total Fare: ₹{fareAmount * selectedSeats.length}</p>

      <form onSubmit={handleSubmit}>
        <div className="passenger-cards">
          {selectedSeats.map((seat, index) => (
            <div key={seat} className="passenger-card">
              <h3>Seat {seat}</h3>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={passengerDetails[index]?.name || ""}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
              {errors[index]?.name && <p className="error">{errors[index].name}</p>}

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={passengerDetails[index]?.age || ""}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
              {errors[index]?.age && <p className="error">{errors[index].age}</p>}

              <select
                name="gender"
                value={passengerDetails[index]?.gender || ""}
                onChange={(e) => handleInputChange(index, e)}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors[index]?.gender && <p className="error">{errors[index].gender}</p>}

              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={passengerDetails[index]?.mobile || ""}
                onChange={(e) => handleInputChange(index, e)}
                required
              />
              {errors[index]?.mobile && <p className="error">{errors[index].mobile}</p>}
            </div>
          ))}
        </div>

        <button type="submit" className="pay-btn">
          Confirm Booking & Generate Ticket
        </button>
      </form>
    </div>
  );
};

export default PassengerForm;
