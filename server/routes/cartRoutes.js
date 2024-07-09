import express from 'express';
import { addToCart, removeFromCart, getCart, updateCartQuantity } from '../controllers/cartController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/', checkAuth, addToCart);
router.delete('/', checkAuth, removeFromCart);
router.put('/', checkAuth, updateCartQuantity);
router.get('/', checkAuth, getCart);
/* router.post('/clean-expired', cleanExpiredCarts); */

export default router;
