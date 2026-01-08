import React from "react";
import { useBooking } from "../contexts/BookingContext";

const BoardingDroppingPoints = ({ boardingPoints, droppingPoints }) => {

  const { bookingData, setBookingData } = useBooking();

  const { selectedBoarding, selectedDropping } = bookingData;

  const handleBoardingChange = (point) => {
    setBookingData(prev => ({
      ...prev,
      selectedBoarding: point.location,
      boardingTime: point.time
    }));
  };

  const handleDroppingChange = (point) => {
    setBookingData(prev => ({
      ...prev,
      selectedDropping: point.location,
      droppingTime: point.time
    }));
  };

  return (
    <div className="points-container">
      <div className="point-select">
        <h3 className="points-heading board">Boarding Points</h3>
        {boardingPoints?.length ? (
          boardingPoints.map((point, index) => (
            <label key={index} className='points boarding'>
              <input
                type="radio"
                name="boarding"
                value={point.location}
                checked={selectedBoarding === point.location}
                onChange={() => handleBoardingChange(point)}
              />
              <span className="point-location">
                {point.location}
              </span>
              <span>
                {point.time}
              </span>
            </label>
          ))
        ) : (
          <p>No boarding points available</p>
        )}
      </div>

      <div className="point-select">
        <h3 className="points-heading drop">Dropping Points</h3>
        {droppingPoints?.length ? (
          droppingPoints.map((point, index) => (
            <label key={index} className='points dropping'>
              <input
                type="radio"
                name="dropping"
                value={point.location}
                checked={selectedDropping === point.location}
                onChange={() => handleDroppingChange(point)}
              />
              <span className="point-location">
                {point.location}
              </span>
              <span>
                {point.time}
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