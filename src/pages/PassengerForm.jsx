import React from 'react';
import {useBooking} from '../contexts/BookingContext';

const PassengerForm = () => {

    const {bookingData}=useBooking();
    const {selectedSeats,source,destination,selectedDropping,selectedBoarding,boardingTime,droppingTime,totalFare}=bookingData;
    return (
        <div>
            <div>
                <h1>Booking Summary</h1>
                <div>
                    <span>{source}</span>
                    <span>{selectedBoarding}</span>
                    <span>{boardingTime}</span>
                </div>
                <div> 
                    <span>{destination}</span>
                     <span>{selectedDropping}</span>
                    <span>{droppingTime}</span>
                </div>
                <span>Seat No:{selectedSeats}</span>
                <span>Total Fare:{totalFare}</span>
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