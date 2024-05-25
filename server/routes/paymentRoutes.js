import express from 'express';
import { createPaymentSession, createUniquePaymentLink, createRefund} from '../controllers/paymentController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/', createPaymentSession);
router.post('/unique-payment-link', createUniquePaymentLink);
router.post('/refund', checkAuth, createRefund);

export default router;
