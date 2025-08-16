export interface ICourse {
    _id: string;
    courseTitle: string;
    imageUrl: string;
    description: string;
    regularPrice: number;
    adminId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type CreateCourseDTO = Omit<ICourse, "_id" | "createdAt" | "updatedAt">;

export interface CourseListResponse {
    courses: ICourse[];
    totalPages: number;
    currentPage: number;
    totalCourses: number;
}

export interface CourseResponse {
    success: boolean;
    message: string;
    course?: ICourse;
}


export interface IEnrollment {
  courseId: string;
  paymentId?: string;
  orderId?: string;
  amount: number;
  currency: string;
  enrolledAt: Date;
  walletTransactionId?: string;
  razorpay_signature?: string;
}