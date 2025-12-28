import express from 'express';
import { updateProfile, upload } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.put('/profile', authMiddleware, upload.single('avatar'), updateProfile);

export default router;