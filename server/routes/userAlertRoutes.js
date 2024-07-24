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

// TODO: Faire du restfull ici
router.post('/send-newsletter', checkAuth, checkRole(["Admin", "SuperAdmin"]), sendNewsletter);
router.get('/user-alerts/:userId', checkAuth, getAlertsByUserId);
router.get('/user-alerts/:userId/:productId', checkAuth, getAlertsByUserIdAndProductId);
router.get('/user-alerts/category/:userId/:category', checkAuth, getAlertsByUserIdAndCategory);
router.put('/user-alerts', checkAuth, updateUserAlerts);

export default router;
