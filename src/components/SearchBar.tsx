import React, { useState } from 'react';
import { fetchWeatherData } from '../utils/apiUtils';

interface SearchBarProps {
  setWeatherData: React.Dispatch<React.SetStateAction<import('../App').WeatherData | null>>;
  setError: (message: string) => void;
  apiKeyValidated: boolean;
}

function SearchBar({ setWeatherData, setError, apiKeyValidated }: SearchBarProps) {
  const [search, setSearch] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) {
      setError("Please enter a city name");
      return;
    }
    
    if (!apiKeyValidated) {
      setError("API key is not validated. Please check your OpenWeather API key");
      console.warn("Search attempted before API key was validated");
      return;
    }
    
    const result = await fetchWeatherData({ city: search });
    console.log("Search result:", result);
    
    if (result.success && result.data) {
      setWeatherData(result.data);
      setError("");
    } else {
      setError(result.error || "Failed to fetch weather data");
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for a city..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;