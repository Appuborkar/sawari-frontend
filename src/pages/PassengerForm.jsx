import React,{useState,useEffect} from 'react';
import {useBooking} from '../contexts/BookingContext';

const PassengerForm = () => {

    const {bookingData}=useBooking();
    const {selectedSeats,source,destination,selectedDropping,selectedBoarding,boardingTime,droppingTime,totalFare}=bookingData;
    const [formData,setFormData]=useState({
        name:'',
        age:'',
        gender:''})
    const [contactData,setContactData]=useState({
        email:'',
        mobile:''
    })



    const handleSubmit=(e)=>{
        e.preventDefault();
        //submit form data to backend
    }
        
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

                <form onSubmit={handleSubmit}>
                    <h1>Contact Details</h1>
                    <label htmlFor="Email">Email</label>
                        <input type="email" name="email" id="email" placeholder='e.g. example@gmail.com' required />
                     <label htmlFor="Mobile No">Mobile </label>
                        <input type="text" name="name" id="name" placeholder='e.g. 9988776655' required />
                    <h1>Passenger Details</h1>
                    {selectedSeats.map((index)=>(
                        <div key={index}>
                            <h2>Passenger {index+1}</h2>
                    <label htmlFor="Name">Passenger Name</label>
                        <input type="text" name="name" id="name" placeholder='Passenger Name' required />
                    <label htmlFor="Age">Age</label>
                        <input type="number" name="age" id="age" placeholder='e.g. 18' required />
                    <label htmlFor="Gender">Gender:</label>
                    <label htmlFor="Male">Male</label>
                    <input type="radio" name="gender" id="" value='1'/>
                    <label htmlFor="Female">Female</label>
                    <input type="radio" name="gender" id="" value='1'/>
                    </div>))}
                    <button type="submit">Confirm Booking</button>
                </form>
            </div>
        </div>
    )
}

export default PassengerForm