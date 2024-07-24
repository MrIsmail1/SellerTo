import express from "express";
import {
  createStock,
  deleteStock,
  findStockById,
  getAllStock,
  patchStock,
  updateStock,
} from "../controllers/stockController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkRole } from "../middlewares/checkRole.js";
console.log(checkAuth);
const router = express.Router();

router.get("/", getAllStock, checkAuth, checkRole(["Admin", "SuperAdmin"]));
router.post("/", createStock, checkAuth, checkRole(["Admin", "SuperAdmin"]));
router.get(
  "/:id",
  findStockById,
  checkAuth,
  checkRole(["Admin", "SuperAdmin"])
);
router.patch("/:id", patchStock, checkAuth, checkRole(["Admin", "SuperAdmin"]));
router.delete(
  "/:id",
  deleteStock,
  checkAuth,
  checkRole(["Admin", "SuperAdmin"])
);
router.put("/:id", updateStock, checkAuth, checkRole(["Admin", "SuperAdmin"]));

export default router;
