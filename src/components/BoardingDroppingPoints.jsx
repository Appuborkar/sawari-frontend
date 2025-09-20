import React from "react";
import { toast } from "react-toastify";
import { useBooking } from "../contexts/BookingContext";

const BoardingDroppingPoints = ({ boardingPoints, droppingPoints }) => {
  const {
    selectedSeats,
    selectedBoarding,
    setSelectedBoarding,
    selectedDropping,
    setSelectedDropping,
  } = useBooking();

  const handleBoardingChange = (point) => {

    setSelectedBoarding(point.location);
  };

  const handleDroppingChange = (point) => {
    
    setSelectedDropping(point.location);
  };

  return (
    <div className="points-container">
      <div className="point-select">
        <h3>Boarding Points</h3>
        {boardingPoints?.length ? (
          boardingPoints.map((point, index) => (
            <label key={index} style={{ display: "block", margin: "6px 0" }}>
              <input
                type="radio"
                name="boarding"
                value={point.location}
                checked={selectedBoarding === point.location}
                onChange={() => handleBoardingChange(point)}
              />
              <span style={{ marginLeft: "8px", fontWeight: "500" }}>
                {point.location} — <small>{point.time}</small>
              </span>
            </label>
          ))
        ) : (
          <p>No boarding points available</p>
        )}
      </div>

      <div className="point-select" style={{ marginTop: "20px" }}>
        <h3>Dropping Points</h3>
        {droppingPoints?.length ? (
          droppingPoints.map((point, index) => (
            <label key={index} style={{ display: "block", margin: "6px 0" }}>
              <input
                type="radio"
                name="dropping"
                value={point.location}
                checked={selectedDropping === point.location}
                onChange={() => handleDroppingChange(point)}
              />
              <span style={{ marginLeft: "8px", fontWeight: "500" }}>
                {point.location} — <small>{point.time}</small>
              </span>
            </label>
          ))
        ) : (
          <p>No dropping points available</p>
        )}
      </div>
    </div>
  );
};

export default BoardingDroppingPoints;
