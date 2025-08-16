import axios from 'axios'
import { API_BASE_URL } from '@/constant/url'
import Cookies from 'js-cookie'

const studentInstance = axios.create({
  baseURL: API_BASE_URL, // Use the imported constant instead of hardcoded URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add auth token
studentInstance.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Try multiple cookie names for auth token
    const token = Cookies.get('authToken') || Cookies.get('jwt') || Cookies.get('token');
    console.log('Auth token from cookie:', token ? 'Token exists' : 'No token found');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Authorization header');
    }
    
    // Log all cookies for debugging
    console.log('All cookies:', {
      authToken: Cookies.get('authToken'),
      refreshToken: Cookies.get('refreshToken'),
      jwt: Cookies.get('jwt'),
      token: Cookies.get('token')
    });
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
studentInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Success response from ${response.config.url}:`, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config

    console.error(`❌ Error response from ${originalRequest?.url}:`, {
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        console.log('Token refresh already in progress, queuing request...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return studentInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true
      isRefreshing = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        console.log('Attempting token refresh with refreshToken:', refreshToken ? 'Token exists' : 'No refresh token');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('Making refresh token request...');
        
        // Use the API_BASE_URL constant for the refresh token endpoint too
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, 
          { refreshToken }, // Send as JSON body
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000,
            withCredentials: true
          }
        );
        
        console.log('✅ Token refresh successful:', refreshResponse.data);
        const { token, accessToken } = refreshResponse.data;
        const newToken = token || accessToken;
        
        if (!newToken) {
          throw new Error('No token received from refresh response');
        }
        
        // Update the cookie with correct cookie name
        Cookies.set('authToken', newToken, { expires: 7 }); // Set expiry for 7 days
        
        // Process queued requests
        processQueue(null, newToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return studentInstance(originalRequest);
        
      } catch (refreshError: any) {
        console.error('❌ Token refresh failed:', refreshError.response?.data || refreshError.message);
        
        // Process queued requests with error
        processQueue(refreshError, null);
        
        // Clear all auth-related cookies
        Cookies.remove('authToken');
        Cookies.remove('refreshToken');
        Cookies.remove('jwt');
        Cookies.remove('token');
        
        // Only redirect if we're in a browser environment
        if (typeof window !== 'undefined') {
          console.log('Redirecting to login due to refresh token failure...');
          // Clear Redux state if needed
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error)
  }
)

export default studentInstance;