import axios from "axios";

const baseURL = "https://backend.dev.parantion.nl/backend/api";

export default axios.create({
    baseURL,
    headers: { 
        'X-Database': 'lab'
    }
});