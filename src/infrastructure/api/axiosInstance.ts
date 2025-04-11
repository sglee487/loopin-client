import axios from 'axios';
import keycloak from '@infrastructure/auth/keycloakService';

/**
 * Base URL for API requests, loaded from environment variables
 */
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

/**
 * Configured axios instance with base URL and default headers
 * This instance is used for all API requests in the application
 */
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor to add authentication token to all requests
 * Automatically adds the Keycloak token to the Authorization header
 * if a token is available
 */
axiosInstance.interceptors.request.use(
    async (config) => {
        if (keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    },
    (error) => {
        console.error('axios request error', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
