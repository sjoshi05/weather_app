function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector(".search-field");

  citySearch(cityInput.value);
  getSearchForecast(cityInput.value);
}

function citySearch(cityInput) {
  let apiKey = "e4f4205dbc58tb74afad5c9e48f3co33";
  let units = "metric";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${cityInput}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displaySearchCity);
  axios.get(apiUrl).then(currentDayAndTime);
  axios.get(apiUrl).then(displayWeather);
}

function getCurrentLocation(position) {
  navigator.geolocation.getCurrentPosition(getCurrentLocationWeather);
  navigator.geolocation.getCurrentPosition(getCurrentLocationForecast);
}

function getCurrentLocationWeather(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiKey = "e4f4205dbc58tb74afad5c9e48f3co33";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayCurrentCity);
  axios.get(apiUrl).then(currentDayAndTime);
  axios.get(apiUrl).then(displayWeather);
}

function getCurrentLocationForecast(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiKey = "e4f4205dbc58tb74afad5c9e48f3co33";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayForecast);
}

function displaySearchCity(response) {
  let cityDisplayed = document.querySelector("h1");
  cityDisplayed.innerHTML = `${response.data.city}, ${response.data.country}`;
}

function displayCurrentCity(response) {
  let cityDisplayed = document.querySelector("h1");
  cityDisplayed.innerHTML = `${response.data.city}, ${response.data.country}`;
}

function currentDayAndTime(response) {
  let timestampUnix = response.data.time;

  let timeConverted = new Date(timestampUnix * 1000).toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  let dateConverted = new Date(timestampUnix * 1000);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[dateConverted.getDay()];
  let timestampDisplayed = document.querySelector("#last-update");
  timestampDisplayed.innerHTML = `${day} ${timeConverted}`;
}

function displayWeather(response) {
  let currentTemp = document.querySelector("#current-temp-number");
  celsiusTemp = Math.round(response.data.temperature.current);
  currentTemp.innerHTML = celsiusTemp;

  let currentWeatherDescription = document.querySelector(
    "#current-weather-description"
  );
  currentWeatherDescription.innerHTML = response.data.condition.description;

  let currentIcon = document.querySelector("#current-weather-icon");
  currentIcon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  currentIcon.setAttribute("alt", `${response.data.condition.description}`);

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.temperature.humidity}%`;

  let wind = document.querySelector("#wind");
  wind.innerHTML = `Wind: ${Math.round(response.data.wind.speed)} km/h`;
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temp-number");
  currentTemp.innerHTML = celsiusTemp;

  fahrenheitSelected.classList.remove("active");
  celsiusSelected.classList.add("active");
}

function getFahrenheitTemp(event) {
  event.preventDefault();
  let fahrenheitTemp = Math.round(celsiusTemp * (9 / 5) + 32);
  let currentTemp = document.querySelector("#current-temp-number");
  currentTemp.innerHTML = fahrenheitTemp;

  celsiusSelected.classList.remove("active");
  fahrenheitSelected.classList.add("active");
}

function getSearchForecast(cityInput) {
  let units = "metric";
  let apiKey = "e4f4205dbc58tb74afad5c9e48f3co33";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${cityInput}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayForecast);
}

function formatForecastDay(timestamp) {
  let dateConverted = new Date(timestamp * 1000);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[dateConverted.getDay()];

  return day;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(forecast);
  let forecastElement = document.querySelector("#forecast-grid");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="col">
            <div class="forecast-day"> ${formatForecastDay(
              forecastDay.time
            )} </div>
            <img src=""http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
              forecastDay.condition.icon
            }.png"," alt="${
          forecastDay.condition.description
        }" class="five-days-forecast-icons">
            <br />
            <span class="high-temp">${Math.round(
              forecastDay.temperature.maximum
            )}°</span> |
            <span class="low-temp">${Math.round(
              forecastDay.temperature.minimum
            )}°</span>`;

      forecastHTML = forecastHTML + `</div>`;

      forecastElement.innerHTML = forecastHTML;
    }
  });
}

let searchSubmit = document.querySelector("#search-form");
searchSubmit.addEventListener("submit", handleSubmit);

let currentLocation = document.querySelector(".current-location");
currentLocation.addEventListener("click", getCurrentLocation);

let celsiusTemp = null;

let celsiusSelected = document.querySelector("#celsius-link");
celsiusSelected.addEventListener("click", displayCelsiusTemp);

let fahrenheitSelected = document.querySelector("#fahrenheit-link");
fahrenheitSelected.addEventListener("click", getFahrenheitTemp);

displayForecast();

citySearch("Lisbon");
