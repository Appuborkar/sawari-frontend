import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; //css for calender
import { FaCalendarAlt, FaExchangeAlt, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import Select from "react-select";
const API_BASE_URL = process.env.REACT_APP_URL; 
const SearchBox = () => {
  const navigate = useNavigate(); // ✅ Hook for navigation

  // const { fetchBuses } = useContext(BusContext); // ✅ Use fetchBuses from context
  const [places, setPlaces] = useState([]);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [formattedDate, setDate] = useState(new Date());

 
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/place`)
      .then(response => {
        const formattedPlaces = response.data.map(place => ({
          value: place.name, label: place.name
        }));
        setPlaces(formattedPlaces);
      })
      .catch(error => console.error("Error fetching places:", error));
  }, []);

  const handleReverse = () => {
    setSource(destination);
    setDestination(source);
  };

  const handleSearch = () => {
    if (!source || !destination) {
      alert("Please select source and destination.");
      return;
    }
    const departureDate=moment(formattedDate).format("YYYY-MM-DD");
    // ✅ Navigate to the bus list page with search params
    navigate(`/bus-list?source=${source.value}&destination=${destination.value}&departureDate=${departureDate}`);
  
  };

  return (
    <div className="search-container">
      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <Select className="search-input" options={places} placeholder="Source" value={source} onChange={setSource} />
      </div>
      <button className="reverse-btn" onClick={handleReverse}><FaExchangeAlt /></button>
      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <Select className="search-input" options={places} placeholder="Destination" value={destination} onChange={setDestination} />
      </div>
      <div className="input-group">
        <FaCalendarAlt className="icon" />
        <DatePicker
          className="search-input"
          selected={formattedDate}
          onChange={setDate}
          minDate={new Date()} 
          dateFormat="yyyy/MM/dd"
        />

      </div>
      <button className="search-btn" onClick={handleSearch}><FaSearch /> Search</button>
    </div>
  );
};

export default SearchBox;
