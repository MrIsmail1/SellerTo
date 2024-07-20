import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  patchProduct,
  updateProduct,
} from "../controllers/productController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", checkAuth, checkRole(["Admin", "SuperAdmin"]), createProduct);

router.put(
  "/:id",
  checkAuth,
  checkRole(["Admin", "SuperAdmin"]),
  updateProduct
);

router.patch(
  "/:id",
  checkAuth,
  checkRole(["Admin", "SuperAdmin"]),
  patchProduct
);

router.delete(
  "/:id",
  checkAuth,
  checkRole(["Admin", "SuperAdmin"]),
  deleteProduct
);

export default router;
