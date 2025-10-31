import { FaBusAlt, FaRupeeSign } from "react-icons/fa";
import { useBooking } from "../contexts/BookingContext";
import { useNavigate } from "react-router-dom";
import Loader from './Loader';

const BusCard = ({
  buses,
  source,
  destination,
  departureDate
}) => {
  const navigate = useNavigate();
  const {setBookingData,clearBookingData } = useBooking();

  return (
    <>
      {buses.length > 0 ? (
        <div>
          <h2 className="info-text desktop">
            Available Buses from <span className="highlight">{source}</span> to{" "}
            <span className="highlight">{destination}</span> on <span className="highlight">{departureDate}
            </span>
          </h2>
          <h2 className="info-text mobile-only">
            <span className="highlight">{source}</span> →{" "}
            <span className="highlight">{destination}</span>{" on "}
            <span className="highlight-date">{departureDate}</span>
          </h2>
          <ul className="bus-list">
            {buses.map((bus) => (
              <li key={bus._id} className="bus-card">
                <div className="ticket">
                  <div className="route-info">
                    <p className="operator"><FaBusAlt /> {bus.operator}</p>
                    <div className="bus-route">
                      <span className="bus-source">{bus.source}</span>
                      <span className="bus-destination">{bus.destination}</span>
                    </div>
                    <div className="bus-time-block">
                      <span className="bus-time">{bus.boardingTime}</span>
                      <span className='bus-duration'>{bus.duration}</span>
                      <span className="bus-time">{bus.alightingTime}</span>
                    </div>
                    <div className="bus-meta">
                      <span>{bus.busType}</span>
                      <span>{bus.distance}</span>
                    </div>
                    <div className="bus-meta1">
                      <span style={{ color: '#333' }}>{bus.departureDate}</span>
                      <span className="ticket-price"><FaRupeeSign />{bus.price}</span>
                      <span>
                        <button
                          className="select-seat-btn"
                          onClick={() => {
                            clearBookingData();
                            navigate(`/select-seat/${bus._id}`);
                            setBookingData(prev=>({
                              ...prev,
                              busId:bus._id,
                              source:bus.source,
                              destination:bus.destination
                            }))
                          }}
                        >
                          Select Seat
                        </button>
                      </span>
                    </div>
                    <div className="bus-seat"><span>only {bus.availableSeatsCount} seats left</span></div>
                    <div>

                    </div>
                  </div>

                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="no-bus-message">No buses available for the selected route.</p>
      )}
    </>
  )
}

export default BusCard