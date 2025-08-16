import axios from 'axios'
import { API_BASE_URL } from '@/constant/url'

const adminInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
adminInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
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
adminInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('adminRefreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/admin/auth/refresh-token`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          })
          const { accessToken } = response.data
          localStorage.setItem('adminToken', accessToken)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return adminInstance(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminRefreshToken')
        window.location.href = '/admin/login'
      }
    }

    return Promise.reject(error)
  }
)

export default adminInstance
