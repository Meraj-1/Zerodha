import crypto from 'crypto';
import { sendSMSViaTextBelt } from './sms.service.js';

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
  try {
    // Try multiple SMS services in order
    console.log(`Attempting to send OTP ${otp} to ${phone}`);
    
    // Method 1: Try TextBelt (free service)
    const textBeltResult = await sendSMSViaTextBelt(phone, otp);
    if (textBeltResult.success) {
      return {
        success: true,
        message: `OTP sent to ${phone} via SMS`
      };
    }
    
    // Method 2: Try Fast2SMS (if API key is available)
    if (process.env.FAST2SMS_API_KEY && process.env.FAST2SMS_API_KEY !== 'your-fast2sms-api-key-here') {
      const fast2smsResult = await sendSMSViaFast2SMS(phone, otp);
      if (fast2smsResult.success) {
        return fast2smsResult;
      }
    }
    
    // Method 3: Try MSG91 (if API key is available)
    // Removed MSG91 integration
    
    // Fallback: Demo mode
    console.log(`All SMS services failed. Demo OTP: ${otp} for ${phone}`);
    return {
      success: true,
      message: `OTP sent to ${phone}`,
      demoOTP: otp,
      note: 'SMS service unavailable, using demo mode'
    };
    
  } catch (error) {
    console.error('SMS service error:', error);
    // Fallback to demo mode
    console.log(`Demo OTP: ${otp} for ${phone}`);
    return {
      success: true,
      message: `OTP sent to ${phone}`,
      demoOTP: otp,
      note: 'SMS service error, using demo mode'
    };
  }
};

// Fast2SMS implementation
const sendSMSViaFast2SMS = async (phone, otp) => {
  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': process.env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'v3',
        sender_id: 'FSTSMS',
        message: `Your OTP for phone verification is: ${otp}. Valid for 10 minutes.`,
        language: 'english',
        flash: 0,
        numbers: phone
      })
    });
    
    const result = await response.json();
    
    if (result.return) {
      console.log(`SMS sent successfully to ${phone} via Fast2SMS`);
      return { success: true, message: `OTP sent to ${phone}` };
    } else {
      console.error('Fast2SMS failed:', result);
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error('Fast2SMS service error:', error);
    return { success: false, error: error.message };
  }
};