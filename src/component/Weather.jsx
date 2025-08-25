import React, { useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;

    try {
      // 1. Get latitude/longitude for the city
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

      // 2. Get weather data for coords
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: `${name}, ${country}`,
        temperature: weatherData.current.temperature_2m,
        wind: weatherData.current.wind_speed_10m,
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
        />
        <img
          src={search_icon}
          alt="search icon"
          onClick={fetchWeather}
          style={{ cursor: "pointer" }}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div className="results">
          <h2>{weather.city}</h2>
          <p>🌡️ {weather.temperature} °C</p>
          <p>💨 {weather.wind} km/h</p>
        </div>
      )}
    </div>
  );
};

export default Weather;

