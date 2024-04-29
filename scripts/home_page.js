fetchWeather();

async function fetchWeather() {
  const apiKey = 'c7f9faa1920dc7b5cb186959c5113192';
  const lat = 39.006860
  const lon = -84.570030
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const weatherDataElement = document.querySelector('.weather-card');
    weatherDataElement.innerHTML = `
      <h2>Weather in: ${data.name}</h2>
      <p class="temp">Temperature: ${Math.floor(data.main.temp)}&#xb0;F</p>
      <p class="desc">Description: ${data.weather[0].main}</p>
      <p class="humid">Humidity: ${data.main.humidity}%</p>
      <p class="wind">Wind Speed: ${Math.round(data.wind.speed)}mph</p>
    `;
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}