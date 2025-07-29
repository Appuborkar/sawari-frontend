import React from 'react'
import Searchbox from '../components/SearchBox'
import Footer from './Footer'
import PopularBusCard from '../components/PopularBusCard'

function Home() {
  return (
    <div className='home'>
      <h2 className='main-heading'>Sawari – Travel Smart, Travel Simple</h2>
        <Searchbox/>
        <PopularBusCard/>
        <Footer/>
    </div>
  )
}

export default Home