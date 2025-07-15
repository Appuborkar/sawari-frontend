import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaExchangeAlt, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import Select from "react-select";
import { useSearch } from '../contexts/SearchContext';

const SearchBox=()=> {
  
  const {places,source,destination,formattedDate,setSource,setDestination,setFormattedDate,handleReverse,handleSearch}=useSearch();

  
  return (
  <div className='search-container'>
      <div className='input-group'>
      <FaMapMarkerAlt className='icon'/>
        <Select
        className="search-input"
        classNamePrefix="react-select"
        options={places}
        placeholder="Source"
        value={source}
        onChange={setSource}
        /></div>
        <button 
        className='reverse-btn'
        onClick={handleReverse}
        ><FaExchangeAlt />
        </button>
        <div className='input-group'>
        <FaMapMarkerAlt className='icon'/>
        <Select
        className='search-input'
        classNamePrefix="react-select"
        options={places}
        onChange={setDestination}
        placeholder='Destination'
        value={destination}
        /></div>
        <div className="input-group">
        <FaCalendarAlt className="icon" />
        <DatePicker
            className="search-input"
            selected={formattedDate}
            onChange={setFormattedDate}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
          />
      </div>
      <button
        className="search-btn"
        onClick={handleSearch}>
        <FaSearch />
        <span>Search</span>
      </button>
    </div>
      
  )
}

export default SearchBox;