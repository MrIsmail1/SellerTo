import express from 'express';
import { addToCart, removeFromCart, getCart, updateCartQuantity } from '../controllers/cartController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/add', checkAuth, addToCart);
router.post('/remove', checkAuth, removeFromCart);
router.put('/update', checkAuth, updateCartQuantity);
router.get('/', checkAuth, getCart);

export default router;