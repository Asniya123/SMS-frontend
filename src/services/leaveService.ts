import studentInstance from '@/api/studentInstance';
import { API_ENDPOINTS } from '@/constant/url';
import { Leave, LeaveInput } from '@/interface/leave';

class LeaveService {
  async applyLeave(leaveData: LeaveInput): Promise<Leave> {
    try {
      console.log('Applying leave with data:', leaveData);
      const response = await studentInstance.post(API_ENDPOINTS.LEAVE.APPLY, leaveData);
      return response.data;
    } catch (error: any) {
      console.error('Error applying leave:', error);
      throw this.handleError(error);
    }
  }

  async getUserLeaves(page: number, limit: number): Promise<{ leaves: Leave[]; total: number }> {
    try {
      console.log(`Fetching user leaves - page: ${page}, limit: ${limit}`);
      const response = await studentInstance.get(API_ENDPOINTS.LEAVE.MY_LEAVES, {
        params: { page, limit }
      });
      
      console.log('Leave service response:', response.data);
      const payload = response.data;
      
      return {
        leaves: payload?.leaves || [],
        total: payload?.total || 0,
      };
    } catch (error: any) {
      console.error('Error fetching user leaves:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || 'Unknown error';
      
      console.error(`API Error [${status}]:`, message);
      
      switch (status) {
        case 401:
          return new Error(`Authentication failed: ${message}`);
        case 403:
          return new Error(`Access denied: ${message}`);
        case 400:
          return new Error(`Bad request: ${message}`);
        case 500:
          return new Error(`Server error: ${message}`);
        default:
          return new Error(`Request failed (${status}): ${message}`);
      }
    } else if (error.request) {
      return new Error('Network error: No response from server');
    } else {
      return new Error(`Request setup error: ${error.message}`);
    }
  }
}

export const leaveService = new LeaveService();