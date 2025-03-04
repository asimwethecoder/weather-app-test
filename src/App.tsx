import { useState, useEffect } from 'react';
import Map from './components/Map';
import WeatherInfo from './components/WeatherInfo';
import SearchBar from './components/SearchBar';
import { validateApiKey } from './utils/apiUtils';
import './App.scss';

export interface WeatherData {
  name: string;
  weather: { 
    icon: string; 
    description: string 
  }[];
  main: { 
    temp: number; 
    humidity: number 
  };
  wind: { 
    speed: number 
  };
  coord?: {
    lat: number;
    lon: number;
  };
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [apiKeyValidated, setApiKeyValidated] = useState(false);
  
  
  useEffect(() => {
    // Log API key status (not the actual key) for troubleshooting
    const apiKeyExists = !!import.meta.env.VITE_OPENWEATHER_API_KEY;
    console.log(
      `API Key ${apiKeyExists ? "is" : "is NOT"} configured. ` +
      `${apiKeyExists ? `Length: ${import.meta.env.VITE_OPENWEATHER_API_KEY.length} characters` : "Please add VITE_OPENWEATHER_API_KEY to your .env file"}`
    );
    
    const checkApiKey = async () => {
      const result = await validateApiKey();
      console.log("API key validation result:", result.isValid ? "Valid" : "Invalid", result.message);
      
      if (!result.isValid) {
        setError(result.message);
      } else {
        setApiKeyValidated(true);
      }
    };
    
    checkApiKey();
  }, []);

  const handleError = (message: string) => {
    setError(message);
    // Optional: Add a timeout to clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <div className="toggle-container">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      <div className="main-container">
        <SearchBar 
          setWeatherData={setWeatherData} 
          setError={handleError}
          apiKeyValidated={apiKeyValidated}
        />
        <div className="content-container">
          <div className="map-container">
            <Map 
              setWeatherData={setWeatherData} 
              setError={handleError}
              apiKeyValidated={apiKeyValidated}
              weatherData={weatherData}
            />
          </div>
          {weatherData && <WeatherInfo data={weatherData} />}
          {error && <div className="error-message" role="alert">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;