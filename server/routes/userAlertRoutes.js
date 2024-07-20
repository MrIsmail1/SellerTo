import express from 'express';
import { addUserAlert } from '../controllers/userAlertController.js';

const router = express.Router();

router.post('/user-alerts', addUserAlert);

export default router;
