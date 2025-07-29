import {useState,useEffect} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaExchangeAlt, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import Select from "react-select";
import { useSearch } from '../contexts/SearchContext';

const SearchBox=({variant="default"})=> {

const {places,source,destination,formattedDate,setSource,setDestination,setFormattedDate,handleReverse,handleSearch}=useSearch();

const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: isMobile && 'none',
      boxShadow: isMobile && 'none',
      backgroundColor: isMobile ? '#f9f9f9': 'white',
      padding: isMobile ? '6px 12px' : '4px 8px',
      borderRadius: '8px',
      minHeight: '40px',
    }),
    indicatorSeparator: () => ({
      display: isMobile && 'none',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: isMobile ? '#555' : '#888',
      '&:hover': {
        color: '#333',
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 5,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#eee' : '#fff',
      color: '#333',
      padding: isMobile ? '14px' : '10px',
      cursor: 'pointer',
    }),
  };
  
  return (
  <div className='search-container'>
      <div className='input-group'>
      <FaMapMarkerAlt className='icon'/>
        <Select
        className="search-input"
        styles={customStyles}
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
        styles={customStyles}
        options={places}
        onChange={setDestination}
        placeholder='Destination'
        value={destination}
        /></div>
        <div className="input-group input">
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