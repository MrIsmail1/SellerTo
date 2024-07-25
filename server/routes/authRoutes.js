import express from 'express';
import {register, login, logout, forgotPassword, resetPassword, confirmEmail, changePassword} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.get('/confirm/:token', confirmEmail);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetPassword/:token', resetPassword);
router.post('/changePassword', changePassword);

export default router;