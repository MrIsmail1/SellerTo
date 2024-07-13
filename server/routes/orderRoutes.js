import express from 'express';
import { getOrderById, getUserOrders } from '../controllers/orderController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, getUserOrders);
router.get('/:id', checkAuth, getOrderById);

export default router;
