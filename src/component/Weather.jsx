import React, { useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  // Icon mapping (basic demo – you can expand later)
  const getWeatherIcon = (code) => {
    if (code === 0) return clear_icon;        // Clear sky
    if ([1, 2].includes(code)) return cloud_icon; // Partly cloudy
    if (code === 3) return drizzle_icon;      // Overcast
    if ([45, 48].includes(code)) return drizzle_icon; // Fog
    if ([51, 53, 55].includes(code)) return drizzle_icon; // Drizzle
    if ([61, 63, 65].includes(code)) return rain_icon;    // Rain
    if ([71, 73, 75].includes(code)) return snow_icon;    // Snow
    return clear_icon; // fallback
  };

  const fetchWeather = async () => {
    if (!city) return;

    try {
      // 1. Get lat/lon for city
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        setWeather(null);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Fetch weather (with weathercode)
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weathercode`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: `${name}, ${country}`,
        temperature: weatherData.current.temperature_2m,
        wind: weatherData.current.wind_speed_10m,
        humidity: weatherData.current.relative_humidity_2m,
        icon: getWeatherIcon(weatherData.current.weathercode),
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather.");
      setWeather(null);
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
        <img
          src={search_icon}
          alt="search"
          onClick={fetchWeather}
          style={{ cursor: "pointer" }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <>
          <img src={weather.icon} alt="weather" className="weather_icon" />
          <p className="temperature">{weather.temperature}°C</p>
          <p className="location">{weather.city}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity" />
              <div>
                <p>{weather.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind" />
              <div>
                <p>{weather.wind} km/h</p>
                <span>Wind</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
