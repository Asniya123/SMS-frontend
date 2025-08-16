export interface Leave {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveInput {
  startDate: string;
  endDate: string;
  reason: string;
}