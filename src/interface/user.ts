export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'teacher' | 'admin'
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
