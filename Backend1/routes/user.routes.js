import express from 'express';
import { updateProfile, sendPhoneOTP, verifyPhoneOTP } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.put('/profile', authMiddleware, updateProfile);
router.post('/send-phone-otp', authMiddleware, sendPhoneOTP);
router.post('/verify-phone-otp', authMiddleware, verifyPhoneOTP);

export default router;