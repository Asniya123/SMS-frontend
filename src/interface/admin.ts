export interface Admin {
  id?: string
  _id?: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  role?: 'admin'
  permissions?: string[]
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface AdminLoginCredentials {
  email: string
  password: string
}

export interface AdminLoginResponse {
  admin: Admin
  token: string
  refreshToken: string
}

export interface AdminDashboardStats {
  totalStudents: number
  totalTeachers: number
  totalCourses: number
  activeUsers: number
}

export interface Student {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student'
  status: 'active' | 'inactive' | 'suspended'
  enrollmentDate: string
  avatar?: string
}

export interface Teacher {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'teacher'
  status: 'active' | 'inactive' | 'suspended'
  department: string
  hireDate: string
  avatar?: string
}

export interface Course {
  id: string
  name: string
  description: string
  credits: number
  teacherId: string
  teacherName: string
  studentCount: number
  status: 'active' | 'inactive'
  createdAt: string
}
