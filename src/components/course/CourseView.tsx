import React from 'react';
import { ICourse } from '../../interface/course';
import { X, Edit, Calendar, Users, DollarSign } from 'lucide-react';

interface CourseViewProps {
    course: ICourse;
    onClose: () => void;
    onEdit: () => void;
}

const CourseView: React.FC<CourseViewProps> = ({ course, onClose, onEdit }) => {
    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {course.courseTitle}
                            </h2>
                            
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={onEdit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Edit size={16} />
                                Edit
                            </button>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Course Image */}
                    <div className="mb-6">
                        <img
                            src={course.imageUrl}
                            alt={course.courseTitle}
                            className="w-full h-64 object-cover rounded-lg"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                            }}
                        />
                    </div>

                    {/* Course Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="text-green-600" size={20} />
                                <span className="font-semibold text-gray-700">Price</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                                ${course.regularPrice}
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="text-blue-600" size={20} />
                                <span className="font-semibold text-gray-700">Students</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                0
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="text-purple-600" size={20} />
                                <span className="font-semibold text-gray-700">Created</span>
                            </div>
                            <p className="text-lg font-medium text-gray-800">
                                {course.createdAt ? formatDate(course.createdAt) : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {course.description}
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Additional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <span className="font-medium">Course ID:</span> {course._id}
                            </div>
                            <div>
                                <span className="font-medium">Admin ID:</span> {course.adminId}
                            </div>
                            {course.updatedAt && (
                                <div>
                                    <span className="font-medium">Last Updated:</span> {formatDate(course.updatedAt)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseView;
