import express from 'express';
import { validatePromoCode } from '../controllers/promoCodeController.js';

const router = express.Router();

router.post('/validate', validatePromoCode);

export default router;
