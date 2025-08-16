import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ICourse, CreateCourseDTO } from '../../interface/course';
import { courseService } from '../../services/courseService';

interface CourseState {
    courses: ICourse[];
    currentCourse: ICourse | null;
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const initialState: CourseState = {
    courses: [],
    currentCourse: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
};

// Async thunks
export const addCourse = createAsyncThunk(
    'course/addCourse',
    async (courseData: CreateCourseDTO) => {
        const response = await courseService.addCourse(courseData);
        return response.course;
    }
);

export const listCourses = createAsyncThunk(
    'course/listCourses',
    async ({ adminId, page, limit, search }: { adminId: string; page: number; limit: number; search?: string }) => {
        const response = await courseService.listCourses(adminId, page, limit, search);
        return response;
    }
);

export const getCourse = createAsyncThunk(
    'course/getCourse',
    async (courseId: string) => {
        const response = await courseService.getCourse(courseId);
        return response.course;
    }
);

export const editCourse = createAsyncThunk(
    'course/editCourse',
    async ({ courseId, courseData }: { courseId: string; courseData: Partial<ICourse> }) => {
        const response = await courseService.editCourse(courseId, courseData);
        return response.course;
    }
);

export const deleteCourse = createAsyncThunk(
    'course/deleteCourse',
    async (courseId: string) => {
        await courseService.deleteCourse(courseId);
        return courseId;
    }
);

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setLimit: (state, action: PayloadAction<number>) => {
            state.limit = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Add Course
        builder
            .addCase(addCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCourse.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.courses.unshift(action.payload);
                    state.total += 1;
                }
            })
            .addCase(addCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to add course';
            });

        // List Courses
        builder
            .addCase(listCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload.courses;
                state.total = action.payload.totalCourses;
                state.page = action.payload.currentPage;
                state.limit = 10;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(listCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch courses';
            });

        // Get Course
        builder
            .addCase(getCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCourse.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.currentCourse = action.payload;
                }
            })
            .addCase(getCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch course';
            });

        // Edit Course
        builder
            .addCase(editCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editCourse.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const course = action.payload;
                    const index = state.courses.findIndex(c => c._id === course._id);
                    if (index !== -1) {
                        state.courses[index] = course;
                    }
                    if (state.currentCourse?._id === course._id) {
                        state.currentCourse = course;
                    }
                }
            })
            .addCase(editCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to edit course';
            });

        // Delete Course
        builder
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = state.courses.filter(course => course._id !== action.payload);
                state.total -= 1;
                if (state.currentCourse?._id === action.payload) {
                    state.currentCourse = null;
                }
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete course';
            });
    },
});

export const { clearError, clearCurrentCourse, setPage, setLimit } = courseSlice.actions;
export default courseSlice.reducer;

