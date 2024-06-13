import { Router } from 'express';
import { getUserProfile, deleteUserAccount, updateUser } from '../controllers/userController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = Router();

router.get('/', checkAuth, getUserProfile);
router.delete('/delete', checkAuth, deleteUserAccount);
router.put('/update', checkAuth, updateUser);

export default router;
