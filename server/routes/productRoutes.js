import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  patchProduct,
  searchProductByTitleOrDescription,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/search", searchProductByTitleOrDescription);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.patch("/:id", patchProduct);
router.delete("/:id", deleteProduct);

export default router;
