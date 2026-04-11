import axios from 'axios';

const api = axios.create({
    // In Docker/production: Nginx proxies /api → server container (relative URL)
    // In local dev: set VITE_API_URL=http://localhost:5000/api in client/.env.local
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
