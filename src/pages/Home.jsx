import React from 'react'
import Searchbox from '../components/SearchBox'
import PopularBusCard from '../components/PopularBusCard'

function Home() {
  return (
    <div className='home'>
      <h2 className='main-heading'>Sawari – Travel Smart, Travel Simple</h2>
        <Searchbox/>
        <PopularBusCard/>
        
    </div>
  )
}

export default Home