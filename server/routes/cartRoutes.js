import express from 'express';
import { addToCart, removeFromCart, getCart, updateCartQuantity } from '../controllers/cartController.js';
import { checkAuth } from '../middlewares/checkAuth.js';
import {checkRole} from "../middlewares/checkRole.js";

const router = express.Router();

router.post('/', checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), addToCart);
router.delete('/', checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), removeFromCart);
router.put('/', checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), updateCartQuantity);
router.get('/', checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), getCart);

export default router;
