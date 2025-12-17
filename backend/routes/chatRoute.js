import express from 'express';
import { saveChatMessage, getChatHistory, clearChatHistory } from '../controllers/chatController.js';
import authMiddleware from '../middleware/auth.js';

const chatRouter = express.Router();

chatRouter.post('/save', authMiddleware, saveChatMessage);
chatRouter.post('/history', authMiddleware, getChatHistory);
chatRouter.post('/clear', authMiddleware, clearChatHistory);

export default chatRouter;