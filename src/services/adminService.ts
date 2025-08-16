import adminInstance from '@/api/adminInstance';
import { API_ENDPOINTS } from '@/constant/url';
import { AdminLoginCredentials, AdminLoginResponse, Admin, AdminDashboardStats, Student, Teacher, Course} from '@/interface/admin';
import { Leave, LeaveInput } from '@/interface/leave';

class AdminService {
  async login(credentials: AdminLoginCredentials): Promise<AdminLoginResponse> {
    const response = await adminInstance.post<AdminLoginResponse>(
      API_ENDPOINTS.ADMIN.LOGIN,
      credentials
    );
    const { token, refreshToken } = response.data;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminRefreshToken', refreshToken);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await adminInstance.post(API_ENDPOINTS.ADMIN.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
    }
  }

  async getProfile(): Promise<Admin> {
    const response = await adminInstance.get(API_ENDPOINTS.ADMIN.PROFILE);
    return response.data;
  }

  async updateProfile(adminData: Partial<Admin>): Promise<Admin> {
    const response = await adminInstance.put(API_ENDPOINTS.ADMIN.PROFILE, adminData);
    return response.data;
  }

  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await adminInstance.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  }

  async getStudents(): Promise<Student[]> {
    const response = await adminInstance.get(API_ENDPOINTS.ADMIN.STUDENTS);
    return response.data;
  }

  async getTeachers(): Promise<Teacher[]> {
    const response = await adminInstance.get(API_ENDPOINTS.ADMIN.TEACHERS);
    return response.data;
  }

  async getCourses(): Promise<Course[]> {
    const response = await adminInstance.get(API_ENDPOINTS.ADMIN.COURSES);
    return response.data;
  }

  async getUsers(page: number, limit: number, search: string): Promise<any> {
    const response = await adminInstance.get(`/admin/auth/getUsers`, {
      params: { page, limit, search },
    });
    const payload = response.data as any;
    return {
      users: payload?.data?.users || [],
      total: payload?.data?.pagination?.totalItems || 0,
    };
  }

  async blockUnblock(userId: string, isBlocked: boolean): Promise<any> {
    const response = await adminInstance.patch(`/admin/auth/block-unblock/${userId}`, { isBlocked });
    return response.data;
  }

  async applyLeave(leaveData: LeaveInput): Promise<Leave> {
    const response = await adminInstance.post(API_ENDPOINTS.LEAVE.APPLY, leaveData);
    return response.data;
  }

  async getUserLeaves(page: number, limit: number): Promise<{ leaves: Leave[]; total: number }> {
    const response = await adminInstance.get(API_ENDPOINTS.LEAVE.MY_LEAVES, {
      params: { page, limit },
    });
    const payload = response.data as any;
    return {
      leaves: payload?.leaves || [],
      total: payload?.total || 0,
    };
  }

  async getPendingLeaves(page: number, limit: number): Promise<{ leaves: Leave[]; total: number }> {
    const response = await adminInstance.get(API_ENDPOINTS.LEAVE.PENDING, {
      params: { page, limit },
    });
    const payload = response.data as any;
    return {
      leaves: payload?.leaves || [],
      total: payload?.total || 0,
    };
  }

  async updateLeaveStatus(leaveId: string, status: 'Approved' | 'Rejected', rejectionReason?: string): Promise<Leave> {
    const response = await adminInstance.patch(`${API_ENDPOINTS.LEAVE.UPDATE_STATUS}/${leaveId}`, {
      status,
      rejectionReason,
    });
    return response.data;
  }

  async getCalendarLeaves(): Promise<Leave[]> {
    const response = await adminInstance.get(API_ENDPOINTS.LEAVE.CALENDAR);
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  getToken(): string | undefined {
    return localStorage.getItem('adminToken') || undefined;
  }
}

export const adminService = new AdminService();