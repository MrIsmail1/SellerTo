import { Router } from 'express';
import { getUserProfile, deleteUserAccount } from '../controllers/userController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = Router();

router.get('/', checkAuth, getUserProfile);
router.delete('/delete', checkAuth, deleteUserAccount);

export default router;
