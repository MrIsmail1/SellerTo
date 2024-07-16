import express from 'express';
import {getUserOrders} from '../controllers/orderController.js';
import {checkAuth} from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, getUserOrders);

export default router;
