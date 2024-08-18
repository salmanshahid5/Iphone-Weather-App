document.addEventListener("DOMContentLoaded", () => {
  const ApiKey = "0fcc0319f7f3be470eb965d93cc454b6";
  const city = "Paris";

  function getData(city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${ApiKey}`;
    fetch(weatherUrl)
      .then((res) => res.json())
      .then((data) => {
        const lat = data.coord.lat;
        const lon = data.coord.lon;

        const cityName = data.name;
        const kelvinTemp = data.main.temp;
        const celsiusTemp = (kelvinTemp - 273.15).toFixed(0);

        const weatherCondition = data.weather[0].description;
        const highTemp = (data.main.temp_max - 273.15).toFixed(0);
        const lowTemp = (data.main.temp_min - 273.15).toFixed(0);
        
        // Update HTML elements
        document.getElementById("city").querySelector("h1").textContent =
          cityName;
        document.getElementById("temp").textContent = `${celsiusTemp}`;
        document.getElementById("condition").textContent = weatherCondition;
        document.getElementById(
          "highlow"
        ).textContent = `H: ${highTemp}°C  L: ${lowTemp}°C`;

        // Fetch hourly forecast
        hourlyForecast(lat, lon);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
  
  // <-------------- hourly forcast ----------------------------->
  function hourlyForecast(lat, lon) {
    const hourApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`;
    fetch(hourApi)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const hourlyContainer = document.getElementById("hourly");
        hourlyContainer.innerHTML = "";

        data.list.slice(0, 5).forEach((items, index) => {
          const hourElement = document.createElement("div");
          hourElement.className = "hourly-weather";

          const hourTime = new Date(items.dt * 1000).getHours();
          const formattedTime =
            index === 0
              ? "Now"
              : hourTime > 12
              ? `${hourTime - 12} PM`
              : `${hourTime} AM`;

          const temp = Math.round(items.main.temp);
          const iconCode = items.weather[0]?.icon;
          const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

          hourElement.innerHTML = `
              <h5>${formattedTime}</h5>
              <img src="${iconUrl}" />
              <p>${temp}°C</p>`;
          hourlyContainer.appendChild(hourElement);
        });
      })
      .catch((error) =>
        console.error("Error fetching hourly forecast:", error)
      );
  }
// <------------------ days forcast------------------->
  getData(city);
});
