import { Router } from "express";

import {
  addImagesToProduct,
  createProductWithImages,
  deleteProductImage,
} from "../controllers/imagesController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.post(
  "/products/images",
  checkAuth,
  checkRole(["Admin", "SuperAdmin"]),
  createProductWithImages
);
router.post(
  "/products/:productId/images",
  checkAuth,
  checkRole(["Admin", "SuperAdmin"]),
  addImagesToProduct
);
router.delete(
  "/products/:productId/images/:imageId",
  checkAuth,
  deleteProductImage
);

export default router;
