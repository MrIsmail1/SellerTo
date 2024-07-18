import express from 'express';
import { validatePromoCode } from '../controllers/promoCodeController.js';

const router = express.Router();

router.post('/promocodes/validate', validatePromoCode);

export default router;
