import axios from 'axios';
import keycloak from './services/keycloakService'; // Keycloak 인스턴스 가져오기

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
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
