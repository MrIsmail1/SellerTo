import express from 'express';
import { createPaymentSession, createUniquePaymentLink, createRefund} from '../controllers/paymentController.js';
import { checkAuth } from '../middlewares/checkAuth.js';
import {checkRole} from "../middlewares/checkRole.js";

const router = express.Router();

router.post('/', checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), createPaymentSession);
router.post('/unique-payment-link', checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), createUniquePaymentLink);
router.post('/refund', checkAuth, checkRole(["User", "Admin", "SuperAdmin"]),  createRefund);

export default router;
