import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

/**
 * Validates that the API key is properly set and working
 * @returns Promise with validation result
 */
export const validateApiKey = async (): Promise<{
  isValid: boolean;
  message: string;
}> => {
  // Check if API key exists
  if (!API_KEY) {
    return {
      isValid: false, 
      message: 'OpenWeather API key is not set. Please add VITE_OPENWEATHER_API_KEY to your environment variables.'
    };
  }

  // Validate API key by making a test request
  try {
    await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${API_KEY}`
    );
    return { isValid: true, message: 'API key is valid' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!navigator.onLine) {
        return { 
          isValid: false, 
          message: 'Network error: Please check your internet connection' 
        };
      } else if (error.response?.status === 401) {
        return { 
          isValid: false, 
          message: 'Invalid API key. Please check your OpenWeather API key' 
        };
      } else {
        return {
          isValid: false,
          message: `API validation failed (${error.response?.status || 'unknown'}): ${error.message}`
        };
      }
    }
    return { 
      isValid: false, 
      message: 'Unknown error occurred while validating API key' 
    };
  }
};

/**
 * Utility to safely make weather API calls with consistent error handling
 */
export const fetchWeatherData = async (params: {
  city?: string;
  lat?: number;
  lon?: number;
}) => {
  try {
    // Check if API key exists before making request
    if (!API_KEY) {
      console.error('API key is missing. Cannot fetch weather data.');
      return {
        success: false,
        data: null,
        error: 'API key is missing. Please set VITE_OPENWEATHER_API_KEY in your environment variables.'
      };
    }

    let url = 'https://api.openweathermap.org/data/2.5/weather?';
    
    if (params.city) {
      url += `q=${params.city}&`;
      console.log(`Fetching weather data for city: ${params.city}`);
    } else if (params.lat !== undefined && params.lon !== undefined) {
      url += `lat=${params.lat}&lon=${params.lon}&`;
      console.log(`Fetching weather data for coordinates: [${params.lat}, ${params.lon}]`);
    } else {
      throw new Error('Either city or coordinates must be provided');
    }
    
    url += `appid=${API_KEY}&units=metric`;
    
    console.log(`Making API request to: ${url.replace(API_KEY, 'API_KEY_HIDDEN')}`);
    const response = await axios.get(url);
    console.log('API response received:', response.status);
    return {
      success: true,
      data: response.data,
      error: null
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!navigator.onLine) {
        return {
          success: false,
          data: null,
          error: 'Network error: Please check your internet connection'
        };
      } else if (error.response?.status === 404) {
        return {
          success: false,
          data: null,
          error: 'Location not found. Please try again.'
        };
      } else {
        const statusCode = error.response?.status || 'unknown';
        return {
          success: false,
          data: null,
          error: `Error fetching weather data (${statusCode}): ${error.message}`
        };
      }
    }
    return {
      success: false,
      data: null,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};