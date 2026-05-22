import axios from 'axios';

const api = axios.create({
  baseURL: 'https://back-end-safein-production.up.railway.app/',
});

// Interceptor ini wajib ada untuk menempelkan token di setiap request
api.interceptors.request.use((config) => {
  // Pastikan nama 'authToken' sama dengan yang kamu set di Login.jsx
  const token = localStorage.getItem('authToken'); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
