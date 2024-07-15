import { Router } from "express";
import {
  deleteUserAccount,
  getUserProfile,
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = Router();

router.get("/profile", checkAuth, getUserProfile);
router.delete("/delete", checkAuth, deleteUserAccount);
router.put("/update", checkAuth, updateUser);
router.get("/", checkAuth, getUsers);

export default router;
