import { Router } from 'express';
import { createMessage, getMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

export const messageRouter = Router();

messageRouter.get('/', protect, getMessages);
messageRouter.post('/', protect, createMessage);
