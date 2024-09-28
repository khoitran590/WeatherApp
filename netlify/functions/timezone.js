const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const { lat, lng } = event.queryStringParameters;
    
    const apiKey = 'EMZEN5O9TW1J'; 
    const apiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lng}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching time data', error }),
        };
    }
};
