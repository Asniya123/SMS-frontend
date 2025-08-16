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
  message: string
  userId: string
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
    mobile: number
    isVerified: boolean
    is_blocked: boolean
    createdAt: string
    updatedAt: string
  } | null
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
