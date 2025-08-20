import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/index'
import Signup from './pages/Signup'
import './App.css'
import Login from './pages/Login'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute'
import BusList from './pages/BusList'
import SeatMapping from './components/SeatMapping'

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
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/bus-list' element={<BusList />} />
        <Route path='/login' element={<Login />} />
        <Route path='/select-seat/:busId' element={<SeatMapping />} />
      </Routes>
    </>
  )
}

export default App
