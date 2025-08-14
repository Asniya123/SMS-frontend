import axios from 'axios'
import { API_BASE_URL } from '@/constant/url'
import Cookies from 'js-cookie'

const studentInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
studentInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
studentInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = Cookies.get('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })
          
          const { token } = response.data
          Cookies.set('authToken', token)
          
          originalRequest.headers.Authorization = `Bearer ${token}`
          return studentInstance(originalRequest)
        }
      } catch (refreshError) {
        Cookies.remove('authToken')
        Cookies.remove('refreshToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default studentInstance
