import axios from "axios";

// Toggle this variable to switch environments
const USE_DEPLOYED = true;

const apiRequest = axios.create({
    baseURL: USE_DEPLOYED
        ? "https://mess-backend-01.onrender.com/api" // Deployed URL
        : "http://localhost:5000/api",              // Local development URL
    withCredentials: true,
});

export default apiRequest;