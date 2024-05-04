import express from 'express';
import {register, login, logout, forgotPassword, resetPassword} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetPassword/:token', resetPassword);

export default router;