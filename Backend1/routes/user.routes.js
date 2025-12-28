import express from 'express';
import { updateProfile } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.put('/profile', authMiddleware, updateProfile);

export default router;