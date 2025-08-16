import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, UserCheck, UserX, Eye, X } from 'lucide-react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { RootState, AppDispatch } from '../../redux/store';
import { getUsers, blockUnblock, getPendingLeaves, updateLeaveStatus, getCalendarLeaves, clearError } from '../../redux/slice/adminSlice';

const localizer = momentLocalizer(moment);

interface User {
  _id: string;
  name: string;
  email: string;
  is_blocked: boolean;
  role: string;
  joinDate: string;
}

interface Leave {
  _id: string;
  userId: { _id: string; name: string; email: string };
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

const UserManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { admin, users, leaves, totalPages, totalLeavePages, loading, error } = useSelector((state: RootState) => state.admin);

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [leavePage, setLeavePage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [calendarLeaves, setCalendarLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    if (admin) {
      dispatch(getUsers({ page: currentPage, limit: 10, search: searchTerm }));
      dispatch(getPendingLeaves({ page: leavePage, limit: 10 }));
      dispatch(getCalendarLeaves()).then((result) => {
        if (getCalendarLeaves.fulfilled.match(result)) {
          setCalendarLeaves(result.payload);
        }
      });
    }
  }, [dispatch, admin, currentPage, leavePage, searchTerm]);

  useEffect(() => {
    if (users) {
      setFilteredUsers(users);
    }
  }, [users]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = async (userId: string, isBlocked: boolean) => {
    try {
      await dispatch(blockUnblock({ userId, isBlocked: isBlocked })).unwrap();
      dispatch(getUsers({ page: currentPage, limit: 10, search: searchTerm }));
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleLeaveStatus = async (leaveId: string, status: 'Approved' | 'Rejected') => {
    try {
      await dispatch(updateLeaveStatus({ leaveId, status, rejectionReason: status === 'Rejected' ? rejectionReason : undefined })).unwrap();
      setShowLeaveModal(false);
      setRejectionReason('');
      dispatch(getPendingLeaves({ page: leavePage, limit: 10 }));
      dispatch(getCalendarLeaves()).then((result) => {
        if (getCalendarLeaves.fulfilled.match(result)) {
          setCalendarLeaves(result.payload);
        }
      });
    } catch (error) {
      console.error('Failed to update leave status:', error);
    }
  };

  const getStatusBadge = (isBlocked: boolean) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}
      >
        {isBlocked ? 'Blocked' : 'Active'}
      </span>
    );
  };

  const getLeaveStatusBadge = (status: string) => {
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

  const events: CalendarEvent[] = calendarLeaves.map((leave) => ({
    title: `${leave.userId.name}'s Leave`,
    start: new Date(leave.startDate),
    end: new Date(leave.endDate),
    allDay: true,
    resource: leave,
  }));

  if (!admin) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Please log in to manage users and leaves.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User and Leave Management</h1>
        <p className="text-gray-600 mt-2">Manage users and their leave requests.</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span>{error}</span>
          <button onClick={() => dispatch(clearError())} className="absolute top-0 right-0 px-4 py-3">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Leave Calendar</h2>
        <Calendar
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
        <h2 className="text-xl font-semibold p-6">Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.is_blocked)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {user.is_blocked ? (
                        <button
                          onClick={() => handleStatusChange(user._id, false)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Unblock User"
                        >
                          <UserCheck size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(user._id, true)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Block User"
                        >
                          <UserX size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users found matching your criteria.</p>
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <h2 className="text-xl font-semibold p-6">Pending Leave Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{leave.userId.name}</div>
                    <div className="text-sm text-gray-500">{leave.userId.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getLeaveStatusBadge(leave.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedLeave(leave);
                          setShowLeaveModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Manage Leave"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leaves.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No pending leave requests found.</p>
          </div>
        )}
        {totalLeavePages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setLeavePage(Math.max(1, leavePage - 1))}
                disabled={leavePage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setLeavePage(Math.min(totalLeavePages, leavePage + 1))}
                disabled={leavePage === totalLeavePages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{leavePage}</span> of{' '}
                  <span className="font-medium">{totalLeavePages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setLeavePage(Math.max(1, leavePage - 1))}
                    disabled={leavePage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setLeavePage(Math.min(totalLeavePages, leavePage + 1))}
                    disabled={leavePage === totalLeavePages}
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

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedUser.is_blocked)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Joined</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedUser.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedUser.is_blocked ? (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedUser._id, false);
                      setSelectedUser(null);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Unblock User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedUser._id, true);
                      setSelectedUser(null);
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Block User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showLeaveModal && selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Leave Details</h3>
                <button onClick={() => setShowLeaveModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLeave.userId.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLeave.userId.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedLeave.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedLeave.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLeave.reason}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getLeaveStatusBadge(selectedLeave.status)}</div>
                </div>
                {selectedLeave.status === 'Rejected' && selectedLeave.rejectionReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLeave.rejectionReason}</p>
                  </div>
                )}
                {selectedLeave.status === 'Pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rejection Reason (if rejecting)</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter reason for rejection (required)"
                    />
                  </div>
                )}
              </div>
              {selectedLeave.status === 'Pending' && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowLeaveModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleLeaveStatus(selectedLeave._id, 'Approved')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleLeaveStatus(selectedLeave._id, 'Rejected')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    disabled={rejectionReason.trim() === ''}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;