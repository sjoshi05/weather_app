function citySearch(event) {
  event.preventDefault();
  let cityInput = document.querySelector(".search-field").value;
  let apiKey = "2f930a1e3f970e4f60d0e8dcf2ba2ce1";
  let geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`;

  axios.get(geocodingApiUrl).then(displaySearchCity);

  axios.get(geocodingApiUrl).then(getMetricWeatherApiUrl);
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

  axios.get(weatherApiUrl).then(getCelsiusTemp);
  axios.get(weatherApiUrl).then(getCurrentWeatherDescription);
  axios.get(weatherApiUrl).then(displayCurrentCity);
}

function displaySearchCity(response) {
  let cityDisplayed = document.querySelector("h1");
  cityDisplayed.innerHTML = `${response.data[0].name}, ${response.data[0].country}`;
}

function displayCurrentCity(response) {
  let cityDisplayed = document.querySelector("h1");
  cityDisplayed.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
}

function currentDayAndTime() {
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[now.getDay()];
  let currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
  let currentDayTime = document.querySelector("#current-day-time");
  currentDayTime.innerHTML = `${currentDay} ${currentTime}`;
  return currentDayTime;
}

function getMetricWeatherApiUrl(response) {
  let lat = response.data[0].lat;
  let lon = response.data[0].lon;
  let units = "metric";
  let apiKey = "2f930a1e3f970e4f60d0e8dcf2ba2ce1";
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(weatherApiUrl).then(getCelsiusTemp);
  axios.get(weatherApiUrl).then(getCurrentWeatherDescription);
}

function getCelsiusTemp(response) {
  let celsiusTemp = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector(".current-temp-number");
  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  currentTemp.innerHTML = celsiusTemp;
  celsiusLink.style.color = "black";
  fahrenheitLink.style.color = "#0A79D8";
}

function getFahrenheitWeatherApiUrl(response) {
  let lat = response.data[0].lat;
  let lon = response.data[0].lon;
  let units = "imperial";
  let apiKey = "2f930a1e3f970e4f60d0e8dcf2ba2ce1";
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(weatherApiUrl).then(getFahrenheitTemp);
}

function getFahrenheitTemp() {
  let fahrenheitTemp = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector(".current-temp-number");
  let celsiusLink = document.querySelector("#celsius-link");
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  currentTemp.innerHTML = fahrenheitTemp;
  fahrenheitLink.style.color = "black";
  celsiusLink.style.color = "#0A79D8";
}

function getCurrentWeatherDescription(response) {
  let currentWeatherDescription = document.querySelector(
    "#current-weather-description"
  );
  currentWeatherDescription.innerHTML = response.data.weather[0].description;
}

let searchSubmit = document.querySelector("#search-form");
searchSubmit.addEventListener("submit", citySearch);

let currentLocation = document.querySelector(".current-location");
currentLocation.addEventListener("click", getCurrentLocation);

let celsiusSelected = document.querySelector("#celsius-link");
celsiusSelected.addEventListener("click", getCelsiusTemp);

let fahrenheitSelected = document.querySelector("#fahrenheit-link");
fahrenheitSelected.addEventListener("click", getFahrenheitTemp);

currentDayAndTime();
