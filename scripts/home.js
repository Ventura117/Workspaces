let weather;

const weatherDisplay = document.querySelector('.weather-app-details');

fetch('http://localhost:3000/home/get_weather')
  .then(response => response.json())
  .then((data) => {
    weather = data;
    console.log(weather);
    renderWeather();
  })

  function renderWeather() {
    const temp = document.createElement('p')
      temp.textContent = `Temperature: ${Math.trunc(weather.main.temp)}°F`
      weatherDisplay.appendChild(temp);
    const desc = document.createElement('p')
      desc.textContent = `Description: ${JSON.stringify(weather.weather)}`
      weatherDisplay.appendChild(desc)
    const wind = document.createElement('p')
      wind.textContent = `Wind Speed: ${Math.trunc(weather.wind.speed)} mph`
      weatherDisplay.appendChild(wind)
  }
  