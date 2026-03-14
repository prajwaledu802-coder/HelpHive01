import { Router } from 'express';
import { createDisaster, getDisasters } from '../controllers/disasterController.js';
import { protect } from '../middleware/authMiddleware.js';

export const disasterRouter = Router();

disasterRouter.get('/', protect, getDisasters);
disasterRouter.post('/', protect, createDisaster);
