import express from "express";
import {
  generateInvoices,
  getDashboardData,
  getOrders,
  getUserOrders,
} from "../controllers/orderController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router.get(
  "/",
  checkAuth,
  checkRole(["User", "Admin", "SuperAdmin"]),
  getUserOrders
);
router.post(
  "/dashboard",
  checkAuth,
  checkRole(["Admin", "SuperAdmin"]),
  getDashboardData
);
router.get("/all", checkAuth, checkRole(["Admin", "SuperAdmin"]), getOrders);
router.post(
  "/invoice",
  checkAuth,
  checkRole(["Admin", "SuperAdmin"]),
  generateInvoices
);

export default router;
