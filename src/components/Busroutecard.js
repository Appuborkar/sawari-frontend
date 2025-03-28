import React, { useState } from "react";
import { Link } from "react-router-dom";

const BusRouteCard = ({ route, isLoggedIn }) => {
  const [showWarning, setShowWarning] = useState(false);

  const handleBookNowClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Prevents navigation
      setShowWarning(true);
    }
  };

  return (
    <div className="bus-card">
      <img src={route.img} alt={`${route.source} to ${route.destination}`} className="card-img" />
      <div className="card-content">
        <h3>{route.source} to {route.destination}</h3>
        <p><strong>Duration:</strong> {route.duration}</p>
        <p><strong>Price:</strong> ₹{route.price}</p>

        <Link
          to={isLoggedIn ? `/select-seat?busId=${route.id}` : "#"}
          className="book-now-btn"
          onClick={handleBookNowClick}
        >
          Book Now
        </Link>

        {showWarning && <p className="login-warning">Please log in to book the seat.</p>}
      </div>
    </div>
  );
};

export default BusRouteCard;
