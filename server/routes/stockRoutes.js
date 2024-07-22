import express from 'express';
import {
    getAllStock,
    createStock,
    deleteStock,
    updateStock,
    findStockById,
    patchStock
} from '../controllers/stockController.js';
import {checkRole} from "../middlewares/checkRole.js";

const router = express.Router();

router.get('/', getAllStock, checkRole(["Admin", "SuperAdmin"]));
router.post('/', createStock, checkRole(["Admin", "SuperAdmin"]));
router.get('/:id', findStockById, checkRole(["Admin", "SuperAdmin"]));
router.patch('/:id', patchStock, checkRole(["Admin", "SuperAdmin"]));
router.delete('/:id', deleteStock, checkRole(["Admin", "SuperAdmin"]));
router.put('/:id', updateStock, checkRole(["Admin", "SuperAdmin"]));


export default router;
