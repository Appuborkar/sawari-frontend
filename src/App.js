import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import About from "./components/About";
import AdminDashboard from "./components/Admindashboard";
import AdminLogin from "./components/Adminlogin";
import Buslistview from "./components/Buslistview";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import PassengerForm from "./components/PassengerForm";
import Profile from "./components/Profile";
import Seatmapping from "./components/Seatmapping";
import SignInForm from "./components/Signin";
import SignupForm from "./components/Signup";
import Ticket from "./components/Ticket";
import Viewticket from "./components/Viewticket";
const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signin" element={<SignInForm/>} />
        <Route path="/Signup" element={<SignupForm/>} />
        <Route path="/bus-list" element={<Buslistview />} />
        <Route path="/select-seat" element={<Seatmapping/>} />
        <Route path="/pas-details" element={<PassengerForm/>}/>
        <Route path="/ticket" element={<Ticket/>}/>
        <Route path="/adminLogin" element={<AdminLogin/>}/>
        <Route path="/dashboard" element={<AdminDashboard/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/viewticket" element={<Viewticket/>}/>
      </Routes>
    </Router>
  );
};
export default App;
