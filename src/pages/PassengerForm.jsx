import React from 'react'
import {useSearch} from '../contexts/SearchContext'

const PassengerForm = () => {

    
    return (
        <div>
            <div>
                <h1>Booking Summary</h1>
                <div>
                    <span>{source}</span>
                    {/* <span>{boardingPoint.location}</span>
                    <span>{boardingPoint.time}</span> */}
                </div>
                {/* <div> */}
                    <span>{destination}</span>
                    {/* <span>{boardingPoint.location}</span>
                    <span>{boardingPoint.time}</span>
                </div>
                <span>Seat No:{seats}</span>
                <span>Total Fare:{fare}</span> */}
            </div>
            <div>

                <form action="">
                    <h1>Passenger Details</h1>
                    <label htmlFor="Name">Passenger Name</label>
                        <input type="text" name="name" id="name" placeholder='Passenger Name' required />
                     <label htmlFor="Email">Email</label>
                        <input type="email" name="email" id="email" placeholder='e.g. example@gmail.com' required />
                     <label htmlFor="Mobile No">Mobile </label>
                        <input type="text" name="name" id="name" placeholder='e.g. 9988776655' required />
                    <label htmlFor="Age">Age</label>
                        <input type="number" name="age" id="age" placeholder='e.g. 18' required />
                    <label htmlFor="Gender">Gender:</label>
                    <label htmlFor="Male">Male</label>
                    <input type="radio" name="gender" id="" value='1'/>
                    <label htmlFor="Female">Female</label>
                    <input type="radio" name="gender" id="" value='1'/>
                </form>
            </div>
        </div>
    )
}

export default PassengerForm
