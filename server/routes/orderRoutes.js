import express from 'express';
import { getUserOrders } from '../controllers/orderController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();

// Route to get user's orders
router.get('/user/orders', checkAuth, getUserOrders);

export default router;
