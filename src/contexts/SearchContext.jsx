import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';

const SearchContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const SearchProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [formattedDate, setFormattedDate] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/place`);
        
        const dataArray = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.places)
          ? response.data.places
          : [];

        const formattedPlaces = dataArray.map((place) => ({
          value: place.place,
          label: place.place,
        }));

        setPlaces(formattedPlaces);
      } catch (error) {
        console.error("Error fetching places:", error);
        toast.error("Failed to load places");
      }
    };

    fetchPlaces();
  }, [API_URL]);

  const handleReverse = () => {
    setSource(destination);
    setDestination(source);
  };

  const handleSearch = () => {
    if (!source?.value || !destination?.value) {
      toast.warning("Please select source and destination");
      return;
    }
    if (source.value === destination.value) {
      toast.warning("Source and destination cannot be the same");
      return;
    }

    const departureDate = moment(formattedDate).format("DD-MM-YYYY");
    navigate(
      `/bus-list?source=${source.value}&destination=${destination.value}&departureDate=${departureDate}`
    );
  };

  const departureDate = moment(formattedDate).format("DD-MM-YYYY");

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
        departureDate,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
