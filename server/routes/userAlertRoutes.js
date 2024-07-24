import express from 'express';
import {getAlertsByUserId, getAlertsByUserIdAndProductId, getAlertsByUserIdAndCategory, updateUserAlerts, sendNewsletter} from '../controllers/userAlertController.js';
import {checkAuth} from "../middlewares/checkAuth.js";
import {checkRole} from "../middlewares/checkRole.js";

const router = express.Router();

router.post('/send-newsletter', checkAuth, checkRole(["Admin", "SuperAdmin"]), sendNewsletter);
router.get('/:userId', checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), getAlertsByUserId);
router.get('/:userId/:productId', checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), getAlertsByUserIdAndProductId);
router.get('/category/:userId/:category', checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), getAlertsByUserIdAndCategory);
router.put('/', checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), updateUserAlerts);

export default router;
