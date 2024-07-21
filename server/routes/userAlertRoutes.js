import express from 'express';
import { addUserAlert, getAlertsByUserId, getAlertsByUserIdAndProductId, getAlertsByUserIdAndCategory, updateUserAlerts } from '../controllers/userAlertController.js';

const router = express.Router();

router.post('/user-alerts', addUserAlert);
router.get('/user-alerts/:userId', getAlertsByUserId);
router.get('/user-alerts/:userId/:productId', getAlertsByUserIdAndProductId);
router.get('/user-alerts/category/:userId/:category', getAlertsByUserIdAndCategory);
router.put('/user-alerts', updateUserAlerts);

export default router;
