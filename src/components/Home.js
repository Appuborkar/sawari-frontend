import React, { useState, useEffect } from "react";
import BusRouteGrid from "./Busroutegrid";
import Footer from "./Footer";
import Searchbox from "./Searchbox";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in using auth token
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token); // Converts token to boolean
  }, []);

  const routes = [
    {
      id: "67c672ac0fd4eb732e22a5c9",
      img: "./Assets/Pune.jpeg",
      source: "Mumbai",
      destination: "Pune",
      duration: "3 hrs 30 mins",
      price: "500",
    },
    {
      id: "67c672ac0fd4eb732e22a5cc",
      img: "./Assets/Sambhajinagar.jpg",
      source: "Mumbai",
      destination: "Sambhajinagar",
      duration: "2 hrs 15 mins",
      price: "400",
    },
    {
      id: "67c672ac0fd4eb732e22a5cd",
      img: "./Assets/Kolhapur.jpg",
      source: "Pune",
      destination: "Kolhapur",
      duration: "5 hrs 00 mins",
      price: "700",
    },
    {
      id: "67c672ac0fd4eb732e22a5d0",
      img: "./Assets/Amaravati.jpeg",
      source: "Akola",
      destination: "Amaravati",
      duration: "4 hrs 10 mins",
      price: "450",
    },
  ];

  return (
    <div>
      <Searchbox />
      <BusRouteGrid routes={routes} isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
}

export default Home;
