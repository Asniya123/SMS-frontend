// courseInstance.ts (assumed)
import axios from 'axios';
import Cookies from 'js-cookie'; // Add this if Cookies is used
import { API_BASE_URL } from '@/constant/url';

const courseInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Ensure cookies are sent if using Cookies
});

// Add token interceptor if needed
courseInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken'); // or localStorage.getItem('adminToken') for admin
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default courseInstance;