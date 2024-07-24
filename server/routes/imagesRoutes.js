import { Router } from "express";

import {
  addImagesToProduct,
  createProductWithImages,
  deleteProductImage,
  getImageId,
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
router.get("/product/images/uploads/:imageUrl", getImageId);
router.delete(
  "/products/:productId/images/:imageId",
  checkAuth,
  checkRole(["Admin", "SuperAdmin"]),
  deleteProductImage
);

export default router;
