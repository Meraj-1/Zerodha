import express from 'express';
import { updateProfile } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.put('/profile', authenticateToken, updateProfile);

export default router;