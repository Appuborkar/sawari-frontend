import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";
import { useAuth } from "../contexts/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaBusAlt, FaClock, FaMapMarkerAlt, FaRupeeSign, FaTicketAlt, FaUser } from "react-icons/fa";
import moment from "moment";

const BusList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get("source");
  const destination = queryParams.get("destination");
  const departureDate = queryParams.get("departureDate");
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [showAC, setShowAC] = useState(false);
  const [showNonAC, setShowNonAC] = useState(false);
  const [selectedOperators, setSelectedOperators] = useState([]);
  const { user, loading } = useAuth();
  const { formattedDate, setFormattedDate } = useSearch();
  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (date) => {
    setFormattedDate(date)
    const departureDate = moment(date).format("DD-MM-YYYY")

    const newParams = new URLSearchParams();
    newParams.set("source", source);
    newParams.set("destination", destination);
    newParams.set("departureDate", departureDate);

    navigate(`${location.pathname}?${newParams.toString()}`);
    setShowModal(false);
  };


  useEffect(() => {
    if (source && destination && departureDate) {
      axios
        .get(
          `http://localhost:5000/api/bus/search?source=${source}&destination=${destination}&departureDate=${departureDate}`
        )
        .then((response) => {
          setBuses(response.data);
          setFilteredBuses(response.data);
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


  if (loading) return <p>Loading...</p>;

  return (
    <div className="bus-page">
      <aside className="filter-section">
        <div>
          <h4>Price</h4>
          <label>
            <input
              type="radio"
              name="sort"
              value="lowToHigh"
              onChange={() => setSortBy("lowToHigh")}
            />
            Low to High
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="highToLow"
              onChange={() => setSortBy("highToLow")}
            />
            High to Low
          </label>
        </div>
        <div>
          <h4>Bus type</h4>
          <label>
            <input
              type="checkbox"
              checked={showAC}
              onChange={() => setShowAC(!showAC)}
            />
            AC
          </label>
          <label>
            <input
              type="checkbox"
              checked={showNonAC}
              onChange={() => setShowNonAC(!showNonAC)}
            />
            Non-AC
          </label>
        </div>
        <div>
          <h4>Bus Operator</h4>
          {["Neeta Travels", "MSRTC"].map(op => (
            <label key={op}>
              <input
                type="checkbox"
                checked={selectedOperators.includes(op)}
                onChange={() => handleOperatorChange(op)}
              />
              {op}
            </label>
          ))}
        </div>
      </aside>
      <main className="bus-list-container">
        {filteredBuses.length > 0 ? (
          <div>
            <h2 className="heading">
              Available Buses from <span className="highlight">{source}</span> to{" "}
              <span className="highlight">{destination}</span> on{" "}
              <button style={{ border: '1px solid gray', background: 'white', color: 'red', borderRadius: "0.5rem", padding: "0.5rem", position: "relative" }} onClick={() => setShowModal(true)}>
                {departureDate}</button>
              {showModal && (
                <div className="datepicker-container">
                  <DatePicker
                    selected={formattedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    inline

                  />
                  <button
                    onClick={() => setShowModal(false)}
                    className="cancel-btn">Cancel
                  </button>
                </div>
              )

              }
            </h2>
            <ul className="bus-list">
              {filteredBuses.map((bus) => (
                <li key={bus._id} className="bus-card-v">
                  <div className="ticket">
                    <div className="route-info">
                      <p><FaBusAlt />{bus.operator}</p>
                      <div>
                        <span>{bus.source}</span>
                        <span>{bus.destination}</span>
                      </div>
                      <div>
                        <span>{bus.boardingTime}</span>
                        <span>{bus.duration}</span>
                        <span>{bus.alightingTime}</span>
                      </div>
                      <div>
                        <span>{bus.busType}</span>
                        <span>{bus.distance}</span>
                      </div>
                      <div>
                        <span><FaRupeeSign />{bus.price}</span>
                        <span>{bus.departureDate}</span>
                        <button>Select Seat</button>
                      </div>
                      <div><span>only {bus.availableSeatsCount} seats left</span></div>
                      <div>

                      </div>
                    </div>
                    {user ? (
                      <Link
                        to={`/select-seat?busId=${bus._id}`}
                        className="select-seat-btn"
                      >
                        Select Seat
                      </Link>
                    ) : (
                      <p className="login-message">Please log in to book a seat.</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="no-bus-message">No buses available for the selected route.</p>
        )}
      </main>

    </div>

  );

};

export default BusList;
