import { Router } from "express";
import {
  createUser,
  deleteUserAccount,
  getUserById,
  getUserProfile,
  getUsers,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.get("/profile", checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), getUserProfile);
router.get("/:id", checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), getUserById);
router.delete("/:id", checkAuth, checkRole(["Admin"]), deleteUserAccount);
router.put("/update", checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), updateUserProfile);
router.patch("/:id", checkAuth, checkRole(["Admin", "SuperAdmin"]), updateUser);
router.get("/", checkAuth, checkRole(["Admin", "SuperAdmin"]), getUsers);
router.post("/", checkAuth, checkRole(["Admin", "SuperAdmin"]), createUser);

export default router;
