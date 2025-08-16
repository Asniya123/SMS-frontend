import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { BookOpen, Users, DollarSign, TrendingUp, Eye, Star, BarChart3 } from 'lucide-react';

const AdminStats: React.FC = () => {
    const { courses } = useSelector((state: RootState) => state.course);
    const { admin } = useSelector((state: RootState) => state.admin);

    // Mock data - replace with actual API calls
    const stats = {
        totalCourses: courses.length,
        totalStudents: 1250,
        totalRevenue: 45600,
        activeUsers: 890,
        courseViews: 15420,
        averageRating: 4.6
    };

    const statCards = [
        {
            title: 'Total Courses',
            value: stats.totalCourses,
            change: '+12%',
            changeType: 'positive',
            icon: BookOpen,
            color: 'blue'
        },
        {
            title: 'Total Students',
            value: stats.totalStudents.toLocaleString(),
            change: '+8%',
            changeType: 'positive',
            icon: Users,
            color: 'green'
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            change: '+15%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'yellow'
        },
        {
            title: 'Active Users',
            value: stats.activeUsers.toLocaleString(),
            change: '+5%',
            changeType: 'positive',
            icon: TrendingUp,
            color: 'purple'
        },
        {
            title: 'Course Views',
            value: stats.courseViews.toLocaleString(),
            change: '+22%',
            changeType: 'positive',
            icon: Eye,
            color: 'indigo'
        },
        {
            title: 'Average Rating',
            value: stats.averageRating,
            change: '+0.2',
            changeType: 'positive',
            icon: Star,
            color: 'pink'
        }
    ];

    const getColorClasses = (color: string) => {
        const colorMap: Record<string, string> = {
            blue: 'bg-blue-500 text-blue-100',
            green: 'bg-green-500 text-green-100',
            yellow: 'bg-yellow-500 text-yellow-100',
            purple: 'bg-purple-500 text-purple-100',
            indigo: 'bg-indigo-500 text-indigo-100',
            pink: 'bg-pink-500 text-pink-100'
        };
        return colorMap[color] || 'bg-gray-500 text-gray-100';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">
                    Welcome back, {admin?.firstName} {admin?.lastName}. Here's what's happening with your platform.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${getColorClasses(stat.color)}`}>
                                    <Icon size={20} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <span className={`text-sm font-medium ${
                                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {stat.change}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">from last month</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Courses */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Courses</h3>
                    <div className="space-y-3">
                        {courses.slice(0, 5).map((course) => (
                            <div key={course._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <img
                                    src={course.imageUrl}
                                    alt={course.courseTitle}
                                    className="w-12 h-12 object-cover rounded-lg"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {course.courseTitle}
                                    </p>
                                    
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-green-600">
                                        ${course.regularPrice}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {courses.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No courses available</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <BookOpen size={16} className="mr-2" />
                            Add New Course
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <Users size={16} className="mr-2" />
                            Manage Users
                        </button>
                        <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            <BarChart3 size={16} className="mr-2" />
                            View Reports
                        </button>
                    </div>
                </div>
            </div>

            {/* Platform Health */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">System Status</p>
                        <p className="text-xs text-green-600">All Systems Operational</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Database</p>
                        <p className="text-xs text-blue-600">Connected & Healthy</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Performance</p>
                        <p className="text-xs text-yellow-600">Good (95%)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
