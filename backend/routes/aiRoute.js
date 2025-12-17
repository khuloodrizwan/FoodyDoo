import express from 'express';
import { getAIRecommendation, getQuickSuggestions, searchMenu } from '../controllers/aiController.js';
import authMiddleware from '../middleware/auth.js';

const aiRouter = express.Router();

// AI recommendation endpoint (optional auth)
aiRouter.post('/recommend', async (req, res, next) => {
  if (req.headers.token) {
    authMiddleware(req, res, () => {
      next();
    });
  } else {
    next();
  }
}, getAIRecommendation);

// Quick suggestions endpoint
aiRouter.get('/suggestions', getQuickSuggestions);

// Search menu endpoint
aiRouter.post('/search', searchMenu);

export default aiRouter;