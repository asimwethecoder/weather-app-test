import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherData } from '../App';
import { fetchWeatherData } from '../utils/apiUtils';
import { Icon } from 'leaflet';

interface MapEventsProps {
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherData | null>>;
  setError: (message: string) => void;
  apiKeyValidated: boolean;
}

function MapEvents({ setWeatherData, setError, apiKeyValidated }: MapEventsProps) {
  useMapEvents({
    click: async (e) => {
      if (!apiKeyValidated) {
        setError("API key is not validated. Please check your OpenWeather API key");
        console.warn("Map click attempted before API key was validated");
        return;
      }
      
      const { lat, lng } = e.latlng;
      console.log(`Map clicked at coordinates: [${lat}, ${lng}]`);
      
      const result = await fetchWeatherData({ lat, lon: lng });
      console.log("Map click result:", result);
      
      if (result.success && result.data) {
        setWeatherData(result.data);
      } else {
        setError(result.error || "Failed to fetch weather data");
      }
    },
  });
  return null;
}

// This component will update the map center when weatherData changes
function MapCenterUpdater({ weatherData }: { weatherData: WeatherData | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (weatherData && weatherData.coord) {
      const { lat, lon } = weatherData.coord;
      console.log(`Updating map center to: [${lat}, ${lon}]`);
      map.setView([lat, lon], 10);
    }
  }, [weatherData, map]);
  
  return null;
}

interface MapProps {
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherData | null>>;
  setError: (message: string) => void;
  apiKeyValidated: boolean;
  weatherData: WeatherData | null;
}

// Define the location pin marker icon
const locationIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function Map({ setWeatherData, setError, apiKeyValidated, weatherData }: MapProps) {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents 
        setWeatherData={setWeatherData} 
        setError={setError}
        apiKeyValidated={apiKeyValidated} 
      />
      {weatherData && <MapCenterUpdater weatherData={weatherData} />}
      
      {/* Add the location pin marker when weather data is available */}
      {weatherData && weatherData.coord && (
        <Marker 
          position={[weatherData.coord.lat, weatherData.coord.lon]}
          icon={locationIcon}
        />
      )}
    </MapContainer>
  );
}

export default Map;