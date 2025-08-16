import studentInstance from '@/api/studentInstance'
import { API_ENDPOINTS } from '@/constant/url'
import { LoginCredentials, LoginResponse, User } from '@/interface/user'
import Cookies from 'js-cookie'

class UserService {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await studentInstance.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    
    const { accessToken, refreshToken, user } = response.data
    
    // Store tokens in cookies
    Cookies.set('authToken', accessToken, { expires: 7 })
    Cookies.set('refreshToken', refreshToken, { expires: 30 })
    
    // Convert backend user format to frontend User format
    const frontendUser: User = {
      id: user?.id || '',
      email: user?.email || credentials.email,
      firstName: user?.name?.split(' ')[0] || 'Student',
      lastName: user?.name?.split(' ').slice(1).join(' ') || 'User',
      role: 'student',
      createdAt: user?.createdAt || new Date().toISOString(),
      updatedAt: user?.updatedAt || new Date().toISOString()
    }
    
    return frontendUser
  }

  async logout(): Promise<void> {
    try {
      await studentInstance.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Remove tokens from cookies
      Cookies.remove('authToken')
      Cookies.remove('refreshToken')
    }
  }

  async getProfile(): Promise<User> {
    const response = await studentInstance.get(API_ENDPOINTS.STUDENT.PROFILE)
    return response.data
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await studentInstance.put(API_ENDPOINTS.STUDENT.PROFILE, userData)
    return response.data
  }

  isAuthenticated(): boolean {
    return !!Cookies.get('authToken')
  }

  getToken(): string | undefined {
    return Cookies.get('authToken')
  }
}

export const userService = new UserService()
