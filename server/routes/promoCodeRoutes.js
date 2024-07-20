import express from 'express';
import { validatePromoCode, createPromoCode, updatePromoCode, deletePromoCode, getAllPromoCodes } from '../controllers/promoCodeController.js';

const router = express.Router();

router.get('/', getAllPromoCodes);
router.post('/', createPromoCode);
router.put('/:id', updatePromoCode);
router.post('/validate', validatePromoCode);
router.delete('/:id', deletePromoCode);

export default router;
