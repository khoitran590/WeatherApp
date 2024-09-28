const apiKey = '381349b1f47a31c8dbb9e00405692cd1';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const apiTimeKey = 'EMZEN5O9TW1J';
const apiTimeUrl = 'https://api.timezonedb.com/v2.1/get-time-zone';

const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const randomBtn = document.getElementById('randomBtn');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const errorMsg = document.getElementById('errorMessage');
const timeElement = document.getElementById('time');

const cities = [
    'New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Los Angeles', 'Dubai', 'Toronto', 'Beijing',
    'Hong Kong', 'Moscow', 'Mumbai', 'Cairo', 'Bangkok', 'Istanbul', 'Singapore', 'Rio de Janeiro', 'Johannesburg',
    'Mexico City', 'Buenos Aires', 'Rome', 'Shanghai', 'Lagos', 'Seoul', 'Lima', 'Jakarta', 'Santiago', 'Kuala Lumpur',
    'Vienna', 'Madrid', 'Barcelona', 'Munich', 'Stockholm', 'Copenhagen', 'Prague', 'Warsaw', 'Lisbon', 'Dublin'
];

let isFetching = false;

function fetchTimeWithDelay(location) {
    if (!isFetching) {
        isFetching = true;
        fetchTime(location);
        setTimeout(() => {
            isFetching = false;
        }, 500); // Add a 100ms delay between requests
    } else {
        errorMsg.textContent = 'Please wait a moment before making another request.';
    }
}



searchBtn.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchTime(location);
        fetchWeather(location);
        errorMsg.textContent = '';
    } else {
        errorMsg.textContent = 'Please enter a city name';
    }
});

randomBtn.addEventListener('click', () => {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    fetchWeather(randomCity);
    fetchTime(randomCity);
    errorMsg.textContent = ''; // Clear any error message
});

let retries = 0;
const maxRetries = 3; // Maximum retries allowed
const retryDelay = 1000; // Initial delay of 1 second

function fetchTime(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const lat = data.coord.lat;
                const lon = data.coord.lon;

                const timeUrl = `${apiTimeUrl}?key=${apiTimeKey}&format=json&by=position&lat=${lat}&lng=${lon}`;

                return fetch(timeUrl);
            } else {
                throw new Error('City not found. Please try again.');
            }
        })
        .then(response => response.json())
        .then(timeData => {
            if (timeData.status === 'OK') {
                timeElement.textContent = `Local Time: ${timeData.formatted}`;
                retries = 0; // Reset retries on success
            } else {
                throw new Error('Time not available for this location.');
            }
        })
        .catch(error => {
            if (retries < maxRetries) {
                retries++;
                setTimeout(() => {
                    fetchTime(location);
                }, retryDelay * retries); // Exponential backoff
            } else {
                errorMsg.textContent = `Failed to fetch time after ${retries} attempts. Please try again later.`;
                timeElement.textContent = ''; // Clear time on error
                retries = 0; // Reset retries after max attempts
            }
        });
}


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

function resetWeather() {
    locationInput.value = ''; // Clear the input field
    locationElement.textContent = ''; // Clear location display
    temperatureElement.textContent = ''; // Clear temperature display
    descriptionElement.textContent = ''; // Clear description display
    timeElement.textContent = '';
}

resetBtn.addEventListener('click', resetWeather);