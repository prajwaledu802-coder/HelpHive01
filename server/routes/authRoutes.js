import { Router } from 'express';
import { googleAuth, login, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/google', googleAuth);
authRouter.get('/me', protect, me);
