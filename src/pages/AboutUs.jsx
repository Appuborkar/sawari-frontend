import React from "react";
import {Logo} from '../assets/image';

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">Sawari - Online Bus Booking Platform</h1>
      
      <div className="about-image">
        <img
          src={Logo}
          alt="Bus Travel"
          className="medium-image"
        />
      </div>

      <div className="about-content">
        <p className="about-text">
          Welcome to <strong>Sawari</strong>, your trusted companion for convenient and hassle-free online bus booking. Our platform ensures a seamless travel experience with real-time seat availability, secure bookings, and top-notch service.
        </p>
      </div>

      <div className="cards-container">
        <div className="card fade-in">
          <h3>Reliable Services</h3>
          <p>We partner with top bus operators to provide safe and timely travel.</p>
        </div>
        <div className="card fade-in">
          <h3>Affordable Prices</h3>
          <p>Enjoy the best deals on bus tickets with transparent pricing.</p>
        </div>
        <div className="card fade-in">
          <h3>24/7 Customer Support</h3>
          <p>Our dedicated support team is available round the clock for assistance.</p>
        </div>
      </div>

      <div className="mission-section">
        <div className="mission-card slide-in">
          <h2>Our Mission</h2>
          <p>
            At <strong>Sawari</strong>, we strive to redefine bus travel by ensuring comfort, affordability, and convenience for all our users. Our commitment to excellence keeps us moving forward.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

