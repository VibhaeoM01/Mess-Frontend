import axios from "axios";

const apiRequest = axios.create({
    // baseURL: "http://localhost:5000/api",  // Local development URL
    baseURL: "https://mess-backend-01.onrender.com/api",  // Deployed URL
    withCredentials: true,
});

export default apiRequest;