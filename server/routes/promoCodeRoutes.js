import express from "express";
import {createPromoCode, deletePromoCode, findPromoCodeById, getAllPromoCodes, patchPromoCode, updatePromoCode, validatePromoCode,} from "../controllers/promoCodeController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router.get("/", getAllPromoCodes, checkAuth, checkRole(["Admin", "SuperAdmin"]));
router.post("/", createPromoCode, checkAuth, checkRole(["Admin", "SuperAdmin"]));
router.get("/:id", findPromoCodeById, checkAuth, checkRole(["Admin", "SuperAdmin"]));
router.put("/:id", updatePromoCode, checkAuth, checkRole(["Admin", "SuperAdmin"]));
router.patch("/:id", patchPromoCode, checkAuth, checkRole(["Admin", "SuperAdmin"]));
router.post("/validate", checkAuth, checkRole(["User", "Admin", "SuperAdmin"]), validatePromoCode);
router.delete("/:id", deletePromoCode, checkAuth, checkRole(["Admin", "SuperAdmin"]));

export default router;
