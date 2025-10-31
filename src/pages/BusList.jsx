import axios from "axios";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FaFilter ,FaTimesCircle} from "react-icons/fa";
import Loader from "../components/Loader";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BusCard from "../components/BusCard";
import Filters from "../components/Filters";
import BackButton from "../components/BackButton";
import {useBooking} from '../contexts/BookingContext';

const BusList = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");
  const destination = queryParams.get("destination");
  const departureDate = queryParams.get("departureDate");
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [showAC, setShowAC] = useState(false);
  const [showNonAC, setShowNonAC] = useState(false);
  const [operators,setOperators]=useState([]);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { loading } = useAuth();
  const {clearBookingData}=useBooking();
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(()=>{
    if(location.state?.fromSeatMap){
      clearBookingData();
    }

  },[location,clearBookingData])

  useEffect(() => {
    if (source && destination && departureDate) {
      axios
        .get(
          `${API_URL}/api/bus/search?source=${source}&destination=${destination}&departureDate=${departureDate}`
        )
        .then((response) => {
          const data=response.data
          setBuses(data);
          setFilteredBuses(data);
          const uniqueOperators=[...new Set(data.map(bus=>bus.operator))];
          setOperators(uniqueOperators);
          
        })
        .catch((error) => console.error("Error fetching buses:", error));
    }
  }, [source, destination, departureDate]);

  const handleOperatorChange = (operatorName) => {
    if (selectedOperators.includes(operatorName)) {
      setSelectedOperators(prev => prev.filter(op => op !== operatorName));
    } else {
      setSelectedOperators(prev => [...prev, operatorName]);
    }
  };

  useEffect(() => {
    let result = [...buses];
    if (sortBy === "lowToHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highToLow") {
      result.sort((a, b) => b.price - a.price);
    }

    if (showAC && !showNonAC) {
      result = result.filter((bus) => bus.busType === "AC");
    } else if (!showAC && showNonAC) {
      result = result.filter((bus) => bus.busType === "NON-AC");
    } else if (showAC && showNonAC) {
      result = result.filter(
        (bus) => bus.busType === "AC" || bus.busType === "NON-AC"
      );
    }

    if (selectedOperators.length > 0) {
      result = result.filter((bus) => selectedOperators.includes(bus.operator));
    }
    setFilteredBuses(result);
  }, [sortBy, buses, showAC, showNonAC, selectedOperators]);

  const clearFilters = () => {
    setSortBy("");
    setShowAC(false);
    setShowNonAC(false);
    setSelectedOperators([]);
  };
  const isFilterActive = sortBy !== "" || showAC || showNonAC || selectedOperators.length > 0;

  if(loading) return <Loader message='loading buses...'/>

  return (
    <>
    <BackButton title={'Back'}/>
    <button className="filter-btn-mobile" onClick={()=>setIsFilterOpen(true)}>
        <FaFilter/>
      </button>
     {isFilterOpen ? (
    
      <div className={`mobile-filter-container ${isFilterOpen ? "show" : ""}`}>
        <div className="mobile">
          <button className="cancel-filter" onClick={()=>setIsFilterOpen(false)} ></button>
          <Filters
            sortBy={sortBy}
            setSortBy={setSortBy}
            showAC={showAC}
            setShowAC={setShowAC}
            showNonAC={showNonAC}
            setShowNonAC={setShowNonAC}
            selectedOperators={selectedOperators}
            handleOperatorChange={handleOperatorChange}
            clearFilters={clearFilters}
            isFilterActive={isFilterActive}
            operators={operators}
          />
          </div>
           <button
            className="apply-filters-btn"
            onClick={() => setIsFilterOpen(false)}
          >
            Apply Filters
          </button>
          </div>
      ):(
      <div className="bus-page">
        <aside className="filter-section">
          <Filters 
          sortBy={sortBy}
            setSortBy={setSortBy}
            showAC={showAC}
            setShowAC={setShowAC}
            showNonAC={showNonAC}
            setShowNonAC={setShowNonAC}
            selectedOperators={selectedOperators}
            handleOperatorChange={handleOperatorChange}
            clearFilters={clearFilters}
            isFilterActive={isFilterActive}
            operators={operators} />
        </aside>
        <main className="bus-list-container">
          <BusCard buses={filteredBuses}
            source={source}
            destination={destination}
            departureDate={departureDate} />
        </main>
      </div>)}

    </>

  );

};

export default BusList;