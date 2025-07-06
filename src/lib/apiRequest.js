import axios from "axios";

// Toggle this variable to switch environments
const USE_DEPLOYED = false;

const apiRequest = axios.create({
    baseURL: USE_DEPLOYED
        ? "https://mess-backend-01.onrender.com/api" // Deployed URL
        : "http://localhost:5000/api",              // Local development URL
    withCredentials: true,
});

// Add a request interceptor to include the JWT token in the Authorization header
apiRequest.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiRequest;