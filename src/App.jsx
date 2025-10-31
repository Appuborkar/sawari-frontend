import React,{useState,useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import './App.css'
import Login from './pages/Login'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import BusList from './pages/BusList'
import SeatMap from './pages/SeatMap';
import PassengerForm from './pages/PassengerForm'
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop'
import Ticket from './pages/Ticket'
import MyTickets from './pages/MyTickets'
import Layout from './components/Layout'
import AboutUs from './pages/AboutUs'

function App() {

  const [loading,setLoading]=useState(true);
    useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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
      <ScrollToTop/>
      <Routes>
        <Route element={<Layout loading={loading} loaderMessage="Loading app..." />}>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/bus-list' element={<BusList />} />
        <Route path='/login' element={<Login />} />
        <Route path='/select-seat/:busId' element={<SeatMap />} />
        <Route path='/passenger-form' element={
          <ProtectedRoute>
          <PassengerForm />
          </ProtectedRoute>} />
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
            <MyTickets />
          </ProtectedRoute>} />
          </Route>
      </Routes>
    </>
  )
}

export default App;
