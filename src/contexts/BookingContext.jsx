import React, { createContext, useContext, useEffect, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedBoarding, setSelectedBoarding] = useState("");
    const [selectedDropping, setSelectedDropping] = useState("");

    useEffect(() => {
        const seats = JSON.parse(sessionStorage.getItem("selectedSeats")) || [];
        const boarding = sessionStorage.getItem("selectedBoarding") || "";
        const dropping = sessionStorage.getItem("selectedDropping") || "";

        setSelectedSeats(seats);
        setSelectedBoarding(boarding);
        setSelectedDropping(dropping);
    }, []);


    useEffect(() => {
        if(selectedSeats.length>0) {
            sessionStorage.setItem("selectedSeats", JSON.stringify(selectedSeats)) }
        else{
            sessionStorage.removeItem("selectedSeats");}

    }, [selectedSeats]);

  
   useEffect(() => {
  if (selectedSeats.length === 0) {
    setSelectedBoarding("");
    setSelectedDropping("");
    sessionStorage.removeItem("selectedBoarding");
    sessionStorage.removeItem("selectedDropping");
    return;
  }
  selectedBoarding
    ? sessionStorage.setItem("selectedBoarding", selectedBoarding)
    : sessionStorage.removeItem("selectedBoarding");
  selectedDropping
    ? sessionStorage.setItem("selectedDropping", selectedDropping)
    : sessionStorage.removeItem("selectedDropping");
}, [selectedSeats, selectedBoarding, selectedDropping]);


    const clearBookingData = () => {
        setSelectedSeats([]);
        setSelectedBoarding("");
        setSelectedDropping("");
        sessionStorage.removeItem("selectedSeats");
        sessionStorage.removeItem("selectedBoarding");
        sessionStorage.removeItem("selectedDropping");
    };

    
    return (
        <BookingContext.Provider
            value={{
                selectedSeats,
                selectedBoarding,
                selectedDropping,
                setSelectedSeats,
                setSelectedBoarding,
                setSelectedDropping,
                clearBookingData,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
