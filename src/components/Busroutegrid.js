import React from "react";
import BusRouteCard from "./Busroutecard";

const BusRouteGrid = ({ routes, isLoggedIn }) => {
  return (
    <div className="bus-grid">
      <h3 className="heading">Popular Bus Routes</h3>
      <div className="grid-container">
        {routes.map((route, index) => (
          <BusRouteCard key={index} route={route} isLoggedIn={isLoggedIn} />
        ))}
      </div>
    </div>
  );
};

export default BusRouteGrid;
