import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { X, Plus, Edit } from 'lucide-react';
import { addCourse, editCourse, } from '@/redux/slice/courseSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { ICourse, CreateCourseDTO } from '@/interface/course';
import uploadImage from '@/utils/cloudinary';

interface CourseFormProps {
    isOpen: boolean;
    onClose: () => void;
    course?: ICourse | null;
    adminId: string;
}

const CourseForm: React.FC<CourseFormProps> = ({ isOpen, onClose, course, adminId }) => {
    const [formData, setFormData] = useState<CreateCourseDTO>({
        courseTitle: '',
        description: '',
        imageUrl: '',
        regularPrice: 0,
        adminId: adminId
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.course);
    const { isAuthenticated } = useSelector((state: RootState) => state.admin);
    
    // Check if admin is authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            console.log('Admin not authenticated, redirecting...');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (course) {
            setFormData({
                courseTitle: course.courseTitle,
                description: course.description,
                imageUrl: course.imageUrl,
                regularPrice: course.regularPrice,
                adminId: course.adminId
            });
            setImagePreview(course.imageUrl);
        } else {
            setFormData({
                courseTitle: '',
                description: '',
                imageUrl: '',
                regularPrice: 0,
                adminId: adminId
            });
            setImagePreview('');
        }
        setImageFile(null);
    }, [course, adminId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'regularPrice' ? parseFloat(value) || 0 : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.courseTitle || !formData.description || !formData.regularPrice) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!imageFile && !formData.imageUrl) {
            toast.error('Please select an image');
            return;
        }

        try {
            let imageUrl = formData.imageUrl;
            
            if (imageFile) {
                setIsUploading(true);
                imageUrl = await uploadImage(imageFile);
                setIsUploading(false);
            }

            const courseData = {
                ...formData,
                imageUrl,
                adminId: adminId
            };

            if (course) {
                await dispatch(editCourse({ courseId: course._id, courseData })).unwrap();
                toast.success('Course updated successfully!');
            } else {
                await dispatch(addCourse(courseData)).unwrap();
                toast.success('Course added successfully!');
            }
            
            onClose();
        } catch (error: any) {
            toast.error(error || 'Failed to save course');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {course ? 'Edit Course' : 'Add New Course'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Course Title *
                        </label>
                        <input
                            type="text"
                            id="courseTitle"
                            name="courseTitle"
                            value={formData.courseTitle}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter course title"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter course description"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                            Course Image *
                        </label>
                        <div className="space-y-2">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {imagePreview && (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-32 object-cover rounded-md border"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="regularPrice" className="block text-sm font-medium text-gray-700 mb-1">
                            Regular Price *
                        </label>
                        <input
                            type="number"
                            id="regularPrice"
                            name="regularPrice"
                            value={formData.regularPrice}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || isUploading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading || isUploading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {isUploading ? 'Uploading...' : 'Saving...'}
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    {course ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                    {course ? 'Update Course' : 'Add Course'}
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseForm;