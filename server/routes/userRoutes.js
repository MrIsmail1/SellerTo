import { Router } from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = Router();

router.get('/', checkAuth, getUserProfile);

export default router;
