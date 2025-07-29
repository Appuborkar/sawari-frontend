import React from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";
import { Pune, Amaravati, Sambhajinagar, Kolhapur } from '../assets/image.js';
import moment from 'moment';
import {FaRupeeSign} from  "react-icons/fa"

const popularRoutes = [
  { id: 1, source: "Mumbai", destination: "Pune", image: Pune,price:400},
  { id: 2, source: "Pune", destination: "Kolhapur", image: Kolhapur,price:500},
  { id: 3, source: "Akola", destination: "Amaravati", image: Amaravati,price:600 },
  { id: 4, source: "Mumbai", destination: "Sambhajinagar", image: Sambhajinagar,price:700 },
];

const PopularBusCard = () => {
  const { setSource, setDestination, setFormattedDate } = useSearch();
  const navigate = useNavigate();

  const handleBookNow = (route) => {
  const now=moment()
  const fourhourslater=moment().add(4,'hours')
  const defaultDate=fourhourslater.isSame(now,'day') ? now:now.add(1,'day')
  const departureDate = moment(defaultDate).format("DD-MM-YYYY");

    setFormattedDate(departureDate);
    setSource({ value: route.source, label: route.source });
    setDestination({ value: route.destination, label: route.destination });

    navigate(`/bus-list?source=${route.source}&destination=${route.destination}&departureDate=${departureDate}`);
  };

  return (
    <div className="popular-container">
      <h2 className="popular-heading">Popular Bus Routes</h2>
      <div className="popular-grid">
        {popularRoutes.map((route) => (
          <div key={route.id} className="popular-card">
            <img src={route.image} alt={`${route.source} to ${route.destination}`} className="popular-img" />
            <div className="popular-info">
              <h4>{route.source} → {route.destination}</h4>
              <div>From:<FaRupeeSign className="price-icon"/><span className="seat-price">{route.price}</span></div>
              <button className="popular-btn" onClick={() => handleBookNow(route)}>Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularBusCard;
