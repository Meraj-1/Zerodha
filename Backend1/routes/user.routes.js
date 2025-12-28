import express from 'express';
import { updateProfile, upload } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.put('/profile', authenticateToken, upload.single('avatar'), updateProfile);

export default router;