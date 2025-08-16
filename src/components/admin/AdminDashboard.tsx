import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { initializeAdmin, logoutAdmin } from '../../redux/slice/adminSlice';
import { LogOut, BookOpen, Users, BarChart3, Menu, X } from 'lucide-react';
import CourseManagement from '../../Pages/admin/CourseManagement';
import UserManagement from '../../Pages/admin/UserManagement';
import AdminStats from '../../Pages/admin/AdminStats';

type DashboardView = 'stats' | 'courses' | 'users';

const AdminDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const { admin } = useSelector((state: RootState) => state.admin);
    const [activeView, setActiveView] = useState<DashboardView>('stats');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Initialize admin state from localStorage
        dispatch(initializeAdmin());
    }, [dispatch]);

    // Add a small delay to ensure initialization completes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!admin) {
                // If still no admin after initialization, redirect to login
                window.location.href = '/admin/login';
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [admin]);

    const handleLogout = () => {
        // Clear localStorage and redirect
        localStorage.removeItem('adminData');
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
    };

    const menuItems = [
        {
            id: 'stats' as DashboardView,
            label: 'Dashboard',
            icon: BarChart3,
            description: 'Overview and statistics'
        },
        {
            id: 'courses' as DashboardView,
            label: 'Course Management',
            icon: BookOpen,
            description: 'Manage courses and content'
        },
        {
            id: 'users' as DashboardView,
            label: 'User Management',
            icon: Users,
            description: 'Manage students and tutors'
        }
    ];

    const renderActiveView = () => {
        switch (activeView) {
            case 'stats':
                return <AdminStats />;
            case 'courses':
                return <CourseManagement />;
            case 'users':
                return <UserManagement />;
            default:
                return <AdminStats />;
        }
    };

    if (!admin) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading admin data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                            <p className="text-sm text-gray-600">Welcome back, {admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`}</p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeView === item.id;
                            
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveView(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                                    <div>
                                        <div className="font-medium">{item.label}</div>
                                        <div className="text-xs text-gray-500">{item.description}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <Menu size={24} />
                        </button>
                        
                        <div className="flex items-center space-x-4">
                                                         <div className="text-right">
                                 <p className="text-sm font-medium text-gray-900">{admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`}</p>
                                 <p className="text-xs text-gray-500">Administrator</p>
                             </div>
                             <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                 <span className="text-white text-sm font-medium">
                                     {(admin.name?.charAt(0) || admin.firstName?.charAt(0) || 'A').toUpperCase()}
                                 </span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="p-6">
                    {renderActiveView()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
