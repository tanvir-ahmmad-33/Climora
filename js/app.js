// ******************************************************************************
// ***** Navigate to mainpage.html when the "Get Started" button is clicked *****
// ******************************************************************************
$("#started-btn").on("click", function (e) {
  e.preventDefault();
  window.location.href = "homepage.html";
});

// ******************************************************************************
// ************ Navigate to index.html when the home icon is clicked ************
// ******************************************************************************
$(".home-icon").on("click", function () {
  window.location.href = "index.html";
});

// *******************************************************************************
// *************** Function to update the local time every second ****************
// *******************************************************************************

function updatetime() {
  const currentDate = new Date();
  let hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  const format = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  const timeString = `${hours}:${minutes}:${seconds} ${format}`;

  $("#location-time").text(timeString);
}

updatetime();
setInterval(updatetime, 1000);

// ******************************************************************************
// ******* Handle the form submission to get weather for the searched city ******
// ******************************************************************************
$("#weather-form").on("submit", function (e) {
  e.preventDefault(); // Prevent form submission

  const city = $("input[name='city']").val();
  const apiKey = "ba7455a48b9d0b5a432e6d0a752a56fc";

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  // Function to convert timezone (in seconds) to a human-readable format
  function getTimeInTimezone(timezoneInSeconds) {
    const now = new Date();
    // Convert current local time to UTC (in milliseconds)
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    // Apply the searched location's timezone offset
    const locationTime = new Date(utcTime + timezoneInSeconds * 1000);
    return formatTimeAMPM(locationTime);
  }

  // Helper function: Format time in AM/PM
  function formatTimeAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours %= 12;
    hours = hours || 12; // Convert 0 to 12
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
  }

  // ajax for today's weather
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    method: "GET",
    success: function (data) {
      console.log(data);

      // top section
      $("#city-name").text(data.name);
      $("#curent-temperature-amount").text(data.main.temp.toFixed(1));
      $("#weather-name").text(data.weather[0].description);

      // details weather section
      $("#humidity-data").text(data.main.humidity + "%");
      $("#wind-speed-data").text((data.wind.speed * 3.6).toFixed(2) + " km/hr");
      $("#wind-direction-data").text(data.wind.deg + "°");
      $("#visibility-data").text((data.visibility / 1000).toFixed(2) + " km");
      $("#pressure-data").text(data.main.pressure + " hPa");
      $("#cloud-coverage-data").text(data.clouds.all + "%");

      // more details weather section
      let sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
      let sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
      $("#feels-like-temperature").text(data.main.feels_like + "°C");
      $("#sunrise-time").text(sunriseTime);
      $("#sunset-time").text(sunsetTime);

      // timezone based on location
      const searchDate = new Date(data.dt * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      $("#search-location-time").text(searchDate);

      $("#curent-temperature-amount").addClass("celsius").removeClass("fahrenheit");
    },
    error: function () {
      alert("City not found or there was an error fetching the data.");
    },
  });

  // ajax for weather forecast
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`,
    method: "GET",
    success: function (data) {
      let i = 0;
      for (let idx = 0; idx < 40; idx++) {
        const forecast = data.list[idx];

        if (forecast.dt_txt.includes("12:00:00")) {
          const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const minTemperature = forecast.main.temp_min.toFixed(1) + " °C";
          const maxTemperature = forecast.main.temp_max.toFixed(1) + " °C";
          const feelsLike = forecast.main.feels_like.toFixed(1) + " °C";
          const humidity = forecast.main.humidity + "%";
          const wind = (forecast.wind.speed * 3.6).toFixed(2) + " km/h";
          const cloud = forecast.clouds.all + "%";
          const rain = forecast.rain ? forecast.rain["3h"] + " mm" : "0.00 mm";

          $(`#forecast-day-${i}`).find(`#forecast-weather-date-${i}`).text(forecastDate);
          $(`#forecast-day-${i}`)
            .find(`#forecast-temperature-${i}`)
            .text(minTemperature + " - " + maxTemperature);
          $(`#forecast-day-${i}`).find(`#forecast-weather-feels-like-${i}`).text(feelsLike);
          $(`#forecast-day-${i}`).find(`#forecast-humidity-${i}`).text(humidity);
          $(`#forecast-day-${i}`).find(`#forecast-wind-${i}`).text(wind);
          $(`#forecast-day-${i}`).find(`#forecast-cloud-${i}`).text(cloud);
          $(`#forecast-day-${i}`).find(`#forecast-rain-${i}`).text(rain);
          i++;
        }
      }
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        alert("City not found. Please try again.");
      } else if (xhr.status === 401) {
        alert("Invalid API key. Please check your API key.");
      } else {
        alert("There was an error fetching the data: " + error);
      }
    },
  });
});
// ******************************************************************************
// *************** Converts Fahrenheit to Celsius on button click ***************
// ******************************************************************************

$(".celsius-btn").on("click", function () {
  let fahrenheitTemperature = $("#curent-temperature-amount").text();
  let celsiusTemperature = (((fahrenheitTemperature - 32) / 9) * 5).toFixed(1);

  if ($("#curent-temperature-amount").hasClass("fahrenheit")) {
    $("#curent-temperature-amount").text(celsiusTemperature);
    $(".temperature-standart").text("°C");
    $("#curent-temperature-amount").addClass("celsius").removeClass("fahrenheit");
    $(".fahrenheit-btn").removeClass("btn-success").addClass("border border-1 border-success");
    $(".celsius-btn").addClass("btn-success").removeClass("border border-1 border-success");
  }
});
// ******************************************************************************
// *************** Converts Celsius to Fahrenheit on button click ***************
// ******************************************************************************
$(".fahrenheit-btn").on("click", function () {
  let celsiusTemperature = $("#curent-temperature-amount").text();
  let fahrenheitTemperature = ((celsiusTemperature * 9) / 5 + 32).toFixed(1);

  if ($("#curent-temperature-amount").hasClass("celsius")) {
    $("#curent-temperature-amount").text(fahrenheitTemperature);
    $(".temperature-standart").text("°F");
    $("#curent-temperature-amount").addClass("fahrenheit").removeClass("celsius");
    $(".fahrenheit-btn").addClass("btn-success").removeClass("border border-1 border-success");
    $(".celsius-btn").removeClass("btn-success").addClass("border border-1 border-success");
  }
});
