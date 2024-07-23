import express from "express";
import {
    createWidget,
    updateWidget,
    deleteWidget,
    getAllWidgets,
    testCalculateData
} from "../controllers/widgetController.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

router.post("/", createWidget);
router.put("/:id", checkAuth, checkRole(["Admin", "SuperAdmin"]), updateWidget);
router.delete("/:id", checkAuth, checkRole(["Admin", "SuperAdmin"]), deleteWidget);
router.get("/", checkAuth, checkRole(["Admin", "SuperAdmin"]), getAllWidgets);
router.post("/test-calculate-data", testCalculateData);

export default router;
