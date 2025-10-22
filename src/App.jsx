import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/index'
import Signup from './pages/Signup'
import './App.css'
import Login from './pages/Login'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import BusList from './pages/BusList'
import SeatMap from './pages/SeatMap';
import PassengerForm from './pages/PassengerForm'
import Ticket from './pages/Ticket';
import Footer from './pages/Footer';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import ViewTickets from './pages/ViewTickets'
import ScrollToTop from './components/ScrollToTop'

function App() {

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"

      />
      <Navbar />
      <ScrollToTop/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/bus-list' element={<BusList />} />
        <Route path='/login' element={<Login />} />
        <Route path='/select-seat/:busId' element={<SeatMap />} />
        <Route path='/passenger-form' element={<PassengerForm />} />
        <Route path='/ticket/:bookingId' element={ 
          <ProtectedRoute>
            <Ticket />
          </ProtectedRoute>} />
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>} />
           <Route path='/viewticket' element={
          <ProtectedRoute>
            <ViewTickets />
          </ProtectedRoute>} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
