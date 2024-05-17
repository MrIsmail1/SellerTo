import express from 'express';
import { addToCart, removeFromCart, getCart } from '../controllers/cartController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/add', checkAuth, addToCart);
router.post('/remove', checkAuth, removeFromCart);
router.get('/', checkAuth, getCart);

export default router;
