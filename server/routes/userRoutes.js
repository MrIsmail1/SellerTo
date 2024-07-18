import { Router } from "express";
import {
  deleteUserAccount,
  getUserProfile,
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.get(
  "/profile",
  checkAuth,
  checkRole(["User", "Admin", "SuperAdmin"]),
  getUserProfile
);

router.delete("/:id", checkAuth, checkRole(["Admin"]), deleteUserAccount);

router.put("/", checkAuth, checkRole(["Admin", "SuperAdmin"]), updateUser);

router.get("/", checkAuth, checkRole(["Admin", "SuperAdmin"]), getUsers);

router.post("/", checkAuth, checkRole(["Admin", "SuperAdmin"]), updateUser);

export default router;
