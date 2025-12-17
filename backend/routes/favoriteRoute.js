import express from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController.js';
import authMiddleware from '../middleware/auth.js';

const favoriteRouter = express.Router();

favoriteRouter.post('/add', authMiddleware, addFavorite);
favoriteRouter.post('/list', authMiddleware, getFavorites);
favoriteRouter.post('/remove', authMiddleware, removeFavorite);

export default favoriteRouter;