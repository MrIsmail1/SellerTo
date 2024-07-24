import express from "express";
import {
  createWidget,
  deleteWidget,
  getAllWidgets,
  updateWidget,
} from "../controllers/widgetController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router.post("/", checkAuth, checkRole(["Admin", "SuperAdmin"]), createWidget);
router.put("/:id", checkAuth, checkRole(["Admin", "SuperAdmin"]), updateWidget);
router.delete("/:id", checkAuth, checkRole(["Admin", "SuperAdmin"]), deleteWidget);
router.get("/", checkAuth, checkRole(["Admin", "SuperAdmin"]), getAllWidgets);

export default router;
