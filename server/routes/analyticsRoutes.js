import { Router } from 'express';
import {
  getAnalyticsSummary,
  getEventParticipation,
  getLeaderboard,
  getResourceUsage,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

export const analyticsRouter = Router();

analyticsRouter.get('/', protect, getAnalyticsSummary);
analyticsRouter.get('/resource-usage', protect, getResourceUsage);
analyticsRouter.get('/event-participation', protect, getEventParticipation);
analyticsRouter.get('/leaderboard', protect, getLeaderboard);
