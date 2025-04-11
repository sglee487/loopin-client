import axios from 'axios';
import keycloak from '@infrastructure/api/services/keycloakService'; // Keycloak 인스턴스 가져오기

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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
