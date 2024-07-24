import express from "express";
import {
  generateInvoice,
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
  getUserOrders,
  getDashboardData
);
router.get(
  "/dashboard",
  checkAuth,
  checkRole(["User", "Admin", "SuperAdmin"]),
  getDashboardData
);
router.get("/all", checkAuth, checkRole(["Admin", "SuperAdmin"]), getOrders);
router.post(
  "/invoice",
  checkAuth,
  checkRole(["User", "Admin", "SuperAdmin"]),
  generateInvoices
);
router.post(
  "/generate/invoice",
  checkAuth,
  checkRole(["User", "Admin", "SuperAdmin"]),
  generateInvoice
);

export default router;
