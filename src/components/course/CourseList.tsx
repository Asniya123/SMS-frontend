import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { listCourses, deleteCourse, setPage, setLimit } from '../../redux/slice/courseSlice';
import { ICourse } from '../../interface/course';
import { Trash2, Edit, Eye, Plus, Search } from 'lucide-react';

interface CourseListProps {
    adminId: string;
    onEditCourse: (course: ICourse) => void;
    onViewCourse: (course: ICourse) => void;
    onAddCourse: () => void;
}

const CourseList: React.FC<CourseListProps> = ({ 
    adminId, 
    onEditCourse, 
    onViewCourse, 
    onAddCourse 
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { courses, loading, error, total, page, limit, totalPages } = useSelector(
        (state: RootState) => state.course
    );

    const [searchTerm, setSearchTerm] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

    useEffect(() => {
        if (adminId) {
            dispatch(listCourses({ adminId, page, limit, search: searchTerm }));
        }
    }, [dispatch, adminId, page, limit, searchTerm]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        const timeout = setTimeout(() => {
            dispatch(setPage(1));
        }, 500);
        setSearchTimeout(timeout);
    };

    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
    };

    const handleLimitChange = (newLimit: number) => {
        dispatch(setLimit(newLimit));
        dispatch(setPage(1));
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await dispatch(deleteCourse(courseId)).unwrap();
            } catch (error) {
                console.error('Failed to delete course:', error);
            }
        }
    };

    if (loading && courses.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
                <button
                    onClick={onAddCourse}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Course
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {/* Course Grid */}
            {courses.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No courses found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {courses.map((course) => (
                        <div key={course._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                                <img
                                    src={course.imageUrl}
                                    alt={course.courseTitle}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/400x225?text=No+Image';
                                    }}
                                />
                            </div>
                            
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
                                    {course.courseTitle}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                    {course.description}
                                </p>
                                
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-lg font-bold text-blue-600">
                                        ${course.regularPrice}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onViewCourse(course)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                                >
                                    <Eye size={16} />
                                    View
                                </button>
                                <button
                                    onClick={() => onEditCourse(course)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                                >
                                    <Edit size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteCourse(course._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} courses
                        </span>
                        <select
                            value={limit}
                            onChange={(e) => handleLimitChange(Number(e.target.value))}
                            className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                        </select>
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-1 border rounded-lg text-sm ${
                                    pageNum === page
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                        
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseList;

