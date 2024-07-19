import express from 'express';
import { getAllStock, createStock, deleteStock } from '../controllers/stockController.js';

const router = express.Router();

router.get('/', getAllStock);
router.post('/', createStock);
router.delete('/:id', deleteStock);

export default router;
