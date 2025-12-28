import crypto from 'crypto';

// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map();

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOTP = (phone, otp) => {
  const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(phone, { otp, expiryTime });
  
  // Auto cleanup after expiry
  setTimeout(() => {
    otpStore.delete(phone);
  }, 10 * 60 * 1000);
};

export const verifyOTP = (phone, inputOTP) => {
  const stored = otpStore.get(phone);
  
  if (!stored) {
    return { success: false, message: 'OTP not found or expired' };
  }
  
  if (Date.now() > stored.expiryTime) {
    otpStore.delete(phone);
    return { success: false, message: 'OTP expired' };
  }
  
  if (stored.otp !== inputOTP) {
    return { success: false, message: 'Invalid OTP' };
  }
  
  otpStore.delete(phone);
  return { success: true, message: 'OTP verified successfully' };
};

export const sendOTP = async (phone, otp) => {
  // In production, integrate with SMS service like Twilio, AWS SNS, etc.
  console.log(`SMS OTP: ${otp} sent to ${phone}`);
  
  // For demo, we'll just log it
  return {
    success: true,
    message: `OTP sent to ${phone}`,
    // In demo mode, return OTP for testing
    demoOTP: otp
  };
};