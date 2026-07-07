const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "partly cloudy",
  3: "overcast",
  45: "Fog",
  48: "depositing rime fog",
  51: "Drizzle",
  53: "Drizzle",
  55: "Drizzle",
  56: "Freezing Drizzle",
  57: "Freezing Drizzle",
  61: "Rain",
  63: "Rain",
  65: "Rain",
  66: "Freezing Rain",
  67: "Freezing Rain",
  71: "Snow fall",
  73: "Snow fall",
  75: "Snow fall",
  77: "Snow grains",
  80: "Rain showers",
  81: "Rain showers",
  82: "Rain showers",
  85: "Snow showers ",
  86: "Snow showers ",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const container = document.getElementById("weather-container");

searchBtn.addEventListener("click", getWeather);

function getCachedWeather(city) {
  const cachedData = sessionStorage.getItem(`weather_${city.toLowerCase()}`);
  if (!cachedData) return null;

  const parsed = JSON.parse(cachedData);
  if (Date.now() > parsed.expiry) {
    sessionStorage.removeItem(`weather_${city.toLowerCase()}`);
    return null; // Cache expired
  }
  return parsed.data;
}

function setCachedWeather(city, data) {
  const ttl = 10 * 60 * 1000;
  const cacheObject = {
    expiry: Date.now() + ttl,
    data: data,
  };
  sessionStorage.setItem(
    `weather_${city.toLowerCase()}`,
    JSON.stringify(cacheObject),
  );
}

async function getWeather(defaultCity = "") {
  let city = cityInput.value.trim();
  if (city === "") {
    city = defaultCity || "calicut";
  }

  const valueElements = document.querySelectorAll(".weather-value");
  valueElements.forEach((element) => {
    element.innerHTML = '<span class="skeleton"></span>';
  });
  const existingError = document.getElementById("error-message");
  if (existingError) existingError.style.display = "none";

  try {
    const cached = getCachedWeather(city);
    if (cached) {
      console.log(`Rendering ${city} from 10-minute cache.`);
      renderWeatherData(cached);
      return;
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${city}" not found.`);
    }

    const { name: cityName, latitude, longitude } = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const payload = {
      cityName: cityName,
      temperature: weatherData.current.temperature_2m,
      windSpeed: weatherData.current.wind_speed_10m,
      weatherCode: weatherData.current.weather_code,
      description:
        weatherDescriptions[weatherData.current.weather_code] ||
        "Unknown weather condition",
    };

    setCachedWeather(city, payload);
    renderWeatherData(payload);
  } catch (error) {
    console.error("Error occurred:", error);
    valueElements.forEach((element) => {
      element.textContent = "--";
    });
    showInlineError(error.message);
  }
}

function renderWeatherData(data) {
  document.getElementById("city-name").textContent = data.cityName;
  document.getElementById("temperature").textContent = data.temperature;
  document.getElementById("wind-speed").textContent = data.windSpeed;
  document.getElementById("weather-code").textContent = data.weatherCode;
  document.getElementById("weather-description").textContent = data.description;
}

function showInlineError(message) {
  let errorElement = document.getElementById("error-message");
  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.id = "error-message";
    errorElement.style.color = "red";
    errorElement.style.fontWeight = "bold";
    container.appendChild(errorElement);
  }
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

getWeather("calicut");
