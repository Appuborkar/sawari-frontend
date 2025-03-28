import React from "react";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Section */}
        <div className="contact-section">
          <h3>Contact Us</h3>
          <p><MdEmail /> apurv@sawari.com</p>
          <p>Address:Sawari Bus Office, Street Name:Shubhash Nagar, City:Thane East-400603</p>
        </div>

        {/* Social Media Icons */}
        <div className="social-media">
          <h3>Follow Us</h3>
          <div className="icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook className="icon" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="icon" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin className="icon" /></a>
          </div>
        </div>

       

        {/* Copyright */}
        <div className="copyright">
          <p>&copy; 2025 Sawari Bus Booking Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
