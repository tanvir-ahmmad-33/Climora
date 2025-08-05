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
$("#home-icon").on("click", function () {
  window.location.href = "index.html";
});

// ******************************************************************************
// ********* Navigate to forecast.html when the forecast icon is clicked **********
// ******************************************************************************
$("#forecast-weather-icon").on("click", function () {
  window.location.href = "forecast.html";
});

// ******************************************************************************
// ************* Navigate to news.html when the news icon is clicked ************
// ******************************************************************************
$("#news-icon").on("click", function () {
  window.location.href = "news.html";
});

// ******************************************************************************
// ************* Navigate to news.html when the news icon is clicked ************
// ******************************************************************************
$("#weather-icon").on("click", function () {
  window.location.href = "homepage.html";
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
      // top section
      $("#city-name").text(data.name);
      $("#curent-temperature-amount").text(data.main.temp.toFixed(1));
      $("#weather-name").text(data.weather[0].description);

      // details weather section
      $("#humidity-data").text(data.main.humidity + "%");
      $("#wind-speed-data").text((data.wind.speed * 3.6).toFixed(2) + " km/hr");
      const degree = data.wind.deg;
      const windDegree = (degree) => {
        if (degree >= 0 && degree <= 22.5) return "North";
        else if (degree > 22.5 && degree <= 67.5) return "North-East";
        else if (degree > 67.5 && degree <= 112.5) return "East";
        else if (degree > 112.5 && degree <= 157.5) return "South-East";
        else if (degree > 157.5 && degree <= 202.5) return "South";
        else if (degree > 202.5 && degree <= 247.5) return "South-West";
        else if (degree > 247.5 && degree <= 292.5) return "West";
        else if (degree > 292.5 && degree <= 337.5) return "North-West";
        return "North";
      };
      $("#wind-direction-data").text(windDegree);
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

// ******************************************************************************
// *************** Function to generate dates for the next 4 days ***************
// ******************************************************************************

function generateForecastDays() {
  const today = new Date();

  for (let i = 1; i <= 4; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i);

    const optionText = forecastDate.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const optionValue = i;

    $("#forecast-day").append(`<option value="${optionValue}" class="option-size">${optionText}</option>`);
  }
}

generateForecastDays();

// ******************************************************************************
// ************ Gnerating per day forecast after search button click ************
// ******************************************************************************

$("#forecast-form").on("submit", function (e) {
  e.preventDefault();

  const city = $("#search-city-box").val();
  let forecastDayIdx = $("#forecast-day").val();

  if (city == "" || forecastDayIdx == "") {
    let errorText = "";

    if (city == "" && forecastDayIdx == "") {
      errorText = "City name and forecast day are required!";
    } else if (city == "") {
      errorText = "City name is required!";
    } else if (forecastDayIdx == "") {
      errorText = "Forecast day is required!";
    }

    Swal.fire({
      title: errorText,
      toast: true,
      position: "top-right",
      showConfirmButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
      customClass: {
        confirmButton: "swal2-confirm",
      },
    });

    return;
  }

  $("#forecat-search-box").addClass("d-none");
  $("#forecast-boxes").css({
    "background-image": "none",
    "padding-top": "0",
  });
  $("#forecat-search-result-box").removeClass("d-none");

  forecastDayIdx = Number(forecastDayIdx);

  const today = new Date();
  const forecast = new Date(today);
  forecast.setDate(today.getDate() + forecastDayIdx);
  const forecastCheck = forecast.toISOString().split("T")[0];
  const forecastDate =
    forecast.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    }) +
    ", " +
    forecast.toLocaleDateString("en-GB", {
      weekday: "long",
    });
  $("#forecast-date").text(forecastDate);

  const apiKey = "ba7455a48b9d0b5a432e6d0a752a56fc";

  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`,
    method: "GET",
    success: function (data) {
      let idx = 0;

      for (let i = 0; i < 40; i++) {
        let forecast = data.list[i];

        const forecastDateFromAPI = forecast.dt_txt.split(" ")[0];
        if (forecastCheck === forecastDateFromAPI) {
          const time = new Date(forecast.dt_txt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
          const feelsLike = forecast.main.feels_like.toFixed(1) + " °C";
          const condition = forecast.weather[0].description;
          const minTemperature = forecast.main.temp_min.toFixed(1) + " °C";
          const maxTemperature = forecast.main.temp_max.toFixed(1) + " °C";
          const humidity = forecast.main.humidity + "%";
          const cloudCoverage = forecast.clouds.all + "%";
          const airPressure = forecast.main.pressure + " hPa";
          const visibility = (forecast.visibility / 1000).toFixed(2) + " km";
          const windSpeed = (forecast.wind.speed * 3.6).toFixed(2) + " km/h";
          const degree = forecast.wind.deg;
          const windDegree = (degree) => {
            if (degree >= 0 && degree <= 22.5) return "North";
            else if (degree > 22.5 && degree <= 67.5) return "North-East";
            else if (degree > 67.5 && degree <= 112.5) return "East";
            else if (degree > 112.5 && degree <= 157.5) return "South-East";
            else if (degree > 157.5 && degree <= 202.5) return "South";
            else if (degree > 202.5 && degree <= 247.5) return "South-West";
            else if (degree > 247.5 && degree <= 292.5) return "West";
            else if (degree > 292.5 && degree <= 337.5) return "North-West";
            return "North";
          };

          $(`#forecast-place`).text(city);
          $(`#forecast-describe-box-${idx}`).find(`#forecast-describe-box-title-${idx}`).text(time);
          $(`#forecast-describe-box-${idx}`).find(`#forecast-describe-box-feels-like-${idx}`).text(feelsLike);
          $(`#forecast-describe-box-${idx}`).find(`#forecast-describe-box-codition-${idx}`).text(condition);
          $(`#forecast-describe-box-${idx}`)
            .find(`#forecast-describe-box-temperature-${idx}`)
            .text(minTemperature + " - " + maxTemperature);
          $(`#forecast-describe-box-${idx}`).find(`#forecast-describe-box-humidity-amount-${idx}`).text(humidity);
          $(`#forecast-describe-box-${idx}`).find(`#forecast-describe-box-cloud-coverage-amount-${idx}`).text(cloudCoverage);
          $(`#forecast-describe-box-${idx}`).find(`#forecast-describe-box-air-pressure-amount-${idx}`).text(airPressure);
          $(`#forecast-describe-box-${idx}`).find(`#forecast-describe-box-visibility-amount-${idx}`).text(visibility);
          $(`#forecast-describe-box-${idx}`).find(`#forecast-describe-box-wind-speed-amount-${idx}`).text(windSpeed);
          $(`#forecast-describe-box-${idx}`).find(`#forecast-describe-box-wind-degree-amount-${idx}`).text(windDegree);

          idx++;
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
// ***************** Exit button from forecast description page *****************
// ******************************************************************************

$("#forecast-details-exit-btn").on("click", function () {
  window.location.href = "forecast.html";
});

// ******************************************************************************
// ******************** Fetch weather news from newsapi.org ********************
// ******************************************************************************

$(document).ready(function () {
  const currentUrl = window.location.href;

  const url1 = "http://127.0.0.1:5500/news.html";
  const url2 = "https://tanvir-ahmmad-33.github.io/Climora/news.html";
  const url3 = "http://tanvir-ahmmad-33.github.io/Climora/news.html";

  if (currentUrl === url1 || currentUrl === url2 || currentUrl === url3) {
    let articles = [];

    fetchWeatherNews(articles);

    // $("#news-prev-btn").on("click", function () {
    //   // Handle previous button click
    // });

    // $("#news-next-btn").on("click", function () {
    //   // Handle next button click
    // });
  }
});

function fetchWeatherNews(articles) {
  const apiKey = "f9eb284ce45c4b69ad4ee7679849691f";
  const query = "weather";

  console.log("loaded ajax");

  $.ajax({
    url: "https://newsapi.org/v2/everything",
    method: "GET",
    data: {
      q: query,
      apiKey: apiKey,
      language: "en",
      pageSize: 2,
      page: 1,
    },
    success: function (data) {
      if (data.articles && data.articles.length > 0) {
        articles = data.articles;
        displayArticle(articles);
      } else {
        alert("No articles found.");
      }
    },
    error: function (xhr, status, error) {
      console.log("Error Details:", xhr);
      if (xhr.status === 404) {
        alert("No news found for the given query.");
      } else if (xhr.status === 401) {
        alert("Invalid API key. Please check your API key.");
      } else if (xhr.status === 400 && xhr.responseJSON && xhr.responseJSON.code === "apiKeyMissing") {
        alert("Your API key is missing. Please check your API key.");
      } else {
        alert("There was an error fetching the data: " + error);
      }
    },
  });
}

function displayArticle(articles) {
  for (let idx = 0; idx < articles.length && idx < 2; idx++) {
    console.log(articles[idx]);
    const article = articles[idx];

    const imageUrl = article.urlToImage;
    const author = article.author ? article.author : "Unknown Author";

    const date = article.publishedAt ? new Date(article.publishedAt) : new Date();
    const fullDate =
      date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }) +
      ", " +
      date.toLocaleDateString("en-GB", { weekday: "long" });

    const articleTitle = article.title;
    const articleContent = article.content;
    const articleUrl = article.url;

    console.log(articleTitle);

    $(`#news-image-${idx}`).attr("src", imageUrl);
    $(`#news-author-${idx}`).text(author);
    $(`#news-date-${idx}`).text(fullDate);
    $(`#news-title-${idx}`).text(articleTitle);
    $(`#news-content-${idx}`).text(articleContent);
    $(`#news-link-address-${idx}`).attr("href", articleUrl).text("For more details");
  }
}
