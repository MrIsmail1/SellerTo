import express from 'express';
import { validatePromoCode, createPromoCode, updatePromoCode, deletePromoCode, getAllPromoCodes } from '../controllers/promoCodeController.js';
import {checkRole} from "../middlewares/checkRole.js";

const router = express.Router();

router.get('/', getAllPromoCodes, checkRole(["Admin", "SuperAdmin"]));
router.post('/', createPromoCode, checkRole(["Admin", "SuperAdmin"]));
router.put('/:id', updatePromoCode, checkRole(["Admin", "SuperAdmin"]));
router.post('/validate', validatePromoCode);
router.delete('/:id', deletePromoCode, checkRole(["Admin", "SuperAdmin"]));

export default router;
