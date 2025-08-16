export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface ApiEndpoints {
  AUTH: {
    LOGIN: string;
    LOGOUT: string;
    REFRESH: string;
    REGISTER: string;
    COURSES: string;
    CREATE_ORDER: string;
    ENROLL_COURSE: string;
    WALLET: string;
  };
  STUDENT: {
    PROFILE: string;
    COURSES: string;
    ASSIGNMENTS: string;
  };
  ADMIN: {
    LOGIN: string;
    LOGOUT: string;
    REFRESH: string;
    PROFILE: string;
    DASHBOARD: string;
    STUDENTS: string;
    TEACHERS: string;
    COURSES: string;
  };
  LEAVE: {
    APPLY: string;
    MY_LEAVES: string;
    PENDING: string;
    UPDATE_STATUS: string;
    CALENDAR: string;
  };
}

export const API_ENDPOINTS: ApiEndpoints = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    REGISTER: '/auth/register',
    COURSES: '/auth/courses',
    CREATE_ORDER: '/auth/courses/create-order',
    ENROLL_COURSE: '/auth/courses',
    WALLET: '/auth/wallet',
  },
  STUDENT: {
    PROFILE: '/student/profile',
    COURSES: '/student/courses',
    ASSIGNMENTS: '/student/assignments',
  },
  ADMIN: {
    LOGIN: '/admin/auth/login',
    LOGOUT: '/admin/auth/logout',
    REFRESH: '/admin/auth/refresh',
    PROFILE: '/admin/profile',
    DASHBOARD: '/admin/dashboard',
    STUDENTS: '/admin/students',
    TEACHERS: '/admin/teachers',
    COURSES: '/admin/courses',
  },
  LEAVE: {
    APPLY: '/leaves/apply',
    MY_LEAVES: '/leaves/my-leaves',
    PENDING: '/leaves/pending',
    UPDATE_STATUS: '/leaves',
    CALENDAR: '/leaves/calendar',
  },
};