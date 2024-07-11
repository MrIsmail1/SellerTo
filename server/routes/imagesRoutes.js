import { Router } from "express";

import {
  addImagesToProduct,
  createProductWithImages,
  deleteProductImage,
} from "../controllers/imagesController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = Router();

router.post("/products/images", checkAuth, createProductWithImages);
router.post("/products/:productId/images", checkAuth, addImagesToProduct);
router.delete(
  "/products/:productId/images/:imageId",
  checkAuth,
  deleteProductImage
);

export default router;
