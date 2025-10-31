import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="spinner"></div>
        {message && <p className="loader-message">{message}</p>}
      </div>
    </div>
  );
};

export default Loader;
