interface WeatherInfoProps {
  data: {
    name: string;
    weather: { icon: string; description: string }[];
    main: { temp: number; humidity: number };
    wind: { speed: number };
    coord?: {
      lat: number;
      lon: number;
    };
  };
}

function WeatherInfo({ data }: WeatherInfoProps) {
  return (
    <div className="weather-info">
      <h2>{data.name}</h2>
      <div className="weather-details">
        <img
          src={`https://openweathermap.org/img/w/${data.weather[0].icon}.png`}
          alt={data.weather[0].description}
        />
        <p className="temperature">{Math.round(data.main.temp)}°C</p>
        <p className="description">{data.weather[0].description}</p>
        <p>Humidity: {data.main.humidity}%</p>
        <p>Wind Speed: {data.wind.speed} m/s</p>
      </div>
    </div>
  );
}

export default WeatherInfo;