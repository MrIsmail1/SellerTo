import express from 'express';
import { createPaymentSession } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', createPaymentSession);

export default router;
