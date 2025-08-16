import { createSlice, createAsyncThunk,  } from '@reduxjs/toolkit';
import { leaveService } from '@/services/leaveService';
import { Leave, LeaveInput } from '@/interface/leave';

interface LeaveState {
  leaves: Leave[];
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  leaves: [],
  totalPages: 1,
  loading: false,
  error: null,
};

export const applyLeave = createAsyncThunk(
  'leave/applyLeave',
  async (leaveData: LeaveInput, { rejectWithValue }) => {
    try {
      const response = await leaveService.applyLeave(leaveData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply leave');
    }
  }
);

export const getUserLeaves = createAsyncThunk(
  'leave/getUserLeaves',
  async (params: { page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response = await leaveService.getUserLeaves(params.page, params.limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user leaves');
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves.push(action.payload);
        state.error = null;
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.leaves;
        state.totalPages = Math.ceil(action.payload.total / 10);
        state.error = null;
      })
      .addCase(getUserLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = leaveSlice.actions;
export default leaveSlice.reducer;