# Payment Setup Guide

## Razorpay Integration

### Frontend Setup

1. Create a `.env` file in the frontend directory:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
```

2. Replace `rzp_test_YOUR_ACTUAL_KEY_ID` with your actual Razorpay test key ID.

### Backend Setup

1. Make sure your backend has the following environment variables:
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET
```

### Payment Flow

1. User clicks "Pay & Enroll" button
2. Frontend creates order via `/auth/courses/create-order`
3. Backend creates Razorpay order
4. Frontend opens Razorpay payment modal
5. User completes payment
6. Razorpay calls success handler
7. Frontend calls enrollment API with payment details
8. Backend verifies payment and enrolls user

### Testing

For testing, you can use Razorpay's test cards:
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

### Error Handling

The payment flow includes proper error handling for:
- Payment failures
- Network errors
- Invalid payment details
- Enrollment failures

### Security

- All payment verification happens on the backend
- Payment signatures are verified
- User authentication is required for all payment operations



