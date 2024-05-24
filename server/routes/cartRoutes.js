import express from 'express';
import { addToCart, removeFromCart, getCart, updateCartQuantity, cleanExpiredCarts } from '../controllers/cartController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/add', checkAuth, addToCart);
router.post('/remove', checkAuth, removeFromCart);
router.put('/update', checkAuth, updateCartQuantity);
router.get('/', checkAuth, getCart);
router.post('/clean-expired', cleanExpiredCarts);

export default router;