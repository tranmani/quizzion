const axios = require("axios");

const baseURL = "https://backend.dev.parantion.nl/backend/api";

module.exports = axios.create({
    baseURL,
    headers: {
        'X-Database': 'lab'
    }
});