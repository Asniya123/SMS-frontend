import studentInstance from '@/api/studentInstance';
import { API_ENDPOINTS } from '@/constant/url';
import { IEnrollment } from '@/interface/course';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentDetails {
  paymentMethod: 'razorpay' | 'wallet';
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  walletTransactionId?: string;
}

class PaymentService {
  async createOrder(courseId: string, amount: number): Promise<CreateOrderResponse> {
    try {
      const token = Cookies.get('authToken');
      if (!token) throw new Error('User not authenticated');

      const response = await studentInstance.post(API_ENDPOINTS.AUTH.CREATE_ORDER, {
        courseId,
        amount: amount * 100, // Convert to paise for Razorpay
      });
      return response.data as CreateOrderResponse;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  async enrollCourse(courseId: string, paymentDetails: PaymentDetails): Promise<{ success: boolean; message: string; isEnrolled?: boolean }> {
    try {
      const response = await studentInstance.post(`${API_ENDPOINTS.AUTH.ENROLL_COURSE}/${courseId}/enroll`, paymentDetails);
      return response.data;
    } catch (error) {
      console.error('Error enrolling course:', error);
      throw new Error('Failed to enroll course');
    }
  }

  async checkEnrollmentStatus(courseId: string): Promise<{ success: boolean; isEnrolled: boolean }> {
    try {
      const response = await studentInstance.post(`${API_ENDPOINTS.AUTH.ENROLL_COURSE}/${courseId}/enroll`, {
        checkOnly: true,
        courseId,
      });
      return response.data as { success: boolean; isEnrolled: boolean };
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      throw new Error('Failed to check enrollment status');
    }
  }

  async getWalletBalance(userId: string): Promise<number> {
    try {
      const response = await studentInstance.get(API_ENDPOINTS.AUTH.WALLET, { params: { userId } });
      return response.data.balance as number;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw new Error('Failed to fetch wallet balance');
    }
  }

  async getMyEnrollments(userId: string): Promise<IEnrollment[]> {
    try {
      const response = await studentInstance.get(`${API_ENDPOINTS.AUTH.COURSES}/me/enrollments`, {
        params: { userId },
      });
      return response.data.enrollments as IEnrollment[];
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw new Error('Failed to fetch enrollments');
    }
  }

  async initiateRazorpayPayment(courseId: string, amount: number, courseTitle: string): Promise<void> {
    try {
      // Create order
      const orderResponse = await this.createOrder(courseId, amount);
      if (! orderResponse.success) {
        throw new Error('Failed to create order');
      }

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await this.loadRazorpayScript();
      }

      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_XnSWcDHvXwMKdf',
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'LaLingua',
        description: `Payment for ${courseTitle}`,
        order_id: orderResponse.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Enroll the course with payment details
            const enrollmentResponse = await this.enrollCourse(courseId, {
              paymentMethod: 'razorpay',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (enrollmentResponse.success) {
              toast.success('Payment successful! You have been enrolled in the course.');
              window.location.href = '/enrollments';
            } else {
              toast.error('Payment successful but enrollment failed. Please contact support.');
            }
          } catch (error) {
            console.error('Enrollment error:', error);
            toast.error('Payment successful but enrollment failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Asniya', // Replace with dynamic user data
          email: 'asniya737@gmail.com', // Replace with dynamic user data
          contact: '8301026583', // Replace with dynamic user data
        },
        theme: {
          color: '#8B5252',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            toast.info('Payment cancelled');
          },
        },
      };

      // Open Razorpay payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
      throw error;
    }
  }

  

  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  }
}

export const paymentService = new PaymentService();