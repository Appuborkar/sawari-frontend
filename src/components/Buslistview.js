  import axios from "axios";
  import React, { useEffect, useState } from "react";
  import { Link, useLocation } from "react-router-dom";
  const BusListView = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get("source");
    const destination = queryParams.get("destination");
    const departureDate = queryParams.get("departureDate");
    const [buses, setBuses] = useState([]);
    const [user, setUser] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_URL; 
    useEffect(() => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        setUser(authToken);
      }
      if (source && destination && departureDate) {
        axios
          .get(`${API_BASE_URL}/api/bus/search?source=${source}&destination=${destination}&departureDate=${departureDate}`)
          .then(response => {
            setBuses(response.data);
          })
          .catch(error => console.error("Error fetching buses:", error));
      }
    }, [source, destination, departureDate]);

    return (
      <div className="bus-list-container">
        <h2 className="heading">
          Available Buses from {source} to {destination} on {departureDate}
        </h2>
        {buses.length > 0 ? (
          <ul className="bus-list">
            {buses.map((bus) => (
              <li key={bus.id} className="bus-card-v">
                <div className="ticket">
                  <div className="route-info">
                    <span className="source">{bus.source}</span>
                    <span className="arrow">→</span>
                    <span className="destination">{bus.destination}</span>
                  </div>
                  <div className="bus-details">
                    <h3 className="bus-name">{bus.name}</h3>
                    <div className="bus-meta">
                      <p>Boarding Time: {bus.boardingTime}</p>
                      <p>Alighting Time: {bus.alightingTime}</p>
                    </div>
                    <div className="bus-meta">
                      <p>Duration: {bus.duration} </p>
                      <p>Distance: {bus.distance}</p>
                    </div>
                    <p className="bus-price">₹{bus.price}</p>
                    <p>Date: {bus.departureDate}</p>
                  </div>
                  {user ? (
                    <Link to={`/select-seat?busId=${bus._id}`} className="select-seat-btn">
                      Select Seat
                    </Link>
                  ) : (
                    <p className="login-message">Please log in to book a seat.</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-bus-message">No buses available for the selected route.</p>
        )}
      </div>
    );
  };

  export default BusListView;
