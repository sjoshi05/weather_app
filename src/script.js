function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector(".search-field");

  citySearch(cityInput.value);
}

function citySearch(cityInput) {
  let apiKey = "2f930a1e3f970e4f60d0e8dcf2ba2ce1";
  let geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`;

  axios.get(geocodingApiUrl).then(displaySearchCity);
  axios.get(geocodingApiUrl).then(getMetricWeatherApiUrl);
  axios.get(geocodingApiUrl).then(getForecast);
}

function getCurrentLocation(event) {
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function searchCurrentLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiKey = "2f930a1e3f970e4f60d0e8dcf2ba2ce1";
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(weatherApiUrl).then(displayCurrentCity);
  axios.get(weatherApiUrl).then(currentDayAndTime);
  axios.get(weatherApiUrl).then(displayWeather);
}

function displaySearchCity(response) {
  let cityDisplayed = document.querySelector("h1");
  cityDisplayed.innerHTML = `${response.data[0].name}, ${response.data[0].country}`;
}

function displayCurrentCity(response) {
  let cityDisplayed = document.querySelector("h1");
  cityDisplayed.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
}

function currentDayAndTime(response) {
  let timezoneOffset = response.data.timezone;
  let timestampUnix = response.data.dt + timezoneOffset;

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

function getMetricWeatherApiUrl(response) {
  let lat = response.data[0].lat;
  let lon = response.data[0].lon;
  let units = "metric";
  let apiKey = "2f930a1e3f970e4f60d0e8dcf2ba2ce1";
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(weatherApiUrl).then(currentDayAndTime);
  axios.get(weatherApiUrl).then(displayWeather);
}

function displayWeather(response) {
  let currentTemp = document.querySelector("#current-temp-number");
  celsiusTemp = Math.round(response.data.main.temp);
  currentTemp.innerHTML = celsiusTemp;

  let currentWeatherDescription = document.querySelector(
    "#current-weather-description"
  );
  currentWeatherDescription.innerHTML = response.data.weather[0].description;

  let currentIcon = document.querySelector("#current-weather-icon");
  currentIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentIcon.setAttribute("alt", `${response.data.weather[0]}.description`);

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;

  let wind = document.querySelector("#wind");
  wind.innerHTML = `Wind: ${Math.round(response.data.wind.speed)} km/h`;

  let timezoneOffset = response.data.timezone;

  let sunriseUnix = response.data.sys.sunrise + timezoneOffset;
  let sunriseConverted = new Date(sunriseUnix * 1000).toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  let sunriseDisplayed = document.querySelector("#sunrise");
  sunriseDisplayed.innerHTML = `Sunrise: ${sunriseConverted}`;

  let sunsetUnix = response.data.sys.sunset + timezoneOffset;
  let sunsetConverted = new Date(sunsetUnix * 1000).toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  let sunsetDisplayed = document.querySelector("#sunset");
  sunsetDisplayed.innerHTML = `Sunset: ${sunsetConverted}`;
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

function getForecast(response) {
  let lat = response.data[0].lat;
  let lon = response.data[0].lon;
  let units = "metric";
  let apiKey = "e4f4205dbc58tb74afad5c9e48f3co33";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=${units}
`;

  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast-grid");

  let forecastHTML = `<div class="row">`;
  let days = ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col">
          <div class="forecast-day"> ${day} </div>
          <img src="http://openweathermap.org/img/wn/10d@2x.png" alt="" class="five-days-forecast-icons">
          <br />
          <span class="high-temp">18°</span> |
          <span class="low-temp">17°</span>`;

    forecastHTML = forecastHTML + `</div>`;

    forecastElement.innerHTML = forecastHTML;
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
