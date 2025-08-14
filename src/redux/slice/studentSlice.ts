import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/interface/user'
import { userService } from '@/services/userService'

interface StudentState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: StudentState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const loginStudent = createAsyncThunk(
  'student/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await userService.login(credentials)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const logoutStudent = createAsyncThunk(
  'student/logout',
  async () => {
    await userService.logout()
  }
)

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginStudent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginStudent.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(logoutStudent.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
      })
  },
})

export const { clearError, setUser } = studentSlice.actions
export default studentSlice.reducer
