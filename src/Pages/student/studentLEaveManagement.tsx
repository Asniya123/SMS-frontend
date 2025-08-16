import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { applyLeave, getUserLeaves, clearError } from '../../redux/slice/leaveSlice';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

// Define types for leave and event
interface Leave {
  _id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Leave;
}

// Configure moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const StudentLeaveManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.student);
  const { leaves, totalPages, loading, error } = useSelector((state: RootState) => state.leave);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('authToken') || Cookies.get('jwt') || Cookies.get('token');
      console.log('Checking auth in LeaveManagement:', { token: !!token, user, isAuthenticated });
      
      if (!token && !isAuthenticated) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }
    };

    checkAuth();
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Fetching user leaves for authenticated user:', user.id);
      dispatch(getUserLeaves({ page: currentPage, limit: 10 }));
    }
  }, [dispatch, user, currentPage, isAuthenticated]);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(applyLeave({ startDate, endDate, reason })).unwrap();
      setStartDate('');
      setEndDate('');
      setReason('');
      dispatch(getUserLeaves({ page: currentPage, limit: 10 }));
    } catch (error) {
      console.error('Failed to apply leave:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          status === 'Pending'
            ? 'bg-yellow-100 text-yellow-800'
            : status === 'Approved'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {status}
      </span>
    );
  };

  const events: CalendarEvent[] = leaves.map((leave: Leave) => ({
    title: `Leave (${leave.status})`,
    start: new Date(leave.startDate),
    end: new Date(leave.endDate),
    allDay: true,
    resource: leave,
  }));

  if (!isAuthenticated && !Cookies.get('authToken') && !Cookies.get('jwt')) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Please log in to manage leaves.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
      <p className="text-gray-600 mt-2">Apply for leaves and view your leave status.</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span>{error}</span>
          <button onClick={() => dispatch(clearError())} className="absolute top-0 right-0 px-4 py-3">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
        <form onSubmit={handleApplyLeave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            Apply
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Leave Calendar</h2>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={(event: CalendarEvent) => ({
            style: {
              backgroundColor:
                event.resource.status === 'Approved'
                  ? '#10B981'
                  : event.resource.status === 'Pending'
                  ? '#F59E0B'
                  : '#EF4444',
              color: 'white',
            },
          })}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <h2 className="text-xl font-semibold p-6">Your Leave Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejection Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.map((leave: Leave) => (
                <tr key={leave._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(leave.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {leave.rejectionReason || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leaves.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No leave requests found.</p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentLeaveManagement;