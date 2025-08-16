import courseInstance from '../api/courseInstance';
import { ICourse, CreateCourseDTO, CourseListResponse, CourseResponse } from '../interface/course';

export const courseService = {
    // Add a new course
    addCourse: async (courseData: CreateCourseDTO): Promise<CourseResponse> => {
        const response = await courseInstance.post('/add', courseData);
        return response.data;
    },

    // List courses for a specific admin
    listCourses: async (adminId: string, page: number = 1, limit: number = 10, search?: string): Promise<CourseListResponse> => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        
        const response = await courseInstance.get(`/list/${adminId}?${params.toString()}`);
        return response.data;
    },

    // Get a specific course by ID
    getCourse: async (courseId: string): Promise<CourseResponse> => {
        const response = await courseInstance.get(`/${courseId}`);
        return response.data;
    },

    // Edit a course
    editCourse: async (courseId: string, courseData: Partial<ICourse>): Promise<CourseResponse> => {
        const response = await courseInstance.put(`/${courseId}`, courseData);
        return response.data;
    },

    // Delete a course
    deleteCourse: async (courseId: string): Promise<{ message: string }> => {
        const response = await courseInstance.delete(`/${courseId}`);
        return response.data;
    }
};

