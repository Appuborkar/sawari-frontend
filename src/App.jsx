import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/index'
import Signup from './pages/Signup'
import Footer from './pages/Footer'
import './App.css' 
import Login from './pages/Login'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App
