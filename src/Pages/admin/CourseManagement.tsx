import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CourseList from '../../components/course/CourseList';
import CourseForm from '../../components/course/CourseForm';
import CourseView from '../../components/course/CourseView';
import { ICourse } from '../../interface/course';

const CourseManagement: React.FC = () => {
    const { admin } = useSelector((state: RootState) => state.admin);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
    const [viewingCourse, setViewingCourse] = useState<ICourse | null>(null);

    const handleAddCourse = () => {
        setShowAddForm(true);
    };

    const handleEditCourse = (course: ICourse) => {
        setEditingCourse(course);
    };

    const handleViewCourse = (course: ICourse) => {
        setViewingCourse(course);
    };

    const handleCloseForm = () => {
        setShowAddForm(false);
        setEditingCourse(null);
    };

    const handleCloseView = () => {
        setViewingCourse(null);
    };

    const handleEditFromView = () => {
        if (viewingCourse) {
            setEditingCourse(viewingCourse);
            setViewingCourse(null);
        }
    };

    if (!admin) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">Please log in to manage courses.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                <p className="text-gray-600 mt-2">
                    Manage your courses, add new ones, and track student engagement.
                </p>
            </div>

            <CourseList
                adminId={admin._id || admin.id || ''}
                onAddCourse={handleAddCourse}
                onEditCourse={handleEditCourse}
                onViewCourse={handleViewCourse}
            />

            {/* Add Course Form Modal */}
            {showAddForm && (
                <CourseForm
                    isOpen={showAddForm}
                    adminId={admin._id || admin.id || ''}
                    onClose={handleCloseForm}
                />
            )}

            {/* Edit Course Form Modal */}
            {editingCourse && (
                <CourseForm
                    isOpen={!!editingCourse}
                    course={editingCourse}
                    adminId={admin._id || admin.id || ''}
                    onClose={handleCloseForm}
                />
            )}

            {/* View Course Modal */}
            {viewingCourse && (
                <CourseView
                    course={viewingCourse}
                    onClose={handleCloseView}
                    onEdit={handleEditFromView}
                />
            )}
        </div>
    );
};

export default CourseManagement;
