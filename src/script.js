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
  axios.get(weatherApiUrl).then(getCelsiusTemp);
  axios.get(weatherApiUrl).then(getCurrentWeatherDescription);
  axios.get(weatherApiUrl).then(getCurrentWeatherIcon);
  axios.get(weatherApiUrl).then(getCurrentWeatherDetails);
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

  axios.get(weatherApiUrl).then(getCelsiusTemp);
  axios.get(weatherApiUrl).then(getCurrentWeatherDescription);
  axios.get(weatherApiUrl).then(getCurrentWeatherIcon);
  axios.get(weatherApiUrl).then(getCurrentWeatherDetails);
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

function getCurrentWeatherIcon(response) {
  let currentIcon = document.querySelector("#current-weather-icon");
  currentIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  currentIcon.setAttribute("alt", `${response.data.weather[0]}.description`);
}

function getCurrentWeatherDetails(response) {
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

citySearch("Lisbon");

let searchSubmit = document.querySelector("#search-form");
searchSubmit.addEventListener("submit", handleSubmit);

let currentLocation = document.querySelector(".current-location");
currentLocation.addEventListener("click", getCurrentLocation);

let celsiusSelected = document.querySelector("#celsius-link");
celsiusSelected.addEventListener("click", getCelsiusTemp);

let fahrenheitSelected = document.querySelector("#fahrenheit-link");
fahrenheitSelected.addEventListener("click", getFahrenheitTemp);
