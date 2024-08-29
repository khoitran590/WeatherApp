const apiKey = '381349b1f47a31c8dbb9e00405692cd1';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');

searchBtn.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const celsius = data.main.temp;
            const farenheit = (celsius * 9/5) + 32;
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(celsius)}°C / ${Math.round(farenheit)}°F`;
            descriptionElement.textContent = data.weather[0].description;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}