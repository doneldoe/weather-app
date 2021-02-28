"use strict";

let weather = {
  apiKey: "0e7dbbd6f9527f099d5c8bafbfb94208",
  fetchWeather: function (city) {
    fetch(
      "http://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&lang=ru&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("Не найдено");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { country } = data.sys;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    console.log(name, country, icon, description, temp, humidity, speed);

    document.querySelector(".city").innerText = "Погода в " + name + ", " + country;
    document.querySelector(".icon").src =
      "http://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Влажность: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Скорость ветра: " + speed + " м/с";
    document.querySelector(".weather").classList.remove("hidden");
  },

  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

let geocode = {
  reverseGeocode: function (latitude, longitude) {
    var apikey = "14e025f04117451fb26f6865e8c0339f";
    var api_url = "https://api.opencagedata.com/geocode/v1/json";

    var request_url =
      api_url +
      "?" +
      "key=" +
      apikey +
      "&q=" +
      encodeURIComponent(latitude + "," + longitude) +
      "&pretty=1" +
      "&no_annotations=1";

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes

      if (request.status == 200) {
        // Success!
        var data = JSON.parse(request.responseText);
        weather.fetchWeather(data.results[0].components.city);
        console.log(data.results[0].components.city);
      } else if (request.status <= 500) {
        // We reached our target server, but it returned an error

        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };

    request.send(); // make the request
    findmeButton.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
  },

  getLocation: function () {
    if (navigator.geolocation) {
      console.log("Геолокация поддерживается");
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
      alert("Не удалось автоматически определить геолокацию");
      console.error("Не удалось автоматически определить геолокацию");
    }

    function geoSuccess(data) {
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }

    function geoError(data) {
      alert("Разрешите доступ к геоданным, чтобы определить вашу геолокацию");
      findmeButton.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
    }
  },
};

const search = document.querySelector(".search");
const searchBtn = document.querySelector(".search-btn");
const findmeButton = document.querySelector(".find-me-btn");

searchBtn.addEventListener("click", () => {
  weather.search();
});

search.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.keyCode === 13) {
    searchBtn.click();
  }
});

findmeButton.addEventListener("click", () => {
  findmeButton.innerHTML = '<i class="fas fa-spinner"></i>';
  geocode.getLocation();
});
