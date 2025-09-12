import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom';

function BoardingAlightingPoints() {
    const [boardingPoints,setboardingPoints] = useState([]);
    const [alightingPoints,setalightingPoints] = useState([]);
    const busId=useParams('busId');

    useEffect(() => {
        // Fetch boarding and alighting points from the server
        const fetchPoints = async () => {
            try {
                // Replace with your API endpoint
                const response = await fetch('http://localhost:5000/api/');
                const data = await response.json();
                setboardingPoints(data.boardingPoints);
                setalightingPoints(data.alightingPoints);
            } catch (error) {
                console.error('Error fetching points:', error);
            }
        };

        fetchPoints();
    }, []); 
  return (
    <div>BoardingAlightingPoints
        <h2>Boarding Points</h2>
        <ul>
            {boardingPoints.map((point, index) => (
                <li key={index}>{point}</li>
            ))}
        </ul>

        <h2>Alighting Points</h2>
        <ul>
            {alightingPoints.map((point, index) => (
                <li key={index}>{point}</li>
            ))}
        </ul>
    </div>
  )
}

export default BoardingAlightingPoints