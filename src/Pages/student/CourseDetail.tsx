import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '@/services/coursePublicService';
import { paymentService } from '@/services/paymentService';
import { userService } from '@/services/userService';
import { toast } from 'react-toastify';
import { ICourse } from '@/interface/course';


export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!courseId) return;

    (async () => {
      try {
        // Fetch course details
        const res = await getCourseById(courseId);
        setCourse(res.course || res);

        // Check enrollment status
        const enrollmentCheck = await paymentService.checkEnrollmentStatus(courseId);
        setIsEnrolled(enrollmentCheck.isEnrolled);

        
      } catch (error) {
        console.error('Error fetching course or enrollment status:', error);
        toast.error('Failed to load course details or enrollment status');
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  const handlePayment = async (paymentMethod: 'razorpay' | 'wallet') => {
    if (!courseId || !course) return;

    if (!userService.isAuthenticated()) {
      toast.error('Please login to enroll in this course');
      return;
    }

    setPaymentProcessing(true);

    try {
      if (paymentMethod === 'razorpay') {
        await paymentService.initiateRazorpayPayment(courseId, course.regularPrice, course.courseTitle);
        setIsEnrolled(true); // Set after successful enrollment in initiateRazorpayPayment
      } else if (paymentMethod === 'wallet') {
        if (walletBalance === null || walletBalance < course.regularPrice) {
          toast.error('Insufficient wallet balance');
          setPaymentProcessing(false);
          return;
        }

        const enrollmentResponse = await paymentService.enrollCourse(courseId, {
          paymentMethod: 'wallet',
          walletTransactionId: `wallet_${Date.now()}`,
        });

        if (enrollmentResponse.success) {
          setIsEnrolled(true);
          setWalletBalance((prev) => (prev !== null ? prev - course.regularPrice : null));
          toast.success('Payment successful using wallet! You are now enrolled.');
          window.location.href = '/enrollments';
        } else {
          toast.error('Wallet payment failed. Contact support.');
        }
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!course) return <div className="p-6">Course not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <img src={course.imageUrl} alt={course.courseTitle} className="w-full h-64 object-cover rounded" />
      <h1 className="text-2xl font-bold mt-4">{course.courseTitle}</h1>
      <p className="mt-2 text-gray-700">{course.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-semibold">₹{course.regularPrice}</span>
        <div className="flex gap-3">
          <button
            disabled={paymentProcessing || isEnrolled}
            onClick={() => handlePayment('razorpay')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentProcessing ? 'Processing...' : isEnrolled ? 'Enrolled' : 'Pay with Razorpay'}
          </button>
          <button
            disabled={paymentProcessing || isEnrolled || walletBalance === null}
            onClick={() => handlePayment('wallet')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentProcessing ? 'Processing...' : isEnrolled ? 'Enrolled' : 'Pay with Wallet'}
          </button>
        </div>
      </div>
      {walletBalance !== null && (
        <div className="mt-2 text-gray-600">Wallet Balance: ₹{walletBalance}</div>
      )}
    </div>
  );
}