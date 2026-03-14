import { Router } from 'express';
import multer from 'multer';
import { uploadCsv } from '../controllers/csvController.js';
import { protect } from '../middleware/authMiddleware.js';

const upload = multer({ storage: multer.memoryStorage() });

export const csvRouter = Router();

csvRouter.post('/csv', protect, upload.single('file'), uploadCsv);
