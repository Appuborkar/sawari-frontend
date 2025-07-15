import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [formattedDate, setFormattedDate] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/place")
      .then(response => {
        const formattedPlaces = response.data.map(place => ({
          value: place.place,
          label: place.place,
        }));
        setPlaces(formattedPlaces);
      })
      .catch(error => console.error("Error fetching places", error));
  }, []);

  const handleReverse = () => {
    setSource(prev => destination);
    setDestination(prev => source);
  };

  const handleSearch = () => {
    if (!source || !destination) {
      toast.warning("Please select source and destination");
      return;
    }
    const departureDate = moment(formattedDate).format("YYYY-MM-DD");
    navigate(`/bus-list?source=${source}&destination=${destination}&departureDate=${departureDate}`);
  };

  const departureDate = moment(formattedDate).format("YYYY-MM-DD");

  return (
    <SearchContext.Provider
      value={{
        places,
        source,
        destination,
        formattedDate,
        setSource,
        setDestination,
        setFormattedDate,
        handleSearch,
        handleReverse,
        departureDate
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () =>useContext(SearchContext);