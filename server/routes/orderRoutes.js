import express from 'express';
import {getUserOrders, getDashboardData} from '../controllers/orderController.js';
import {checkAuth} from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, getUserOrders);
router.get('/dashboard', getDashboardData);

export default router;
