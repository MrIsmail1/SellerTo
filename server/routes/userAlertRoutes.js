import express from 'express';
import {
    getAlertsByUserId,
    getAlertsByUserIdAndProductId,
    getAlertsByUserIdAndCategory,
    updateUserAlerts,
    sendNewsletter
} from '../controllers/userAlertController.js';
import {checkAuth} from "../middlewares/checkAuth.js";
import {checkRole} from "../middlewares/checkRole.js";

const router = express.Router();

router.post('/send-newsletter', checkAuth, checkRole(["Admin", "SuperAdmin"]), sendNewsletter);
router.get('/:userId', checkAuth, getAlertsByUserId);
router.get('/:userId/:productId', checkAuth, getAlertsByUserIdAndProductId);
router.get('/category/:userId/:category', checkAuth, getAlertsByUserIdAndCategory);
router.put('/', checkAuth, updateUserAlerts);

export default router;
