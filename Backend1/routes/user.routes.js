import express from 'express';
import { updateProfile, addFunds, withdrawFunds, getTransactionHistory, getBalance } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.put('/profile', authMiddleware, updateProfile);
router.post('/add-funds', authMiddleware, addFunds);
router.post('/withdraw-funds', authMiddleware, withdrawFunds);
router.get('/transactions', authMiddleware, getTransactionHistory);
router.get('/balance', authMiddleware, getBalance);

export default router;