import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Admin, AdminDashboardStats, Student, Teacher, Course,} from '@/interface/admin';
import { adminService } from '@/services/adminService';
import { Leave } from '@/interface/leave';

interface AdminState {
  admin: Admin | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  dashboardStats: AdminDashboardStats | null;
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  users: any[];
  leaves: Leave[];
  totalPages: number;
  totalLeavePages: number;
}

const initialState: AdminState = {
  admin: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  dashboardStats: null,
  students: [],
  teachers: [],
  courses: [],
  users: [],
  leaves: [],
  totalPages: 1,
  totalLeavePages: 1,
};

export const loginAdmin = createAsyncThunk(
  'admin/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await adminService.login(credentials);
      localStorage.setItem('adminData', JSON.stringify(response.admin));
      localStorage.setItem('adminToken', response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  'admin/logout',
  async () => {
    await adminService.logout();
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
  }
);

export const getDashboardStats = createAsyncThunk(
  'admin/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await adminService.getDashboardStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const getStudents = createAsyncThunk(
  'admin/getStudents',
  async (_, { rejectWithValue }) => {
    try {
      const students = await adminService.getStudents();
      return students;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const getTeachers = createAsyncThunk(
  'admin/getTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const teachers = await adminService.getTeachers();
      return teachers;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teachers');
    }
  }
);

export const getCourses = createAsyncThunk(
  'admin/getCourses',
  async (_, { rejectWithValue }) => {
    try {
      const courses = await adminService.getCourses();
      return courses;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const getUsers = createAsyncThunk(
  'admin/getUsers',
  async (params: { page: number; limit: number; search: string }, { rejectWithValue }) => {
    try {
      const response = await adminService.getUsers(params.page, params.limit, params.search);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const blockUnblock = createAsyncThunk(
  'admin/blockUnblock',
  async (params: { userId: string; isBlocked: boolean }, { rejectWithValue }) => {
    try {
      const response = await adminService.blockUnblock(params.userId, params.isBlocked);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

export const getPendingLeaves = createAsyncThunk(
  'admin/getPendingLeaves',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await adminService.getPendingLeaves(params.page, params.limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending leaves');
    }
  }
);

export const updateLeaveStatus = createAsyncThunk(
  'admin/updateLeaveStatus',
  async (params: { leaveId: string; status: 'Approved' | 'Rejected'; rejectionReason?: string }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateLeaveStatus(params.leaveId, params.status, params.rejectionReason);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update leave status');
    }
  }
);

export const getCalendarLeaves = createAsyncThunk(
  'admin/getCalendarLeaves',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getCalendarLeaves();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calendar leaves');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAdmin: (state, action: PayloadAction<Admin>) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
    },
    initializeAdmin: (state) => {
      try {
        const adminData = localStorage.getItem('adminData');
        const adminToken = localStorage.getItem('adminToken');
        if (adminData && adminToken) {
          const parsedAdmin = JSON.parse(adminData);
          if (parsedAdmin && typeof parsedAdmin === 'object') {
            state.admin = parsedAdmin;
            state.isAuthenticated = true;
          } else {
            localStorage.removeItem('adminData');
            localStorage.removeItem('adminToken');
          }
        }
      } catch (error) {
        console.error('Error initializing admin from localStorage:', error);
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminToken');
        state.admin = null;
        state.isAuthenticated = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.error = null;
        state.dashboardStats = null;
        state.students = [];
        state.teachers = [];
        state.courses = [];
        state.users = [];
        state.leaves = [];
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      })
      .addCase(getStudents.fulfilled, (state, action) => {
        state.students = action.payload;
      })
      .addCase(getTeachers.fulfilled, (state, action) => {
        state.teachers = action.payload;
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.totalPages = Math.ceil(action.payload.total / 10);
      })
     .addCase(blockUnblock.fulfilled, (state, action) => {
  const updatedUser = action.payload
  state.users = state.users.map(user =>
    user._id === updatedUser._id ? updatedUser : user
  )
})

      .addCase(getPendingLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.leaves;
        state.totalLeavePages = Math.ceil(action.payload.total / 10);
      })
      .addCase(getPendingLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.leaves = state.leaves.map((leave) =>
          leave._id === action.payload._id ? action.payload : leave
        );
      })
      .addCase(getCalendarLeaves.fulfilled, (state, action) => {
        state.leaves = action.payload;
      });
  },
});

export const { clearError, setAdmin, initializeAdmin } = adminSlice.actions;
export default adminSlice.reducer;