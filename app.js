const apiKey = '381349b1f47a31c8dbb9e00405692cd1';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const errorMsg = document.getElementById('errorMessage');

searchBtn.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
        errorMsg.textContent = '';
    } else {
        errorMsg.textContent = 'Please enter a city name'
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) { // Check if the response is successful
                const celsius = data.main.temp;
                const fahrenheit = (celsius * 9/5) + 32;
                locationElement.textContent = data.name;
                temperatureElement.textContent = `${Math.round(celsius)}°C / ${Math.round(fahrenheit)}°F`;
                descriptionElement.textContent = data.weather[0].description;
                errorMessage.textContent = ''; // Clear any error message
            } else {
                errorMessage.textContent = 'City not found. Please try again.'; // Display error if city not found
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            errorMessage.textContent = 'Error fetching weather data. Please try again later.'; // Display error message
        });
}
function resetWeather(){
    locationInput.value = ''; // Clear the input field
    locationElement.textContent = ''; // Clear location display
    temperatureElement.textContent = ''; // Clear temperature display
    descriptionElement.textContent = ''; // Clear description display
}
resetBtn.addEventListener('click', resetWeather)
