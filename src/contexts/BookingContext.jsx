import React, { createContext, useContext, useEffect, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
 
    const [bookingStep, setBookingStep] = useState("start");  
    const [bookingData, setBookingData] = useState(() => {
  
    const saved = sessionStorage.getItem("bookingData");
    return saved
      ? JSON.parse(saved)
      : {
          selectedSeats: [],
          selectedBoarding: "",
          selectedDropping: "",
          source: "",
          destination: "",
          boardingTime: "",
          droppingTime: "",
          totalPrice: 0,
        };
  });

  useEffect(() => {
  sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
}, [bookingData]);

 

  const clearBookingData = () => {
    setBookingData({
      selectedSeats: [],
      selectedBoarding: "",
      selectedDropping: "",
      source: "",
      destination: "",
      boardingTime: "",
      droppingTime: "",
      totalFare: 0,
    });
    sessionStorage.removeItem("bookingData");
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData,
        clearBookingData,
        bookingStep,
        setBookingStep,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);